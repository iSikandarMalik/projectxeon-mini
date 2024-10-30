import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateAssetDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  ticker?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsNumber()
  usd_value?: number;

  @IsOptional()
  @IsNumber()
  daily_volume?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsArray()
  liquidity?: string[];

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
