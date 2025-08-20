import { Inject, Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import {
  PaginationOptions,
  PaginationResult,
  PostStatus,
} from '../../shared/types';
import { PostListData } from '../application/dao/post.dao';
import { Post } from '../domain/post.entity';
import { PostRepository } from '../domain/post.repository';
import { InMemoryPostRepository } from './in-memory-post.repository';

@Injectable()
export class InMemoryPostDao {
  constructor(
    @Inject(PostRepository)
    private readonly postRepository: InMemoryPostRepository,
  ) {}

  // Repository에서 데이터를 가져오는 메서드
  private getPostsData(): Map<string, Post> {
    return this.postRepository.getPostsData();
  }

  findByStatus(
    status: PostStatus,
    options: PaginationOptions,
  ): Effect.Effect<PaginationResult<PostListData>> {
    const statusPosts = Array.from(this.getPostsData().values()).filter(
      (post) => post.status === status,
    );
    const total = statusPosts.length;
    const startIndex = (options.page - 1) * options.limit;
    const endIndex = startIndex + options.limit;
    const data = statusPosts.slice(startIndex, endIndex).map(this.toListData);

    return Effect.succeed({
      data,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    });
  }

  // 변환 헬퍼 메서드들
  private toListData(post: Post): PostListData {
    return {
      id: post.id,
      title: post.title.value,
      contentPreview: post.content.getPreview(200),
      status: post.status,
      authorId: post.authorId,
      publishedAt: post.publishedAt,
      tags: post.tags,
      viewCount: post.viewCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
