import { MaxLength, MinLength, IsEmail, IsNotEmpty } from 'class-validator';
import { isMatchPassword } from './custom-validators/match-password.validator';
import { isUnique } from './custom-validators/data-unique.validator';

export class CreateUserDto {
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

  @IsNotEmpty({
    message: 'Informe o nome do usuário',
  })
  @MaxLength(200, {
    message: 'O nome deve ter menos de 200 caracteres',
  })
  name: string;

  @IsNotEmpty({
    message: 'Informe uma senha',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  password: string;

  @isMatchPassword({ message: 'A confirmação de senha não confere' })
  @IsNotEmpty({
    message: 'Informe a confirmação de senha',
  })
  @MinLength(6, {
    message: 'A confirmação de senha deve ter no mínimo 6 caracteres',
  })
  passwordConfirmation: string;
}
