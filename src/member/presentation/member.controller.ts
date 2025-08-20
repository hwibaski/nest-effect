import { Body, Controller, Post, Put, UseInterceptors } from '@nestjs/common';

import {
  ApiResponse,
  ErrorResponse,
  SuccessResponse,
} from 'src/shared/response';

import { Effect, Either } from 'effect';

import {
  RegisterMemberCommand,
  RegisterMemberUseCase,
  UpdateMemberProfileCommand,
  UpdateMemberProfileUseCase,
} from 'src/member/application/usecase';
import {
  MemberResponseDto,
  RegisterMemberDto,
  UpdateMemberProfileDto,
} from 'src/member/presentation/dto/member.dto';
import { Roles } from 'src/shared/decorators';
import { AuthUser } from 'src/shared/decorators/auth-user.decorator';
import { AuthenticatedRequest } from 'src/shared/guards/jwt-auth.guard';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { AuthUserRole } from 'src/shared/types';
import { assertNever } from 'src/shared/utils/assert-never';

@Controller()
@UseInterceptors(ResponseInterceptor)
export class MemberController {
  constructor(
    private readonly registerMemberUseCase: RegisterMemberUseCase,
    private readonly updateMemberProfileUseCase: UpdateMemberProfileUseCase,
  ) {}

  @Post('members/register')
  async register(
    @Body() dto: RegisterMemberDto,
  ): Promise<ApiResponse<{ member: MemberResponseDto }>> {
    const command = new RegisterMemberCommand(
      dto.email,
      dto.password,
      dto.name,
    );

    const program = Effect.gen(this, function* () {
      const result = yield* Effect.either(
        this.registerMemberUseCase.execute(command),
      );

      if (Either.isLeft(result)) {
        switch (result.left._tag) {
          case 'ResourceAlreadyExistsError':
            return ErrorResponse.conflict(result.left.message, {
              resourceType: result.left.resourceType,
              identifier: result.left.identifier,
            });
          case 'InvalidEmailError':
            return ErrorResponse.validation(result.left.message, [
              {
                field: result.left.field,
                receivedValue: result.left.receivedValue,
              },
            ]);
          case 'InvalidPasswordError':
            return ErrorResponse.validation(result.left.message, [
              {
                field: result.left.field,
                receivedValue: result.left.receivedValue,
              },
            ]);
          default:
            assertNever(result.left);
        }
      }

      return SuccessResponse.created(
        result.right,
        'Member registered successfully',
      );
    });

    return await Effect.runPromise(program);
  }

  @Put('members/profile')
  @Roles(AuthUserRole.MEMBER)
  async updateProfile(
    @AuthUser() user: AuthenticatedRequest['user'],
    @Body() dto: UpdateMemberProfileDto,
  ): Promise<ApiResponse<MemberResponseDto>> {
    const memberId = user.id;
    const command = new UpdateMemberProfileCommand(
      memberId,
      dto.name,
      dto.email,
    );

    const program = Effect.gen(this, function* () {
      const result = yield* Effect.either(
        this.updateMemberProfileUseCase.execute(command),
      );

      if (Either.isLeft(result)) {
        switch (result.left._tag) {
          case 'ResourceNotFoundError':
            return ErrorResponse.notFound(result.left.message, {
              resourceType: result.left.resourceType,
              resourceId: result.left.resourceId,
            });
          case 'ResourceAlreadyExistsError':
            return ErrorResponse.conflict(result.left.message, {
              resourceType: result.left.resourceType,
              identifier: result.left.identifier,
            });
          case 'InvalidEmailError':
            return ErrorResponse.validation(result.left.message, [
              {
                field: result.left.field,
                receivedValue: result.left.receivedValue,
              },
            ]);
          case 'InvalidNameError':
            return ErrorResponse.validation(result.left.message, [
              {
                field: result.left.field,
                receivedValue: result.left.receivedValue,
              },
            ]);
          default:
            assertNever(result.left);
        }
      }

      return SuccessResponse.of(result.right, 'Profile updated successfully');
    });

    return await Effect.runPromise(program);
  }
}
