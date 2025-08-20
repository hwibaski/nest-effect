import { Effect } from 'effect';
import { CommentContent } from 'src/comment/domain';
import { Post } from 'src/post/domain';
import { UnauthorizedError } from 'src/shared/errors';
import { 
  InvalidContentError, 
  DeletedCommentUpdateError 
} from 'src/shared/errors/domain/comment/errors';
import { v4 as uuid } from 'uuid';
import { AggregateRoot, AggregateRootId } from '../../shared/types';

export class Comment extends AggregateRoot<'Comment'> {
  #content: CommentContent;
  #authorId: string;
  #postId: string;

  constructor(props: {
    id?: AggregateRootId<'Comment'>;
    content: CommentContent;
    authorId: string;
    postId: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    super(
      props.id || (uuid() as AggregateRootId<'Comment'>),
      props.createdAt || new Date(),
      props.updatedAt || new Date(),
      props.deletedAt || null,
      props.isDeleted || false,
    );
    this.#content = props.content;
    this.#authorId = props.authorId;
    this.#postId = props.postId;
  }

  static create(content: string, authorId: string, postId: string, post: Post) {
    return Effect.gen(this, function* () {
      // 게시글 발행 상태 확인
      if (!post.isPublished()) {
        return yield* Effect.fail(
          new UnauthorizedError({
            action: 'COMMENT',
            resourceType: 'POST',
            resourceId: postId,
            memberId: authorId,
          }),
        );
      }

      const contentVO = yield* CommentContent.create(content);

      return new Comment({
        content: contentVO,
        authorId,
        postId,
      });
    });
  }

  get content(): CommentContent {
    return this.#content;
  }

  get authorId(): string {
    return this.#authorId;
  }

  get postId(): string {
    return this.#postId;
  }

  updateContent(content: string, authorId: string) {
    return Effect.gen(this, function* () {
      if (this.isDeleted) {
        return yield* Effect.fail(
          new DeletedCommentUpdateError({
            commentId: this.id,
            action: 'UPDATE',
            resourceType: 'COMMENT',
          }),
        );
      }

      if (!this.canBeEditedBy(authorId)) {
        return yield* Effect.fail(
          new UnauthorizedError({
            action: 'UPDATE',
            resourceType: 'COMMENT',
            resourceId: this.id,
            memberId: authorId,
          }),
        );
      }

      const contentVO = yield* CommentContent.create(content);
      this.#content = contentVO;
      this.updatedAt = new Date();
    });
  }

  delete(authorId: string) {
    return Effect.gen(this, function* () {
      if (!this.canBeDeletedBy(authorId)) {
        return yield* Effect.fail(
          new UnauthorizedError({
            action: 'DELETE',
            resourceType: 'COMMENT',
            resourceId: this.id,
            memberId: authorId,
          }),
        );
      }

      this.isDeleted = true;
      this.updatedAt = new Date();
    });
  }

  private canBeEditedBy(memberId: string): boolean {
    return this.#authorId === memberId && !this.isDeleted;
  }

  private canBeDeletedBy(memberId: string): boolean {
    return this.#authorId === memberId && !this.isDeleted;
  }

  toPlain() {
    return {
      id: this.id,
      content: this.#content.value,
      authorId: this.#authorId,
      postId: this.#postId,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}
