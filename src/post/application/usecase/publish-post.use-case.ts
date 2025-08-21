import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { AuthUserId } from 'src/auth/domain';
import { PostId, PostRepository } from 'src/post/domain';
import { ResourceNotFoundError } from 'src/shared/errors';

export class PublishPostCommand {
  constructor(
    public readonly postId: PostId,
    public readonly authorId: AuthUserId,
  ) {}
}

export class PublishPostResult {
  constructor(
    public readonly id: PostId,
    public readonly title: string,
    public readonly content: string,
    public readonly status: string,
    public readonly authorId: AuthUserId,
    public readonly publishedAt: Date | undefined,
    public readonly tags: string[],
    public readonly viewCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

@Injectable()
export class PublishPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  execute(command: PublishPostCommand) {
    return Effect.gen(this, function* () {
      const post = yield* this.postRepository.findById(command.postId);
      if (!post) {
        return yield* Effect.fail(
          new ResourceNotFoundError({
            resourceType: 'POST',
            resourceId: command.postId,
          }),
        );
      }

      yield* post.publish(command.authorId);
      const updatedPost = yield* this.postRepository.update(post);

      return yield* Effect.succeed({
        id: updatedPost.id,
        title: updatedPost.title.value,
        content: updatedPost.content.value,
        status: updatedPost.status,
        authorId: updatedPost.authorId,
        publishedAt: updatedPost.publishedAt,
        tags: updatedPost.tags,
        viewCount: updatedPost.viewCount,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
      });
    });
  }
}
