import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtService } from 'src/auth/application';
import { LoginMemberUseCase } from 'src/auth/application/usecase/login-member.use-case';
import { AuthController } from 'src/auth/presentation/auth.controller';
import { RepositoryModule } from 'src/repository/repository.module';
import { JWT_CONSTANTS } from 'src/shared/auth.constants';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_CONSTANTS.SECRET,
      signOptions: {
        expiresIn: JWT_CONSTANTS.EXPIRES_IN,
      },
    }),
    RepositoryModule,
  ],
  controllers: [AuthController],
  providers: [LoginMemberUseCase, AuthJwtService],
  exports: [AuthJwtService],
})
export class AuthModule {}
