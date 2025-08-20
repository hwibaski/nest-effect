import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { InMemoryPostDao } from 'src/post/infrastructure/in-memory-post.dao';
import { PostStatus } from 'src/shared/types';

export class GetAllPostsQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly published?: boolean,
  ) {}
}

export class GetPostsResponse {
  constructor(
    public readonly data: {
      id: string;
      title: string;
      contentPreview: string;
      status: string;
      authorId: string;
      publishedAt?: Date;
      tags: string[];
      viewCount: number;
      createdAt: Date;
      updatedAt: Date;
    }[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
    public readonly totalPages: number,
  ) {}
}

@Injectable()
export class GetPostsUseCase {
  constructor(private readonly postDao: InMemoryPostDao) {}

  execute(query: GetAllPostsQuery): Effect.Effect<GetPostsResponse, string> {
    return Effect.gen(this, function* () {
      const options = {
        page: query.page || 1,
        limit: query.limit || 10,
      };

      let result;

      if (query.published !== undefined) {
        const status = query.published
          ? PostStatus.PUBLISHED
          : PostStatus.DRAFT;
        result = yield* this.postDao.findByStatus(status, options);
      } else {
        result = yield* this.postDao.findByStatus(
          PostStatus.PUBLISHED,
          options,
        );
      }

      return yield* Effect.succeed({
        data: result.data, // DAO에서 이미 변환된 데이터 사용
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    });
  }
}
