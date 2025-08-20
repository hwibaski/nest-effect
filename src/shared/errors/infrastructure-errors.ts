import { Data } from 'effect';

// 데이터베이스 관련 에러
export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  readonly operation: string;
  readonly table?: string;
}> {}

export class DatabaseConnectionError extends Data.TaggedError(
  'DatabaseConnectionError',
)<{
  readonly connectionString?: string;
}> {
  get message() {
    return 'Failed to connect to database';
  }
}

export class DatabaseQueryError extends Data.TaggedError('DatabaseQueryError')<{
  readonly query: string;
  readonly parameters?: unknown[];
}> {
  get message() {
    return `Database query failed: ${this.query}`;
  }
}

export class DatabaseTransactionError extends Data.TaggedError(
  'DatabaseTransactionError',
)<{
  readonly operation: string;
}> {
  get message() {
    return `Database transaction failed during ${this.operation}`;
  }
}

// 외부 서비스 관련 에러
export class ExternalServiceError extends Data.TaggedError(
  'ExternalServiceError',
)<{
  readonly serviceName: string;
  readonly operation: string;
  readonly statusCode?: number;
  readonly message: string;
  readonly cause?: unknown;
}> {}

export class ExternalServiceTimeoutError extends Data.TaggedError(
  'ExternalServiceTimeoutError',
)<{
  readonly serviceName: string;
  readonly timeoutMs: number;
}> {
  get message() {
    return `${this.serviceName} service timed out after ${this.timeoutMs}ms`;
  }
}

export class ExternalServiceUnavailableError extends Data.TaggedError(
  'ExternalServiceUnavailableError',
)<{
  readonly serviceName: string;
  readonly statusCode?: number;
}> {
  get message() {
    return `${this.serviceName} service is unavailable`;
  }
}
