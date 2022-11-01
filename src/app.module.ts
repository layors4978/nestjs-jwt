import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AuthModule } from './modules/auth/auth.module';
import { db } from 'ormconfig';
import { CommonModule } from './modules/common/common.module';
import { AccessTokenGuard } from './modules/common/guards/access-token.guard';

@Module({
  imports: [TypeOrmModule.forRoot(db), AuthModule, CommonModule],
  // make AccessTokenGuard a global guard
  // this method makes guard able to use dependency injection
  providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
})
export class AppModule {}
