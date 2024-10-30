import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateAssetDto {
  @IsOptional()
  @IsString()
  @Expose()
  name?: string;

  @IsOptional()
  @IsString()
  @Expose()
  ticker?: string;

  @IsOptional()
  @IsString()
  @Expose()
  country?: string;

  @IsOptional()
  @IsString()
  @Expose()
  icon?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  usd_value?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  daily_volume?: number;

  @IsOptional()
  @IsString()
  @Expose()
  type?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  status?: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  deleted?: boolean;

  @IsOptional()
  @IsArray()
  @Expose()
  liquidity?: string[];
}
