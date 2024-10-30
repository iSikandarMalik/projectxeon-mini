import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateWalletUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  walletName: string;

  @IsString()
  @IsNotEmpty()
  passcode: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsUUID()
  @IsNotEmpty()
  companyId: string;
}
