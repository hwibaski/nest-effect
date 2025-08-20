import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { CommentRepository } from 'src/comment/domain';
import { ResourceNotFoundError } from 'src/shared/errors';

export class UpdateCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly authorId: string,
    public readonly content: string,
  ) {}
}

export class UpdateCommentResult {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly authorId: string,
    public readonly postId: string,
    public readonly parentId: string | null,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

@Injectable()
export class UpdateCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  execute(command: UpdateCommentCommand) {
    return Effect.gen(this, function* () {
      const comment = yield* this.commentRepository.findById(command.commentId);
      if (!comment) {
        return yield* Effect.fail(
          new ResourceNotFoundError({
            resourceType: 'COMMENT',
            resourceId: command.commentId,
          }),
        );
      }

      yield* comment.updateContent(command.content, command.authorId);
      const updatedComment = yield* this.commentRepository.update(comment);

      return yield* Effect.succeed({
        id: updatedComment.id,
        content: updatedComment.content.value,
        authorId: updatedComment.authorId,
        postId: updatedComment.postId,
        isDeleted: updatedComment.isDeleted,
        createdAt: updatedComment.createdAt,
        updatedAt: updatedComment.updatedAt,
      });
    });
  }
}
