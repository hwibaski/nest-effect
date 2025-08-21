import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { AuthUserId } from 'src/auth/domain';
import { MemberId } from 'src/member/domain';
import { PostId, PostRepository } from 'src/post/domain';
import { ResourceNotFoundError } from 'src/shared/errors';
import { ResourceType } from 'src/shared/types';

export class UpdatePostCommand {
  constructor(
    public readonly postId: PostId,
    public readonly authorId: AuthUserId,
    public readonly title?: string,
    public readonly content?: string,
    public readonly tags?: string[],
  ) {}
}

export class UpdatePostResult {
  constructor(
    public readonly id: PostId,
    public readonly title: string,
    public readonly content: string,
    public readonly status: string,
    public readonly authorId: string,
  ) {}
}

@Injectable()
export class UpdatePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  execute(command: UpdatePostCommand) {
    return Effect.gen(this, function* () {
      const post = yield* this.postRepository.findById(command.postId);
      if (!post) {
        return yield* Effect.fail(
          new ResourceNotFoundError({
            resourceType: ResourceType.POST,
            resourceId: command.postId,
          }),
        );
      }

      if (command.title) {
        yield* post.updateTitle(command.title, command.authorId);
      }

      if (command.content) {
        yield* post.updateContent(command.content, command.authorId);
      }

      if (command.tags) {
        yield* post.updateTags(command.tags, command.authorId);
      }

      const updatedPost = yield* this.postRepository.update(post);

      return yield* Effect.succeed({
        id: updatedPost.id,
        title: updatedPost.title.value,
        content: updatedPost.content.value,
        status: updatedPost.status,
        authorId: updatedPost.authorId,
      });
    });
  }
}
