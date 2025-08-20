import { Data } from 'effect';

export class InvalidCredentialsError extends Data.TaggedError(
  'InvalidCredentialsError',
) {
  get message() {
    return 'Invalid credentials provided';
  }
}

export class AccountDeactivatedError extends Data.TaggedError(
  'AccountDeactivatedError',
)<{
  readonly memberId: string;
}> {
  get message() {
    return `Account ${this.memberId} is deactivated`;
  }
}
