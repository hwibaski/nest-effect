import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { PostRepository } from 'src/post/domain';
import { ResourceNotFoundError } from 'src/shared/errors';

export class GetPostByIdQuery {
  constructor(public readonly postId: string) {}
}

export class GetPostByIdResult {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly status: string,
    public readonly authorId: string,
    public readonly publishedAt: Date | undefined,
    public readonly tags: string[],
    public readonly viewCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

@Injectable()
export class GetPostByIdUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  execute(query: GetPostByIdQuery) {
    return Effect.gen(this, function* () {
      const post = yield* this.postRepository.findById(query.postId);
      if (!post) {
        return yield* Effect.fail(
          new ResourceNotFoundError({
            resourceType: 'POST',
            resourceId: query.postId,
          }),
        );
      }

      // 조회수 증가
      yield* this.postRepository.incrementViewCount(query.postId);

      return yield* Effect.succeed({
        id: post.id,
        title: post.title.value,
        content: post.content.value,
        status: post.status,
        authorId: post.authorId,
        publishedAt: post.publishedAt,
        tags: post.tags,
        viewCount: post.viewCount,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      });
    });
  }
}
