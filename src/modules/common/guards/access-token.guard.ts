import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  // reflector for extracting metadata
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // searching for metadata 'isPublic'
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      // searching from handler
      context.getHandler(),
      // searching from controller
      context.getClass(),
    ]);

    // bypass the guard
    if (isPublic) {
      return true;
    }

    // AuthGuard('jwt')
    return super.canActivate(context);
  }
}
