import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from 'src/auth/domain/auth-user.entity';
import { JWT_CONSTANTS } from 'src/shared/auth.constants';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(member: AuthUser): Promise<string> {
    const payload: JwtPayload = {
      sub: member.id,
      email: member.email.value,
      role: member.role,
    };

    return this.jwtService.sign(payload, {
      secret: JWT_CONSTANTS.SECRET,
      expiresIn: JWT_CONSTANTS.EXPIRES_IN,
    });
  }

  async generateRefreshToken(member: AuthUser): Promise<string> {
    const payload: JwtPayload = {
      sub: member.id,
      email: member.email.value,
      role: member.role,
    };

    return this.jwtService.sign(payload, {
      secret: JWT_CONSTANTS.REFRESH_SECRET,
      expiresIn: JWT_CONSTANTS.REFRESH_EXPIRES_IN,
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token, {
        secret: JWT_CONSTANTS.SECRET,
      });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token, {
        secret: JWT_CONSTANTS.REFRESH_SECRET,
      });
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}
