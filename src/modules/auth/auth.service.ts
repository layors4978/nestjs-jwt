import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

    const hashedPassword = await this.hash(dto.password);

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

    const isMatch = await bcrypt.compare(dto.password, user.password);
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

  hash(data) {
    return bcrypt.hash(data, 12);
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    await this.repo.update(id, { refreshToken: refreshToken });
  }
}
