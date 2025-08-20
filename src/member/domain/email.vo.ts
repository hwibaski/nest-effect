import { Effect } from 'effect';
import { InvalidEmailError } from '../../shared/errors/domain/member/errors';
import { ValidationField, ValueObject } from '../../shared/types';

export class Email extends ValueObject<string> {
  private constructor(email: string) {
    super(email.toLowerCase().trim());
  }

  static create(email: string): Effect.Effect<Email, InvalidEmailError> {
    if (!this.isValid(email)) {
      return Effect.fail(
        new InvalidEmailError({
          field: ValidationField.EMAIL,
          receivedValue: email,
        }),
      );
    }
    return Effect.succeed(new Email(email));
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 320;
  }
}
