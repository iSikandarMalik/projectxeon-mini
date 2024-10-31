import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  refresh_token?: string;

  @IsOptional()
  @IsString()
  authenticator_secret?: string;

  @IsOptional()
  @IsString()
  company_id?: string;

  @IsOptional()
  @IsString()
  walletName?: string;

  @IsOptional()
  @IsString()
  passcode?: string;

  @IsOptional()
  @IsString()
  userName?: string;
}
