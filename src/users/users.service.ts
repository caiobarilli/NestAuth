import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersQueryDto } from './dto/find-users.dto';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-roles.enum';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  /**
   * Create admin user
   * @param {CreateUserDto} createUserDto
   * @returns {Promise<User>}
   */
  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto, UserRole.ADMIN);
  }

  /**
   * Find user by id
   * @param {string} id
   * @returns {Promise<User>}
   * @throws {NotFoundException}
   */
  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado`);
    }
    return user;
  }

  /**
   * Update user
   * @param {string} id
   * @param {UpdateUserDto} updateUserDto
   * @returns {Promise<User>}
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);
    const { name, email, role, status } = updateUserDto;
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.role = role ? role : user.role;
    user.status = status ? status : user.status;
    try {
      await user.save();
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o usuário no banco de dados',
      );
    }
  }

  /**
   * Delete user by id
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado`);
    }
  }

  /**
   * Find users
   * @param {FindUsersQueryDto} queryDto
   * @returns {Promise<User[]>}
   */
  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    const users = await this.userRepository.findUsers(queryDto);
    return users;
  }
}
