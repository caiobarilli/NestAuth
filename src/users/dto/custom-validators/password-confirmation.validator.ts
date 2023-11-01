import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateUserDto } from '../create-user.dto';

@ValidatorConstraint({ name: 'PasswordConfirmation', async: false })
export class isPasswordConfirmationValid
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const dto: CreateUserDto = args.object as CreateUserDto;
    return value === dto.password;
  }

  defaultMessage() {
    return 'A confirmação de senha não corresponde à senha fornecida';
  }
}
