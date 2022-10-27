import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const db: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [join(__dirname, './**/*.entity{.ts,.js}')],
  synchronize: true,
};
