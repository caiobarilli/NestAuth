import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { CreateUserDto } from '../create-user.dto';

@ValidatorConstraint({ name: 'isMatchPassword', async: false })
export class isMatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const dto: CreateUserDto = args.object as CreateUserDto;
    return password === dto.password;
  }
}

export function isMatchPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isMatchPasswordConstraint,
    });
  };
}
