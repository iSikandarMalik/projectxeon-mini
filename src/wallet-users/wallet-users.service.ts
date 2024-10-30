import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletUser } from './entities/wallet-user.entity';
import { CreateWalletUserDto } from './dto/create-wallet-user.dto';
import { Company } from 'src/modules/company/entities/company.entity';

@Injectable()
export class WalletUsersService {
  constructor(
    @InjectRepository(WalletUser)
    private walletUserRepository: Repository<WalletUser>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(createWalletUserDto: CreateWalletUserDto): Promise<any> {
    const { companyId, ...userData } = createWalletUserDto;
    const company = await this.companyRepository.findOneBy({
      company_id: companyId,
    });

    if (!company) {
      throw new Error('Company not found');
    }

    const walletUser = this.walletUserRepository.create({
      ...userData,
      company,
    });

    const savedUser = await this.walletUserRepository.save(walletUser);

    return {
      id: savedUser.id,
      wallet_user_id: savedUser.wallet_user_id,
      email: savedUser.email,
      mobileNumber: savedUser.mobileNumber,
      walletName: savedUser.walletName,
      passcode: savedUser.passcode,
      userName: savedUser.userName,
      companyId: companyId,
    };
  }
}
