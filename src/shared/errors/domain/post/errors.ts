import { Data } from 'effect';
import { Action, ResourceType } from '../../../types/error-types';

// Post 도메인 특화 에러
export class InvalidTitleError extends Data.TaggedError('InvalidTitleError')<{
  readonly title: string;
  readonly minLength: number;
  readonly maxLength: number;
  readonly field: string;
  readonly receivedValue: string;
}> {
  get message() {
    return `Title must be between ${this.minLength} and ${this.maxLength} characters`;
  }
}

export class InvalidContentError extends Data.TaggedError(
  'InvalidContentError',
)<{
  readonly contentLength: number;
  readonly maxLength: number;
  readonly field: string;
  readonly receivedValue: string;
}> {
  get message() {
    return `Content length ${this.contentLength} exceeds maximum of ${this.maxLength} characters`;
  }
}

export class PostAlreadyPublishedError extends Data.TaggedError(
  'PostAlreadyPublishedError',
)<{
  readonly postId: string;
  readonly resourceType: ResourceType;
  readonly action: Action;
}> {
  get message() {
    return `Post with id '${this.postId}' is already published`;
  }
}

export class PostNotPublishedError extends Data.TaggedError(
  'PostNotPublishedError',
)<{
  readonly postId: string;
  readonly resourceType: ResourceType;
  readonly action: Action;
}> {
  get message() {
    return `Post with id '${this.postId}' is not published`;
  }
}
