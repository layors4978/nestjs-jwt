import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // extract jwt from header Authorization
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // verify the secret
      secretOrKey: 'VeryLongStringForAccessToken',
    });
  }

  validate(payload: any) {
    //req.user = payload
    return payload;
  }
}
