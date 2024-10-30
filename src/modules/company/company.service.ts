import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyDto } from './dto/company/create-company.dto';
import { UpdateCompanyDto } from './dto/company/update-company.dto';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { ThirteenxProviderService } from '../provider/thirteenx/thirteenx.service';
import { CreateCompanyAdditionalInfoDto } from './dto/company-additional-info/create-company-additional-info.dto';
import { CompanyAdditionalInfo } from './entities/company-additional-info.entity';
import { AssetService } from '../asset/asset.service';
import { AccountService } from '../account/account.service';
import { CreateAccountDto } from '../account/dtos/create-account.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly thirteenxProviderService: ThirteenxProviderService,
    @InjectRepository(CompanyAdditionalInfo)
    private readonly additionalInfoRepository: Repository<CompanyAdditionalInfo>,
    private readonly assetService: AssetService,
    private readonly accountsService: AccountService,
  ) {}

  async check(company_id: string): Promise<Company | undefined> {
    return this.companyRepository.findOne({
      where: { company_id: company_id },
    });
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const company = this.companyRepository.create({
        ...createCompanyDto,
        status: false,
        active: false,
      });

      const savedCompany = await this.companyRepository.save(company);

      const assets = await this.assetService.findAll();
      const promises = assets.map((asset) => {
        const dto = new CreateAccountDto();
        dto.companyId = savedCompany.company_id;
        dto.assetId = asset.asset_id;
        return this.accountsService.create(dto);
      });

      const results = await Promise.allSettled(promises);

      // Check for any rejected promises
      const failedOperations = results.filter(
        (result) => result.status === 'rejected',
      );

      if (failedOperations.length > 0) {
        console.error('Some account creations failed:', failedOperations);
        // You might want to log this or handle it in some way
      }

      return savedCompany;
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique violation error code
        const match = error.detail.match(/Key \((.*?)\)=/);
        const field = match ? match[1] : 'unknown field';
        throw new ConflictException(
          `A company with this ${field} already exists.`,
        );
      } else if (error.code === '23502') {
        // PostgreSQL not-null violation error code
        const match = error.detail.match(/column "(.*?)"/);
        const field = match ? match[1] : 'unknown field';
        throw new BadRequestException(`${field} is required.`);
      } else if (error.code === '23503') {
        // PostgreSQL foreign key violation error code
        throw new BadRequestException('Invalid reference to a related entity.');
      } else {
        throw new BadRequestException(
          'An error occurred while creating the company. Please check your input and try again.',
        );
      }
    }
  }

  async admit(
    req: Request,
    company_id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    // const user = await this.authService.me(req);
    const company = await this.companyRepository.findOne({
      where: { company_id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${company_id} not found`);
    }

    Object.assign(company, {
      ...updateCompanyDto,
      status: true,
      active: true,
    });

    // const companyUser = await this.userService.findOneByCompanyId(company_id);

    // await this.thirteenxProviderService.createCompany(user, company);
    // await this.thirteenxProviderService.createUser(user, companyUser);

    /**** Reminder
     * Every company should have a dedicated record of the allowed blockchains they will be using,
     * select all the allowed blockchains before admiting the user and create the parent address
     * ***/
    // const wallet = await this.thirteenxProviderService.createWallet(
    //   user,
    //   companyUser,
    //   { name: 'Tron' },
    //   true,
    // );

    // await this.thirteenxProviderService.AddToken(user, companyUser, wallet, {
    //   name: 'Tether USD',
    //   blockchain: { name: 'Tron' },
    // });

    return this.companyRepository.save(company);
  }

  async update(
    company_id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { company_id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${company_id} not found`);
    }

    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

  async findChildrenCompanies(req: Request): Promise<Company[]> {
    const user = await this.authService.me(req);
    const parentCompanyId = user.company?.id;

    if (!parentCompanyId) {
      return await this.companyRepository.find();
    }

    return this.findAllChildrenCompanies(parentCompanyId);
  }

  async fetchAllCompanies() {
    const companies = await this.companyRepository.find();
    return companies;
  }

  async findAllChildrenCompanies(id: number): Promise<Company[]> {
    const childCompanies = await this.companyRepository.find({
      where: { parent: { id: id } },
      relations: ['children'],
    });

    let allDescendants: Company[] = [];

    for (const child of childCompanies) {
      allDescendants.push(child);

      const nestedChildren = await this.findAllChildrenCompanies(child.id);
      allDescendants = [...allDescendants, ...nestedChildren];
    }

    return allDescendants;
  }

  async softDeleteComany(companyId: string) {
    const company = await this.companyRepository.findOne({
      where: {
        company_id: companyId,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with id ${company} cannot be found`);
    }

    company.deleted = true;
    return await this.companyRepository.save(company);
  }
  async addRequestedAdditionalInfo(
    companyId: string,
    createCompanyAdditionalInfoDto: CreateCompanyAdditionalInfoDto,
  ) {
    const company = await this.companyRepository.findOne({
      where: {
        company_id: companyId,
      },
      relations: {
        additionalInfo: true,
      },
    });

    if (!company) {
      throw new NotFoundException(
        `Company with id ${companyId} cannot be found`,
      );
    }

    let additionalInfo: CompanyAdditionalInfo;

    if (company.additionalInfo) {
      // Update existing additional info
      additionalInfo = company.additionalInfo;
      this.additionalInfoRepository.merge(
        additionalInfo,
        createCompanyAdditionalInfoDto,
      );
    } else {
      // Create new additional info
      additionalInfo = this.additionalInfoRepository.create(
        createCompanyAdditionalInfoDto,
      );
    }

    // Save the additional info
    await this.additionalInfoRepository.save(additionalInfo);

    // Associate the additional info with the company
    company.additionalInfo = additionalInfo;

    // Save and return the updated company
    return await this.companyRepository.save(company);
  }

  async getCompanyById(companyId: string) {
    const company = await this.companyRepository.findOne({
      where: {
        company_id: companyId,
      },
      relations: {
        additionalInfo: true,
      },
    });

    if (!company) {
      throw new NotFoundException(
        `Company with id ${companyId} cannot be found`,
      );
    }
    return company;
  }

  async getAdditionalInfoByCompanyId(companyId: string) {
    const company = await this.companyRepository.findOne({
      where: {
        company_id: companyId,
      },
      relations: {
        additionalInfo: true,
      },
    });

    if (!company) {
      throw new NotFoundException(`no company with id ${companyId} exists`);
    }

    return company.additionalInfo;
  }
}
