import { BaseQueryParametersDto } from '@/shared/dto/base-query-params.dto';
import { IsOptional, IsString } from 'class-validator';

export class FindUsersQueryDto extends BaseQueryParametersDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  status: boolean;
}
