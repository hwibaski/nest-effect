import { createHash } from 'crypto';
import { Effect } from 'effect';
import { InvalidPasswordError } from '../../shared/errors/domain/member/errors';
import { ValidationField, ValueObject } from '../../shared/types';

export class Password extends ValueObject<string> {
  private constructor(hashedValue: string) {
    super(hashedValue);
  }

  static create(
    plainPassword: string,
  ): Effect.Effect<Password, InvalidPasswordError> {
    const requirements = this.getPasswordRequirements(plainPassword);
    if (requirements.length > 0) {
      return Effect.fail(
        new InvalidPasswordError({
          requirements,
          field: ValidationField.PASSWORD,
          receivedValue: plainPassword,
        }),
      );
    }
    // 간단한 해시 구현 (실제 프로덕션에서는 bcrypt 사용 권장)
    const hashedValue = createHash('sha256')
      .update(plainPassword + 'salt')
      .digest('hex');
    return Effect.succeed(new Password(hashedValue));
  }

  compare(plainPassword: string): Effect.Effect<boolean, never> {
    return Effect.sync(() => {
      const hashedInput = createHash('sha256')
        .update(plainPassword + 'salt')
        .digest('hex');
      return hashedInput === this.value;
    });
  }

  private static getPasswordRequirements(password: string): string[] {
    const requirements: string[] = [];

    if (password.length < 8) {
      requirements.push('at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      requirements.push('at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      requirements.push('at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      requirements.push('at least one number');
    }

    return requirements;
  }
}
