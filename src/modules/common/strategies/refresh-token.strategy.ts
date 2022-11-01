import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      // extract jwt from header Authorization
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // verify the secret
      secretOrKey: 'VeryLongStringForRefreshToken',
      // pass request to validate
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    // extract refresh token
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    // req.user = { ...payload, refreshToken }
    return { ...payload, refreshToken };
  }
}
