import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { PostId, PostRepository } from 'src/post/domain';
import { ResourceNotFoundError } from 'src/shared/errors';

export class DeletePostCommand {
  constructor(
    public readonly postId: PostId,
    public readonly authorId: string,
  ) {}
}

export class DeletePostResult {
  constructor(
    public readonly id: PostId,
    public readonly title: string,
    public readonly content: string,
  ) {}
}

@Injectable()
export class DeletePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  execute(command: DeletePostCommand) {
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

      yield* post.delete(command.authorId);

      yield* this.postRepository.delete(command.postId);

      return yield* Effect.succeed({
        id: post.id,
        title: post.title.value,
        content: post.content.value,
      });
    });
  }
}
