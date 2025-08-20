import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';

import {
  ApiResponse,
  ErrorResponse,
  SuccessResponse,
} from 'src/shared/response';

import { Effect, Either } from 'effect';

import { LoginMemberUseCase } from 'src/auth/application/usecase/login-member.use-case';
import {
  AuthResponseDto,
  LoginMemberDto,
} from 'src/auth/presentation/dto/auth.dto';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { assertNever } from 'src/shared/utils/assert-never';

@Controller()
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly loginMemberUseCase: LoginMemberUseCase) {}

  @Post('auth/login')
  async login(
    @Body() dto: LoginMemberDto,
  ): Promise<ApiResponse<AuthResponseDto>> {
    const command = { email: dto.email, password: dto.password };

    const program = Effect.gen(this, function* () {
      const result = yield* Effect.either(
        this.loginMemberUseCase.execute(command),
      );

      if (Either.isLeft(result)) {
        switch (result.left._tag) {
          case 'InvalidEmailError':
            return ErrorResponse.badRequest(result.left.message, {
              field: 'email',
              receivedValue: result.left.receivedValue,
            });
          case 'InvalidCredentialsError':
            return ErrorResponse.unauthorized(result.left.message);
          case 'AccountDeactivatedError':
            return ErrorResponse.forbidden(result.left.message, {
              memberId: result.left.memberId,
            });
          default:
            assertNever(result.left);
        }
      }

      return SuccessResponse.of(result.right, 'Login successful');
    });

    return await Effect.runPromise(program);
  }
}
