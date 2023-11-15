import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: `${process.env.DB_HOST || 'localhost'}`,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: `${process.env.DB_USER || 'myuser'}`,
  password: `${process.env.DB_PASSWORD || 'mypassword'}`,
  database: 'nestjs',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
