import { IsNotEmpty, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { CreateUserProfileDto } from './create-user-profile.dto';

export class CreateUserWithProfileDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserProfileDto)
  profile: CreateUserProfileDto;
}
