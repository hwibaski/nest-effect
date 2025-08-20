import { Data } from 'effect';
import { Action, ResourceType } from '../../../types/error-types';

// Comment 도메인 특화 에러
export class CommentOnDeletedError extends Data.TaggedError(
  'CommentOnDeletedError',
)<{
  readonly postId: string;
  readonly resourceType: ResourceType;
  readonly action: Action;
}> {
  get message() {
    return `Cannot comment on deleted post with id '${this.postId}'`;
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

export class DeletedCommentUpdateError extends Data.TaggedError(
  'DeletedCommentUpdateError',
)<{
  readonly commentId: string;
  readonly action: Action;
  readonly resourceType: ResourceType;
}> {
  get message() {
    return `Cannot update deleted comment with id '${this.commentId}'`;
  }
}
