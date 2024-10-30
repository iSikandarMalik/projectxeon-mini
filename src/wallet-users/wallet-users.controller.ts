import { Controller, Post, Body } from '@nestjs/common';
import { WalletUsersService } from './wallet-users.service';
import { CreateWalletUserDto } from './dto/create-wallet-user.dto';
import { WalletUser } from './entities/wallet-user.entity';
import { AllowPublicCall } from 'src/common/decorators/allow-public-call.decorator';

@Controller('wallet-users')
export class WalletUsersController {
  constructor(private readonly walletUsersService: WalletUsersService) {}

  @AllowPublicCall()
  @Post()
  create(
    @Body() createWalletUserDto: CreateWalletUserDto,
  ): Promise<WalletUser> {
    console.log('createWalletUserDto', createWalletUserDto);
    return this.walletUsersService.create(createWalletUserDto);
  }
}
