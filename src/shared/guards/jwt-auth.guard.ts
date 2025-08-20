import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Effect } from 'effect';
import { Request } from 'express';
import { AuthJwtService } from 'src/auth/application/jwt.service';
import { AuthUserRepository } from 'src/auth/domain/auth-user.repository';
import { Roles } from 'src/shared/decorators/roles';
import { AuthUserRole } from 'src/shared/types';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: AuthUserRole;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: AuthJwtService,
    private readonly authUserRepository: AuthUserRepository,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('canActivate');
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const requiredRole = this.reflector.get<AuthUserRole>(
      Roles,
      context.getHandler(),
    );

    const authHeader = request.headers.authorization;
    const token = this.jwtService.extractTokenFromHeader(authHeader || '');

    if (!token) {
      throw new UnauthorizedException('No authorization token found');
    }

    try {
      // JWT 토큰 검증 및 사용자 조회
      const authUser = await Effect.runPromise(
        Effect.gen(this, function* () {
          const payload = yield* Effect.promise(() =>
            this.jwtService.verifyAccessToken(token),
          );

          const user = yield* this.authUserRepository.findByEmail(
            payload.email,
          );

          if (!user) {
            return yield* Effect.die(
              new UnauthorizedException('User not found'),
            );
          }

          if (!user.isActive) {
            return yield* Effect.die(
              new UnauthorizedException('User account is deactivated'),
            );
          }

          return yield* Effect.succeed(user);
        }),
      );

      // 역할 기반 권한 확인
      if (requiredRole && !this.hasPermission(authUser.role, requiredRole)) {
        throw new UnauthorizedException('Insufficient permissions');
      }

      // 요청 객체에 사용자 정보 첨부
      request.user = {
        id: authUser.id,
        email: authUser.email.value,
        role: authUser.role,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Invalid or expired token',
      );
    }
  }

  private hasPermission(
    userRole: AuthUserRole,
    requiredRole: AuthUserRole,
  ): boolean {
    return userRole === requiredRole;
  }
}
