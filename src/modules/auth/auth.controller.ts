import {
  Controller,
  Body,
  Post,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { tokens } from 'src/types/tokens';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(201)
  signup(@Body() dto: UserDto): Promise<tokens> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('/signin')
  @HttpCode(200)
  signin(@Body() dto: UserDto): Promise<tokens> {
    return this.authService.signin(dto);
  }

  @ApiBearerAuth()
  @Post('/logout')
  @HttpCode(200)
  logout(@GetUser('id') id: number) {
    return this.authService.logout(id);
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(200)
  refresh(
    @GetUser('id') id: number,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(id, refreshToken);
  }

  // // very dangerous
  // @Delete('/drop-all')
  // dropAll() {
  //   return this.authService.dropAll();
  // }
}
