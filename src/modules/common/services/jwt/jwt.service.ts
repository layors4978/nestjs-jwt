import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { tokens } from 'src/types/tokens';

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  // generate tokens
  async getTokens(id: number, email: string): Promise<tokens> {
    // access token for 15 mins
    // refresh token for 7 days
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: 'VeryLongStringForAccessToken',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          id,
          email,
        },
        {
          secret: 'VeryLongStringForRefreshToken',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
