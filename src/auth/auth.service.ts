import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@/users/enums/user-roles.enum';
import { User } from '@/users/entities/user.entity';
import { UserRepository } from '@/users/users.repository';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { CredentialsDto } from '@/users/dto/credetials.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.createUser(
      createUserDto,
      UserRole.USER,
    );

    const mail = {
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Email de confirmação',
      template: 'email-confirmation',
      context: {
        token: user.confirmationToken,
      },
    };
    await this.mailerService.sendMail(mail);

    return user;
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
