import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '@/users/user.repository';

@ValidatorConstraint({ name: 'isEmailUnique', async: true })
@Injectable()
export class isEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async validate(email: string) {
    return !(await this.userRepository.findByEmail(email));
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
