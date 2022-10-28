import { Controller, Body, Post, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { tokens } from 'src/types/tokens';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() dto: UserDto): Promise<tokens> {
    return this.authService.signup(dto);
  }

  @Post('/signin')
  signin(@Body() dto: UserDto): Promise<tokens> {
    return this.authService.signin(dto);
  }

  // @Post('/logout')
  // logout() {}

  // @Post('/refresh')
  // refresh() {}

  @Delete('/drop-all')
  dropAll() {
    return this.authService.dropAll();
  }
}
