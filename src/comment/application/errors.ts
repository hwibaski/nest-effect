import { Data } from 'effect';

export class CommentOnUnpublishedPostError extends Data.TaggedError(
  'CommentOnUnpublishedPostError',
)<{
  readonly postId: string;
}> {
  get message() {
    return `Cannot comment on unpublished post ${this.postId}`;
  }
}

export class ParentCommentMismatchError extends Data.TaggedError(
  'ParentCommentMismatchError',
)<{
  readonly parentCommentId: string;
  readonly postId: string;
}> {
  get message() {
    return `Parent comment ${this.parentCommentId} does not belong to post ${this.postId}`;
  }
}
