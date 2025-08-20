export type AggregateRootId<B extends string> = string & {
  readonly __brand: B;
};

export class AggregateRoot<B extends string> {
  constructor(
    public readonly id: AggregateRootId<B>,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null,
    public isDeleted: boolean,
  ) {}
}

export class ValueObject<T> {
  constructor(public readonly value: T) {}

  equals(other: ValueObject<T>): boolean {
    return this.value === other.value;
  }
}

export enum AuthUserRole {
  MEMBER = 'member',
  ADMIN = 'admin',
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export * from './error-types';
