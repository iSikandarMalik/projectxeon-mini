import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAccountDto } from './dtos/create-account.dto';
import { Account } from './entities/account.entity';
import { UpdateAccountDto } from './dtos/update-account.dto';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Post()
  async create(
    @Body(ValidationPipe) createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  async findAll(): Promise<Account[]> {
    return this.accountService.findAll();
  }

  @Get(':account_id')
  async findOne(@Param('account_id') accountId: string): Promise<Account> {
    return this.accountService.findOne(accountId);
  }

  @Get('/company/:company_id')
  async getAccountsForCompany(@Param('company_id') companyId: string) {
    return this.accountService.getAccountsForCompany(companyId);
  }

  @Put(':account_id')
  async update(
    @Param('account_id') accountId: string,
    @Body(ValidationPipe) updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountService.update(accountId, updateAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.accountService.remove(id);
  }
}
