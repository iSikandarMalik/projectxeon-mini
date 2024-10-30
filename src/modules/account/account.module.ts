import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { CommonModule } from '../common/common.module';
import { Company } from '../company/entities/company.entity';
import { Asset } from '../asset/entities/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Company, Asset]), CommonModule],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
