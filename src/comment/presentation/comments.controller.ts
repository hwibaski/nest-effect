import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { Effect, Either } from 'effect';
import {
  CreateCommentCommand,
  CreateCommentUseCase,
  DeleteCommentCommand,
  DeleteCommentUseCase,
  GetCommentsByPostQuery,
  GetCommentsUseCase,
  UpdateCommentCommand,
  UpdateCommentUseCase,
} from 'src/comment/application';
import {
  CommentResponseDto,
  CreateCommentDto,
  GetCommentsQueryDto,
  UpdateCommentDto,
} from 'src/comment/presentation/dto/comments.dto';
import { Roles } from 'src/shared/decorators';
import { AuthUser } from 'src/shared/decorators/auth-user.decorator';
import { AuthenticatedRequest } from 'src/shared/guards/jwt-auth.guard';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import {
  ApiResponse,
  ErrorResponse,
  PaginatedApiResponse,
  PaginatedResponse,
  SuccessResponse,
} from 'src/shared/response';
import { AuthUserRole } from 'src/shared/types';
import { assertNever } from 'src/shared/utils/assert-never';

@Controller()
@UseInterceptors(ResponseInterceptor)
export class CommentsController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly getCommentsUseCase: GetCommentsUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
  ) {}

  @Get('posts/:postId/comments')
  async getCommentsByPost(
    @Param('postId') postId: string,
    @Query() queryDto: GetCommentsQueryDto,
  ): Promise<PaginatedApiResponse<CommentResponseDto>> {
    const query = new GetCommentsByPostQuery(
      postId,
      queryDto.page,
      queryDto.limit,
    );

    const program = Effect.gen(this, function* () {
      const result = yield* this.getCommentsUseCase.execute(query);

      return PaginatedResponse.of(
        result.data,
        {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNext: result.page < result.totalPages,
          hasPrev: result.page > 1,
        },
        'Comments retrieved successfully',
      );
    });

    return await Effect.runPromise(program);
  }

  @Post('posts/:postId/comments')
  @Roles(AuthUserRole.MEMBER)
  async createComment(
    @Param('postId') postId: string,
    @AuthUser() user: AuthenticatedRequest['user'],
    @Body() dto: CreateCommentDto,
  ): Promise<ApiResponse<CommentResponseDto>> {
    const authorId = user.id;
    const command = new CreateCommentCommand(postId, authorId, dto.content);

    const program = Effect.gen(this, function* () {
      const result = yield* Effect.either(
        this.createCommentUseCase.execute(command),
      );

      if (Either.isLeft(result)) {
        switch (result.left._tag) {
          case 'ResourceNotFoundError':
            return ErrorResponse.notFound(result.left.message, {
              resourceType: result.left.resourceType,
              resourceId: result.left.resourceId,
            });
          case 'UnauthorizedError':
            return ErrorResponse.forbidden(result.left.message, {
              action: result.left.action,
              resourceType: result.left.resourceType,
              resourceId: result.left.resourceId,
              memberId: result.left.memberId,
            });
          case 'InvalidContentError':
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
        'Comment created successfully',
      );
    });

    return await Effect.runPromise(program);
  }

  @Put('comments/:id')
  @Roles(AuthUserRole.MEMBER)
  async updateComment(
    @Param('id') id: string,
    @AuthUser() user: AuthenticatedRequest['user'],
    @Body() dto: UpdateCommentDto,
  ): Promise<ApiResponse<CommentResponseDto>> {
    const authorId = user.id;
    const command = new UpdateCommentCommand(id, authorId, dto.content);

    const program = Effect.gen(this, function* () {
      const result = yield* Effect.either(
        this.updateCommentUseCase.execute(command),
      );

      if (Either.isLeft(result)) {
        switch (result.left._tag) {
          case 'ResourceNotFoundError':
            return ErrorResponse.notFound(result.left.message, {
              resourceType: result.left.resourceType,
              resourceId: result.left.resourceId,
            });
          case 'UnauthorizedError':
            return ErrorResponse.forbidden(result.left.message, {
              action: result.left.action,
              resourceType: result.left.resourceType,
              resourceId: result.left.resourceId,
              memberId: result.left.memberId,
            });
          case 'InvalidContentError':
            return ErrorResponse.validation(result.left.message, [
              {
                field: result.left.field,
                receivedValue: result.left.receivedValue,
              },
            ]);
          case 'DeletedCommentUpdateError':
            return ErrorResponse.forbidden(result.left.message, {
              action: result.left.action,
              resourceType: result.left.resourceType,
              resourceId: result.left.commentId,
            });
          default:
            assertNever(result.left);
        }
      }

      return SuccessResponse.of(result.right, 'Comment updated successfully');
    });

    return await Effect.runPromise(program);
  }

  @Delete('comments/:id')
  @Roles(AuthUserRole.MEMBER)
  async deleteComment(
    @Param('id') id: string,
    @AuthUser() user: AuthenticatedRequest['user'],
  ): Promise<ApiResponse<null>> {
    const authorId = user.id;
    const command = new DeleteCommentCommand(id, authorId);

    const program = Effect.gen(this, function* () {
      const result = yield* Effect.either(
        this.deleteCommentUseCase.execute(command),
      );

      if (Either.isLeft(result)) {
        switch (result.left._tag) {
          case 'ResourceNotFoundError':
            return ErrorResponse.notFound(result.left.message, {
              resourceType: result.left.resourceType,
              resourceId: result.left.resourceId,
            });
          case 'UnauthorizedError':
            return ErrorResponse.forbidden(result.left.message, {
              action: result.left.action,
              resourceType: result.left.resourceType,
              resourceId: result.left.resourceId,
              memberId: result.left.memberId,
            });
          default:
            assertNever(result.left);
        }
      }

      return SuccessResponse.empty('Comment deleted successfully', 200);
    });

    return await Effect.runPromise(program);
  }
}
