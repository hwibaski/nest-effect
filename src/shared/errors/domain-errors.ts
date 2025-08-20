import { Data } from 'effect';
import { ValidationField, Action } from '../types/error-types';

// Value Object 검증 에러
export class ValidationError extends Data.TaggedError('ValidationError')<{
  readonly message: string;
  readonly field?: ValidationField;
  readonly value?: unknown;
}> {}

// 비즈니스 규칙 위반 에러
export class BusinessRuleError extends Data.TaggedError('BusinessRuleError')<{
  readonly message: string;
  readonly rule: string;
  readonly context?: Record<string, unknown>;
}> {}

// Entity 상태 변경 불가 에러
export class InvalidStateError extends Data.TaggedError('InvalidStateError')<{
  readonly message: string;
  readonly currentState: string;
  readonly requestedAction: Action;
}> {}
