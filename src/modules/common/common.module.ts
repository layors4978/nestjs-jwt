import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from './services/jwt/jwt.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

// services that needed to export
const services = [JWTService, AccessTokenStrategy, RefreshTokenStrategy];

// make it global, so you don't import this to many places
@Global()
@Module({
  // make you able to use JwtService from @nestjs/jwt
  // you can put some payload in curly braces
  imports: [JwtModule.register({})],
  providers: services,
  exports: services,
})
export class CommonModule {}
