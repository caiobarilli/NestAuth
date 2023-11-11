import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@/users/enums/user-roles.enum';
import { User } from '@/users/entities/user.entity';
import { UserRepository } from '@/users/users.repository';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { CredentialsDto } from '@/users/dto/credetials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(createUserDto, UserRole.USER);
  }

  async signIn(@Body() credentialsDto: CredentialsDto): Promise<{ token }> {
    const user = await this.userRepository.checkCredentials(credentialsDto);
    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const payload = { id: user.id };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
