import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  assetId?: string;

  @IsNumber()
  @IsOptional()
  balance: number;
}
