import { Data } from 'effect';
import { Action, ResourceType } from '../types/error-types';

// 애플리케이션 레이어 기본 에러
export class ApplicationError extends Data.TaggedError('ApplicationError')<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

// 리소스 관련 에러
export class ResourceNotFoundError extends Data.TaggedError(
  'ResourceNotFoundError',
)<{
  readonly resourceType: ResourceType;
  readonly resourceId: string;
}> {
  get message() {
    return `${this.resourceType} with id '${this.resourceId}' not found`;
  }
}

export class ResourceAlreadyExistsError extends Data.TaggedError(
  'ResourceAlreadyExistsError',
)<{
  readonly resourceType: ResourceType;
  readonly identifier: string;
}> {
  get message() {
    return `${this.resourceType} with identifier '${this.identifier}' already exists`;
  }
}

// 권한 관련 에러
export class UnauthorizedError extends Data.TaggedError('UnauthorizedError')<{
  readonly action: Action;
  readonly resourceType?: ResourceType;
  readonly resourceId?: string;
  readonly memberId?: string;
}> {
  get message() {
    return this.resourceType
      ? `Unauthorized to ${this.action} ${this.resourceType} ${this.resourceId || ''}`
      : `Unauthorized to ${this.action}`;
  }
}
