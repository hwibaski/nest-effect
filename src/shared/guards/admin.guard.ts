import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthUserRole } from '../types';
import { AuthenticatedRequest } from './jwt-auth.guard';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const member = request.user;

    if (!member) {
      throw new ForbiddenException('User not authenticated');
    }

    if (member.role !== AuthUserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
