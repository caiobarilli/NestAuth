import {
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';
import { isUnique } from '@/users/dto/custom-validators/data-unique.validator';
import { UserRole } from '@/users/enums/user-roles.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: 'Informe um nome de usuário válido',
  })
  name: string;

  @IsNotEmpty({
    message: 'Informe um endereço de email',
  })
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  @MaxLength(200, {
    message: 'O endereço de email deve ter menos de 200 caracteres',
  })
  @isUnique(
    {
      tableName: 'user',
      column: 'email',
    },
    { message: 'O endereço de email já está em uso' },
  )
  email: string;

  @IsOptional()
  role: UserRole;

  @IsOptional()
  status: boolean;
}
