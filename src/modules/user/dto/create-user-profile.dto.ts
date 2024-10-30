import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateUserProfileDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateRegistered: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  streetAddress: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}
