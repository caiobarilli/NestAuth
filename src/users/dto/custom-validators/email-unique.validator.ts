import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';

@ValidatorConstraint({ name: 'isEmailUnique', async: true })
@Injectable()
export class isEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly usersService: UsersService) {}

  async validate(email: string) {
    return !(await this.usersService.findByEmail(email));
  }
}

export function isEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isEmailUniqueConstraint,
    });
  };
}
