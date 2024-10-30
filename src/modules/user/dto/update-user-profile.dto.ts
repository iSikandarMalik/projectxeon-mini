import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDate } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateRegistered?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  streetAddress?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
