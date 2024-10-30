import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean; // Optional, defaults to false in the entity

  @IsOptional()
  @IsString()
  role?: string; // Optional

  @IsOptional()
  @IsString()
  refresh_token?: string; // Optional, used for refresh token management

  @IsOptional()
  @IsString()
  authenticator_secret?: string;

  @IsString()
  company_id: string; // Id of the company
}
