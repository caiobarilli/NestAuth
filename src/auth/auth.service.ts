import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@/users/user-roles.enum';
import { User } from '@/users/entities/user.entity';
import { UserRepository } from '@/users/user.repository';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { CredentialsDto } from '@/users/dto/credetials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(createUserDto, UserRole.USER);
  }

  async signIn(@Body() credentialsDto: CredentialsDto): Promise<User> {
    return await this.userRepository.checkCredentials(credentialsDto);
  }
}
