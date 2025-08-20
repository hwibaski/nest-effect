import { Data } from 'effect';

// Auth 도메인 특화 에러
export class InvalidEmailError extends Data.TaggedError('InvalidEmailError')<{
  readonly field: string;
  readonly receivedValue: string;
}> {
  get message() {
    return `Invalid email format: ${this.receivedValue}`;
  }
}

export class InvalidPasswordError extends Data.TaggedError(
  'InvalidPasswordError',
)<{
  readonly requirements: string[];
  readonly field: string;
  readonly receivedValue: string;
}> {
  get message() {
    return `Password does not meet requirements: ${this.requirements.join(
      ', ',
    )}`;
  }
}

export class InvalidNameError extends Data.TaggedError('InvalidNameError')<{
  readonly field: string;
  readonly receivedValue: string;
}> {
  get message() {
    return `Name cannot be empty`;
  }
}
