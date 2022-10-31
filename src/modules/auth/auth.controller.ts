import {
  Controller,
  Body,
  Post,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { tokens } from 'src/types/tokens';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(201)
  signup(@Body() dto: UserDto): Promise<tokens> {
    return this.authService.signup(dto);
  }

  @Post('/signin')
  @HttpCode(200)
  signin(@Body() dto: UserDto): Promise<tokens> {
    return this.authService.signin(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  @HttpCode(200)
  logout(@GetUser('id') id: number) {
    return this.authService.logout(id);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(200)
  refresh(
    @GetUser('id') id: number,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(id, refreshToken);
  }

  @Delete('/drop-all')
  dropAll() {
    return this.authService.dropAll();
  }
}
