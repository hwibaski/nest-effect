import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { CommentRepository } from 'src/comment/domain';
import { ResourceNotFoundError } from 'src/shared/errors';

export class DeleteCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly authorId: string,
  ) {}
}

@Injectable()
export class DeleteCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  execute(command: DeleteCommentCommand) {
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

      yield* comment.delete(command.authorId);
      yield* this.commentRepository.update(comment);
      return yield* Effect.succeed(0);
    });
  }
}
