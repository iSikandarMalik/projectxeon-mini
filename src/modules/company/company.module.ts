import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { UserModule } from '../user/user.module';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AuthModule } from '../auth/auth.module';
import { IbaneraProviderModule } from '../provider/ibanera/ibanera.module';
import { ThirteenxProviderModule } from '../provider/thirteenx/thirteenx.module';
import { CompanyAdditionalInfo } from './entities/company-additional-info.entity';
import { CompanyNode } from '../company-node/entity/company-node.entity';
import { CompanyFeeScheme } from '../company-fee-scheme/entity/company-fee-scheme.entity';
import { AccountService } from '../account/account.service';
import { PrivateNotes } from '../private-notes/entity/private-notes.entity';
import { AccountModule } from '../account/account.module';
import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      CompanyAdditionalInfo,
      CompanyNode,
      CompanyFeeScheme,
      AccountService,
      PrivateNotes,
    ]),
    AuthModule,
    ThirteenxProviderModule,
    IbaneraProviderModule,
    UserModule,
    AccountModule,
    CompanyModule,
    AssetModule,
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
