import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { Comment, CommentRepository } from 'src/comment/domain';
import { PostRepository } from 'src/post/domain';
import { ResourceNotFoundError } from 'src/shared/errors';

export class CreateCommentCommand {
  constructor(
    public readonly postId: string,
    public readonly authorId: string,
    public readonly content: string,
    public readonly parentCommentId?: string,
  ) {}
}

export class CreateCommentResult {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly authorId: string,
    public readonly postId: string,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly parentId: string | null,
  ) {}
}

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  execute(command: CreateCommentCommand) {
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

      const comment = yield* Comment.create(
        command.content,
        command.authorId,
        command.postId,
        post,
      );

      const savedComment = yield* this.commentRepository.save(comment);

      return yield* Effect.succeed({
        id: savedComment.id,
        content: savedComment.content.value,
        authorId: savedComment.authorId,
        postId: savedComment.postId,
        isDeleted: savedComment.isDeleted,
        createdAt: savedComment.createdAt,
        updatedAt: savedComment.updatedAt,
      });
    });
  }
}
