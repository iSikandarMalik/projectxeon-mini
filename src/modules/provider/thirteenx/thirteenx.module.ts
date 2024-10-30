import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ThirteenxProviderService } from './thirteenx.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.WALLET_JWT_SECRET,
      signOptions: {
        expiresIn: '60s',
      },
    }),
  ],
  providers: [ThirteenxProviderService],
  exports: [ThirteenxProviderService],
})
export class ThirteenxProviderModule {}
