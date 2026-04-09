// src/common/guards/active.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ActiveGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as { role?: string; isDisabled?: boolean } | undefined;

    if (!user) {
      throw new ForbiddenException('Authentication required.');
    }

    if (user.isDisabled) {
      const role = user.role || 'student';
      const message =
        role === 'admin'
          ? 'Your admin account has been deactivated. All actions are blocked.'
          : 'Your account has been deactivated. Please contact support.';

      throw new ForbiddenException({ success: false, message, errorCode: 'ACCOUNT_DEACTIVATED' });
    }

    return true;
  }
}