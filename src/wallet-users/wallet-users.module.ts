import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletUsersService } from './wallet-users.service';
import { WalletUsersController } from './wallet-users.controller';
import { WalletUser } from './entities/wallet-user.entity';
import { Company } from 'src/modules/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WalletUser, Company])],
  controllers: [WalletUsersController],
  providers: [WalletUsersService],
  exports: [WalletUsersService],
})
export class WalletUsersModule {}
