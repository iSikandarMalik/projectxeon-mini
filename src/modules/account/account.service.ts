import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from './dtos/create-account.dto';
import { Company } from '../company/entities/company.entity';
import { Asset } from '../asset/entities/asset.entity';
import { UpdateAccountDto } from './dtos/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRespository: Repository<Account>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const company = await this.companyRepository.findOne({
      where: {
        company_id: createAccountDto.companyId,
      },
    });

    if (!company) {
      throw new NotFoundException(
        `company with id ${createAccountDto.companyId} does not exists`,
      );
    }

    const asset = await this.assetRepository.findOne({
      where: {
        asset_id: createAccountDto.assetId,
      },
    });

    if (!asset) {
      throw new NotFoundException(
        `asset with id ${createAccountDto.assetId} does not exists`,
      );
    }
    const account = await this.accountRespository.create({
      asset: asset,
      company: company,
    });
    return await this.accountRespository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRespository.find({
      relations: {
        company: true,
        asset: true,
      },
    });
  }

  async findOne(accountId: string): Promise<Account> {
    const account = await this.accountRespository.findOne({
      where: { account_id: accountId },
      relations: {
        company: true,
        asset: true,
      },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID "${accountId}" not found`);
    }
    return account;
  }

  async update(
    accountId: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(accountId);
    Object.assign(account, updateAccountDto);
    return await this.accountRespository.save(account);
  }

  async remove(id: string): Promise<void> {
    const result = await this.accountRespository.delete({ account_id: id });
    if (result.affected === 0) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }
  }

  async getAccountsForCompany(companyId: string) {
    return await this.accountRespository.find({
      where: {
        company: {
          company_id: companyId,
        },
      },
      relations: {
        company: true,
        asset: true,
      },
    });
  }
}
