import { User } from '@/users/entities/user.entity';

export class ReturnUserDto {
  user: User;
  message: string;
}
