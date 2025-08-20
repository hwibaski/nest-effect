import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { InMemoryCommentDao } from 'src/comment/infrastructure/in-memory-comment.dao';

export class GetCommentsByPostQuery {
  constructor(
    public readonly postId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}

export class CommentResponseResult {
  constructor(
    readonly id: string,
    readonly content: string,
    readonly authorId: string,
    readonly postId: string,
    readonly parentId: string | null,
    readonly isDeleted: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}

@Injectable()
export class GetCommentsUseCase {
  constructor(private readonly commentDao: InMemoryCommentDao) {}

  execute(query: GetCommentsByPostQuery) {
    return Effect.gen(this, function* () {
      const options = {
        page: query.page || 1,
        limit: query.limit || 20,
      };

      const result = yield* this.commentDao.findActiveCommentsByPostId(
        query.postId,
        options,
      );

      return yield* Effect.succeed({
        data: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    });
  }
}
