import { IsNumberString, IsOptional, IsString } from 'class-validator';

export abstract class BaseQueryParametersDto {
  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  limit: number;
}
