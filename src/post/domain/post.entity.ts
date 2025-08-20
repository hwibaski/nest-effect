import { Effect } from 'effect';
import { PostContent } from 'src/post/domain/post-content.vo';
import { Title } from 'src/post/domain/title.vo';
import { UnauthorizedError } from 'src/shared/errors';
import { v4 as uuid } from 'uuid';
import { PostAlreadyPublishedError } from '../../shared/errors/domain/post/errors';
import {
  Action,
  AggregateRoot,
  AggregateRootId,
  PostStatus,
  ResourceType,
} from '../../shared/types';

export class Post extends AggregateRoot<'Post'> {
  #title: Title;
  #content: PostContent;
  #status: PostStatus;
  #authorId: string;
  #publishedAt?: Date;
  #tags: string[];
  #viewCount: number;

  constructor(props: {
    id?: AggregateRootId<'Post'>;
    title: Title;
    content: PostContent;
    authorId: string;
    status?: PostStatus;
    publishedAt?: Date;
    tags?: string[];
    viewCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    super(
      props.id || (uuid() as AggregateRootId<'Post'>),
      props.createdAt || new Date(),
      props.updatedAt || new Date(),
      props.deletedAt || null,
      false,
    );
    this.#title = props.title;
    this.#content = props.content;
    this.#authorId = props.authorId;
    this.#status = props.status || PostStatus.DRAFT;
    this.#publishedAt = props.publishedAt;
    this.#tags = props.tags || [];
    this.#viewCount = props.viewCount || 0;
  }

  static create(props: {
    title: string;
    content: string;
    authorId: string;
    tags?: string[];
  }) {
    return Effect.gen(this, function* () {
      const title = yield* Title.create(props.title);
      const content = yield* PostContent.create(props.content);

      return yield* Effect.succeed(
        new Post({
          title,
          content,
          authorId: props.authorId,
          tags: props.tags || [],
        }),
      );
    });
  }

  get title(): Title {
    return this.#title;
  }

  get content(): PostContent {
    return this.#content;
  }

  get status(): PostStatus {
    return this.#status;
  }

  get authorId(): string {
    return this.#authorId;
  }

  get publishedAt(): Date | undefined {
    return this.#publishedAt;
  }

  get tags(): string[] {
    return [...this.#tags];
  }

  get viewCount(): number {
    return this.#viewCount;
  }

  updateTitle(title: string, authorId: string) {
    return Effect.gen(this, function* () {
      yield* this.isAvailableToUpdate(authorId);
      const titleVO = yield* Title.create(title);

      this.#title = titleVO;
      this.updatedAt = new Date();
    });
  }

  updateContent(content: string, authorId: string) {
    return Effect.gen(this, function* () {
      yield* this.isAvailableToUpdate(authorId);
      const contentVO = yield* PostContent.create(content);
      this.#content = contentVO;
      this.updatedAt = new Date();
    });
  }

  updateTags(tags: string[], authorId: string) {
    return Effect.gen(this, function* () {
      yield* this.isAvailableToUpdate(authorId);
      this.#tags = [...tags];
      this.updatedAt = new Date();
    });
  }

  private isAvailableToUpdate(
    authorId: string,
  ): Effect.Effect<void, UnauthorizedError> {
    return Effect.gen(this, function* () {
      if (!this.canBeEditedBy(authorId)) {
        return Effect.fail(
          new UnauthorizedError({
            action: Action.UPDATE,
            resourceType: ResourceType.POST,
            resourceId: this.id,
            memberId: authorId,
          }),
        );
      }
    });
  }

  publish(authorId: string) {
    return Effect.gen(this, function* () {
      yield* this.isAvailableToUpdate(authorId);

      if (this.#status === PostStatus.PUBLISHED) {
        return yield* Effect.fail(
          new PostAlreadyPublishedError({
            postId: this.id,
            resourceType: ResourceType.POST,
            action: Action.PUBLISH,
          }),
        );
      }

      this.#status = PostStatus.PUBLISHED;
      this.#publishedAt = new Date();
      this.updatedAt = new Date();
    });
  }

  incrementViewCount(): void {
    this.#viewCount += 1;
    this.updatedAt = new Date();
  }

  isPublished(): boolean {
    return this.#status === PostStatus.PUBLISHED;
  }

  private canBeEditedBy(memberId: string): boolean {
    return this.#authorId === memberId;
  }

  delete(memberId: string) {
    return Effect.gen(this, function* () {
      if (!this.canBeEditedBy(memberId)) {
        return yield* Effect.fail(
          new UnauthorizedError({
            action: 'DELETE',
          }),
        );
      }

      this.#status = PostStatus.ARCHIVED;
      this.deletedAt = new Date();
      this.updatedAt = new Date();
      this.isDeleted = true;
    });
  }

  toPlain() {
    return {
      id: this.id,
      title: this.#title.value,
      content: this.#content.value,
      status: this.#status,
      authorId: this.#authorId,
      publishedAt: this.#publishedAt,
      tags: [...this.#tags],
      viewCount: this.#viewCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      isDeleted: this.isDeleted,
    };
  }
}
