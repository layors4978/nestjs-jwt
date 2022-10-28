import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from './services/jwt/jwt.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

const services = [JWTService, AccessTokenStrategy, RefreshTokenStrategy];

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: services,
  exports: services,
})
export class CommonModule {}
