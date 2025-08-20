import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Effect, Either } from 'effect';
import {
  CreatePostCommand,
  CreatePostUseCase,
  DeletePostCommand,
  DeletePostUseCase,
  GetAllPostsQuery,
  GetPostByIdQuery,
  GetPostByIdUseCase,
  GetPostsUseCase,
  PublishPostCommand,
  PublishPostUseCase,
  UpdatePostCommand,
  UpdatePostUseCase,
} from 'src/post/application/usecase';
import {
  CreatePostDto,
  GetPostsQueryDto,
  PostListResponseDto,
  PostResponseDto,
  UpdatePostDto,
} from 'src/post/presentation/dto/posts.dto';
import { AuthUser, Roles } from 'src/shared/decorators';
import { JwtAuthGuard } from 'src/shared/guards';
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
export class PostsController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly publishPostUseCase: PublishPostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  @Get('posts')
  async getPosts(
    @Query() queryDto: GetPostsQueryDto,
  ): Promise<PaginatedApiResponse<PostListResponseDto>> {
    const query = new GetAllPostsQuery(queryDto.page, queryDto.limit);

    const program = Effect.gen(this, function* () {
      const result = yield* Effect.either(this.getPostsUseCase.execute(query));

      if (Either.isLeft(result)) {
        return PaginatedResponse.of(
          [],
          {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
          'Failed to retrieve posts',
        );
      }

      return PaginatedResponse.of(
        result.right.data,
        {
          page: result.right.page,
          limit: result.right.limit,
          total: result.right.total,
          totalPages: result.right.totalPages,
          hasNext: result.right.page < result.right.totalPages,
          hasPrev: result.right.page > 1,
        },
        'Posts retrieved successfully',
      );
    });

    return await Effect.runPromise(program);
  }

  @Get('posts/:id')
  async getPost(
    @Param('id') id: string,
  ): Promise<ApiResponse<PostResponseDto>> {
    const query = new GetPostByIdQuery(id);

    const program = Effect.gen(this, function* () {
      const result = yield* Effect.either(
        this.getPostByIdUseCase.execute(query),
      );

      if (Either.isLeft(result)) {
        switch (result.left._tag) {
          case 'ResourceNotFoundError':
            return ErrorResponse.notFound(result.left.message, {
              resourceType: result.left.resourceType,
              resourceId: result.left.resourceId,
            });
          default:
            assertNever(result.left._tag);
        }
      }

      return SuccessResponse.of(result.right, 'Post retrieved successfully');
    });

    return await Effect.runPromise(program);
  }

  @Post('posts')
  @Roles(AuthUserRole.MEMBER)
  async createPost(
    @AuthUser() user: AuthenticatedRequest['user'],
    @Body() dto: CreatePostDto,
  ): Promise<ApiResponse<PostResponseDto>> {
    const authorId = user.id;
    const command = new CreatePostCommand(
      authorId,
      dto.title,
      dto.content,
      dto.tags,
    );

    const program = Effect.gen(this, function* () {
      const result = yield* Effect.either(
        this.createPostUseCase.execute(command),
      );

      if (Either.isLeft(result)) {
        switch (result.left._tag) {
          case 'InvalidTitleError':
            return ErrorResponse.badRequest(result.left.message);
          case 'InvalidContentError':
            return ErrorResponse.badRequest(result.left.message);
          default:
            assertNever(result.left);
        }
      }

      return SuccessResponse.created(result.right, 'Post created successfully');
    });

    return await Effect.runPromise(program);
  }

  @Put('posts/:id')
  @Roles(AuthUserRole.MEMBER)
  async updatePost(
    @Param('id') id: string,
    @AuthUser() user: AuthenticatedRequest['user'],
    @Body() dto: UpdatePostDto,
  ): Promise<ApiResponse<PostResponseDto>> {
    const authorId = user.id;
    const command = new UpdatePostCommand(
      id,
      authorId,
      dto.title,
      dto.content,
      dto.tags,
    );

    const program = Effect.gen(this, function* () {
      const result = yield* Effect.either(
        this.updatePostUseCase.execute(command),
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
          case 'InvalidTitleError':
            return ErrorResponse.validation(result.left.message, [
              {
                field: 'title',
                receivedValue: result.left.title,
              },
            ]);
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

      return SuccessResponse.of(result.right, 'Post updated successfully');
    });

    return await Effect.runPromise(program);
  }

  @Put('posts/:id/publish')
  @UseGuards(JwtAuthGuard)
  async publishPost(
    @Param('id') id: string,
    @AuthUser() user: AuthenticatedRequest['user'],
  ): Promise<ApiResponse<PostResponseDto>> {
    const authorId = user.id;
    const command = new PublishPostCommand(id, authorId);

    const program = Effect.gen(this, function* () {
      const result = yield* Effect.either(
        this.publishPostUseCase.execute(command),
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
          case 'PostAlreadyPublishedError':
            return ErrorResponse.badRequest(result.left.message);
          default:
            assertNever(result.left);
        }
      }

      return SuccessResponse.of(result.right, 'Post published successfully');
    });

    return await Effect.runPromise(program);
  }

  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Param('id') id: string,
    @AuthUser() user: AuthenticatedRequest['user'],
  ): Promise<ApiResponse<null>> {
    const authorId = user.id;
    const command = new DeletePostCommand(id, authorId);

    const program = Effect.gen(this, function* () {
      const result = yield* Effect.either(
        this.deletePostUseCase.execute(command),
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

      return SuccessResponse.empty('Post deleted successfully', 200);
    });

    return await Effect.runPromise(program);
  }
}
