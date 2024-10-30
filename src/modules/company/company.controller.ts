import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { isUUID } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AllowPublicCall } from 'src/common/decorators/allow-public-call.decorator';
import { CreateCompanyDto } from './dto/company/create-company.dto';
import { UpdateCompanyDto } from './dto/company/update-company.dto';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { AllowApiCall } from 'src/common/decorators/allow-api-call.decorator';
import { CreateCompanyAdditionalInfoDto } from './dto/company-additional-info/create-company-additional-info.dto';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly authService: AuthService,
  ) {}

  @AllowPublicCall()
  @Get('check/:company_id')
  async checkCompany(@Param('company_id') companyId: string): Promise<Company> {
    if (!isUUID(companyId)) {
      throw new BadRequestException('Invalid company ID format');
    }
    const company = await this.companyService.check(companyId);
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found.`);
    }
    return company;
  }

  @UseGuards(JwtAuthGuard)
  @AllowApiCall()
  @Get('all')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async listCompanies(@Req() rtq: Request): Promise<Company[]> {
    return this.companyService.fetchAllCompanies();
  }

  @AllowPublicCall()
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    createCompanyDto.status = false;
    createCompanyDto.active = false;
    return this.companyService.create(createCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @AllowApiCall()
  @Patch(':company_id/admit')
  async admit(
    @Req() req: Request,
    @Param('company_id') company_id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    updateCompanyDto.active = true;
    updateCompanyDto.status = true;

    return this.companyService.admit(req, company_id, updateCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @AllowApiCall()
  @Patch(':company_id/update')
  async update(
    @Param('company_id') company_id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companyService.update(company_id, updateCompanyDto);
  }

  @UseGuards(JwtAuthGuard)
  @AllowApiCall()
  @Delete(':company_id/delete')
  softDeleteCompany(@Param('company_id') companyId: string) {
    return this.companyService.softDeleteComany(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @AllowApiCall()
  @Patch(':company_id/additional-info')
  addRequestedAdditionalInfo(
    @Param('company_id') companyId: string,
    @Body() createCompanyAdditionalInfoDto: CreateCompanyAdditionalInfoDto,
  ) {
    return this.companyService.addRequestedAdditionalInfo(
      companyId,
      createCompanyAdditionalInfoDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':company_id/additional-info')
  getAdditionalInfoByCompanyId(@Param('company_id') companyId: string) {
    return this.companyService.getAdditionalInfoByCompanyId(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @AllowApiCall()
  @Get(':company_id')
  getCompanyById(@Param('company_id') companyId: string) {
    return this.companyService.getCompanyById(companyId);
  }
}
