import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiOrFrontendMiddleware } from './common/middleware/api-or-frontend.middleware';
import { APP_GUARD } from '@nestjs/core';
import { ApiCallGuard } from './modules/auth/api-call.guard';
import typeorm from './config/typeorm';

import { CompanyModule } from './modules/company/company.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SessionModule } from './modules/session/session.module';
import { CommonModule } from './modules/common/common.module';
import { AssetModule } from './modules/asset/asset.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { NodeModule } from './modules/asset-node/node.module';
import { NetworksModule } from './modules/asset-networks/networks.module';
import { FeeSchemeModule } from './modules/asset-fee-scheme/asset-fee-scheme.module';
import { AccountModule } from './modules/account/account.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { CompanyNodeModule } from './modules/company-node/company-node.module';
import { CompanyFeeSchemeModule } from './modules/company-fee-scheme/company-fee-scheme.module';
import { CompanyTeamsModule } from './modules/company-teams/company-teams.module';
import { PrivateNotesModule } from './modules/private-notes/private-notes.module';
import { WalletUsersModule } from './wallet-users/wallet-users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [typeorm], // Load the TypeORM config
    }),
    AuthModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    SessionModule,
    CompanyModule,
    AssetModule,
    VendorModule,
    WalletModule,
    TransactionModule,
    AccountModule,
    CommonModule,
    NodeModule,
    NetworksModule,
    FeeSchemeModule,
    CompanyNodeModule,
    CompanyFeeSchemeModule,
    CompanyTeamsModule,
    PrivateNotesModule,
    WalletUsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ApiCallGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiOrFrontendMiddleware).forRoutes('*');
  }
}
