import { IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  companyId: string;

  @IsString()
  assetId: string;
}
