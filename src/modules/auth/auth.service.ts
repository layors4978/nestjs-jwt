import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import * as argon from 'argon2';
import { User } from '../entities/user.entity';
import { UserDto } from './dto/user.dto';
import { tokens } from 'src/types/tokens';
import { JWTService } from '../common/services/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwtService: JWTService,
  ) {}

  async signup(dto: UserDto): Promise<tokens> {
    const existingUser = await this.repo.findOneBy({ email: dto.email });
    if (existingUser) {
      throw new BadRequestException();
    }

    const hashedPassword = await argon.hash(dto.password);

    const user = await this.repo.create({
      email: dto.email,
      password: hashedPassword,
      refreshToken: '',
    });

    await this.repo.save(user);

    const tokens = await this.jwtService.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async signin(dto: UserDto): Promise<tokens> {
    const user = await this.repo.findOneBy({ email: dto.email });
    if (!user) {
      throw new ForbiddenException();
    }

    const isMatch = await argon.verify(user.password, dto.password);
    if (!isMatch) {
      throw new ForbiddenException();
    }

    const tokens = await this.jwtService.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(id: number) {
    return await this.repo.update(
      { id, refreshToken: Not('') },
      { refreshToken: '' },
    );
  }

  async refresh(id: number, refreshToken: string) {
    const user = await this.repo.findOneBy({ id });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException();
    }

    const isMatch = await argon.verify(user.refreshToken, refreshToken);
    if (!isMatch) {
      throw new ForbiddenException();
    }

    const tokens = await this.jwtService.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  dropAll() {
    return this.repo.delete({});
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const hashedToken = await argon.hash(refreshToken);
    await this.repo.update(id, { refreshToken: hashedToken });
  }
}
