import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from './dto/credetials.dto';
import { UserRole } from './enums/user-roles.enum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { FindUsersQueryDto } from './dto/find-users.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  /**
   * This constructor is used to inject the EntityManager
   * @constructor
   * @param {DataSource} dataSource
   */
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  /**
   * Create a new user
   * @param {CreateUserDto} createUserDto
   * @param {UserRole} role
   * @returns {Promise<User>}
   * @throws {InternalServerErrorException}
   */
  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const { name, email, password } = createUserDto;
    const user = new User();
    user.name = name;
    user.email = email;
    user.role = role;
    user.status = true;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar o usuário no banco de dados',
      );
    }
  }

  /**
   * Creates a hash from a password
   * @param {string} password
   * @param {string} salt
   * @returns {Promise<string>}
   */
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  /**
   * Check user credentials and return user
   * @param {CredentialsDto} credentialsDto
   * @returns {Promise<User>}
   */
  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentialsDto;

    const user = await this.findOne({
      where: { email, status: true },
    });

    if (user && (await user.checkPassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  /**
   * Find user by id and return user
   * @param {string} id
   * @returns {Promise<User>}
   * @throws {InternalServerErrorException}
   */
  async findById(id: string): Promise<User> {
    const user = await this.findOne({
      where: { id },
      select: ['name', 'email', 'status', 'role'],
    });
    if (!user) {
      throw new InternalServerErrorException('Usuário não encontrado');
    }
    return user;
  }

  /**
   * Find users
   * @param {FindUsersQueryDto} queryDto
   * @returns {Promise<{ users: User[]; total: number }>}
   */
  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    queryDto.status = queryDto.status === undefined ? true : queryDto.status;
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 90 ? 90 : queryDto.limit;

    const { email, name, status, role } = queryDto;
    const query = this.createQueryBuilder('user');
    query.where('user.status = :status', { status });

    addWhereCondition(query, 'email', email, 'ILIKE');
    addWhereCondition(query, 'name', name, 'ILIKE');
    addWhereCondition(query, 'role', role);

    // query.skip((queryDto.page - 1) * queryDto.limit);
    // query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['user.name', 'user.email', 'user.role', 'user.status']);

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }
}

/**
 * Adiciona uma condição WHERE dinâmica a uma consulta com base no campo, valor e operador fornecidos.
 * @param {SelectQueryBuilder<User>} query - O TypeORM SelectQueryBuilder para a entidade 'user'.
 * @param {string} field - O campo no qual aplicar a condição.
 * @param {any} value - O valor a ser verificado.
 * @param {string} [operator='='] - O operador de comparação (o padrão é '=').
 */
function addWhereCondition(
  query: SelectQueryBuilder<User>,
  field: string,
  value: any,
  operator: string = '=',
) {
  if (value !== undefined && value !== null) {
    query.andWhere(`user.${field} ${operator} :${field}`, { [field]: value });
  }
}
