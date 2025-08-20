import { Effect } from 'effect';
import { ValueObject } from 'src/shared/types';
import { InvalidContentError } from '../../shared/errors/domain/post/errors';

export class PostContent extends ValueObject<string> {
  private constructor(content: string) {
    super(content.trim());
  }

  static create(
    content: string,
  ): Effect.Effect<PostContent, InvalidContentError> {
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
    return Effect.succeed(new PostContent(trimmedContent));
  }

  getPreview(length: number = 200): string {
    if (this.value.length <= length) {
      return this.value;
    }
    return this.value.substring(0, length) + '...';
  }

  private static isValid(content: string): boolean {
    return content.length >= 1 && content.length <= 50000;
  }
}
