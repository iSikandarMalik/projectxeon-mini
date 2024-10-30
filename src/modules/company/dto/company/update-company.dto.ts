import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Business email must be a valid email address' })
  business_email?: string;

  @IsOptional()
  @IsString()
  business_name?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  business_website?: string;

  @IsOptional()
  @IsString()
  year_of_incorporation?: string;

  @IsOptional()
  @IsString()
  trading_name?: string;

  @IsOptional()
  @IsString()
  address_line_one?: string;

  @IsOptional()
  @IsString()
  address_line_two?: string;

  @IsOptional()
  @IsString()
  country_of_incorporation?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  postal_code?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
