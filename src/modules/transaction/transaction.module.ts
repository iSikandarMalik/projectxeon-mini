import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ThirteenxProviderModule } from '../provider/thirteenx/thirteenx.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ThirteenxProviderModule, AuthModule, UserModule],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
