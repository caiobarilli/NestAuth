import {
  Body,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@/users/enums/user-roles.enum';
import { User } from '@/users/entities/user.entity';
import { UserRepository } from '@/users/users.repository';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { CredentialsDto } from './dto/credetials.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { ChangePasswordDto } from './dto/change-password';
import { randomBytes } from 'crypto';
ConfigModule.forRoot();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  /**
   * Sign up a new user
   * @param {CreateUserDto} createUserDto
   * @returns {Promise<User>}
   */
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.createUser(
      createUserDto,
      UserRole.USER,
    );
    const mail = {
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Email de confirmação',
      template: 'templates/emails/email-confirmation',
      context: {
        url: process.env.FRONTEND_CONFIRM_URL,
        token: user.confirmationToken,
      },
    };
    await this.mailerService.sendMail(mail);
    return user;
  }

  /**
   * Confirm user's email
   * @param {string} confirmationToken
   * @returns {Promise<void>}
   */
  async confirmEmail(confirmationToken: string): Promise<void> {
    const result = await this.userRepository.update(
      { confirmationToken },
      { confirmationToken: null, status: true },
    );
    if (result.affected === 0) throw new NotFoundException('Token inválido');
  }

  /**
   * Sign in a user
   * @param {CredentialsDto} credentialsDto
   * @returns {Promise<{ token }>}
   */
  async signIn(@Body() credentialsDto: CredentialsDto): Promise<{ token }> {
    const user = await this.userRepository.checkCredentials(credentialsDto);
    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    if (user.status === false) {
      throw new UnauthorizedException('Email não foi confirmado');
    }
    const payload = { id: user.id };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * Send an email to recover user's password
   * @param {string} email
   * @returns {Promise<void>}
   */
  async sendRecoverPasswordEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user)
      throw new NotFoundException('Não há usuário cadastrado com esse email.');

    user.recoverToken = randomBytes(32).toString('hex');
    await user.save();

    const mail = {
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Recuperação de senha',
      template: 'templates/emails/recover-password',
      context: {
        url: process.env.FRONTEND_RECOVER_PASS_URL,
        token: user.recoverToken,
      },
    };
    await this.mailerService.sendMail(mail);
  }

  /**
   * Change user's password
   * @param {string} id
   * @param {ChangePasswordDto} changePasswordDto
   * @returns {Promise<void>}
   */
  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { password } = changePasswordDto;
    await this.userRepository.changePassword(id, password);
  }

  /**
   * Reset user's password
   * @param {string} recoverToken
   * @param {ChangePasswordDto} changePasswordDto
   * @returns {Promise<void>}
   * @throws {NotFoundException}
   */
  async resetPassword(
    recoverToken: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { recoverToken },
      select: ['id'],
    });
    if (!user) throw new NotFoundException('Token inválido.');

    try {
      await this.changePassword(user.id.toString(), changePasswordDto);
    } catch (error) {
      throw error;
    }
  }
}
