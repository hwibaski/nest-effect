import { Effect } from 'effect';
import { InvalidContentError } from 'src/shared/errors/domain/comment/errors';
import { ValueObject } from 'src/shared/types';

export class CommentContent extends ValueObject<string> {
  private constructor(content: string) {
    super(content.trim());
  }

  static create(
    content: string,
  ): Effect.Effect<CommentContent, InvalidContentError> {
    const trimmedContent = content.trim();
    if (!this.isValid(trimmedContent)) {
      return Effect.fail(
        new InvalidContentError({
          contentLength: trimmedContent.length,
          maxLength: 50000,
          field: 'content',
          receivedValue: content,
        }),
      );
    }
    return Effect.succeed(new CommentContent(trimmedContent));
  }

  private static isValid(content: string): boolean {
    return content.length >= 1 && content.length <= 50000;
  }
}
