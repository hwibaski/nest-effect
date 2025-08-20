import { Effect } from 'effect';
import { ValueObject } from 'src/shared/types';
import { InvalidTitleError } from '../../shared/errors/domain/post/errors';

export class Title extends ValueObject<string> {
  private constructor(title: string) {
    super(title.trim());
  }

  static create(title: string): Effect.Effect<Title, InvalidTitleError> {
    const trimmedTitle = title.trim();
    if (!this.isValid(trimmedTitle)) {
      return Effect.fail(
        new InvalidTitleError({
          title: trimmedTitle,
          minLength: 1,
          maxLength: 200,
          field: 'title',
          receivedValue: title,
        }),
      );
    }
    return Effect.succeed(new Title(trimmedTitle));
  }

  private static isValid(title: string): boolean {
    return title.length >= 1 && title.length <= 200;
  }
}
