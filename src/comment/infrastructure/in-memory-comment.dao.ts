import { Inject, Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { PaginationOptions, PaginationResult } from '../../shared/types';
import { CommentListData } from '../application/dao/comment.dao';
import { Comment } from '../domain/comment.entity';
import { CommentRepository } from '../domain/comment.repository';
import { InMemoryCommentRepository } from './in-memory-comment.repository';

@Injectable()
export class InMemoryCommentDao {
  constructor(
    @Inject(CommentRepository)
    private readonly commentRepository: InMemoryCommentRepository,
  ) {}

  // Repository에서 데이터를 가져오는 메서드
  private getCommentsData(): Map<string, Comment> {
    return this.commentRepository.getCommentsData();
  }

  findActiveCommentsByPostId(
    postId: string,
    options: PaginationOptions,
  ): Effect.Effect<PaginationResult<CommentListData>> {
    const activeComments = Array.from(this.getCommentsData().values()).filter(
      (comment) => comment.postId === postId && !comment.isDeleted,
    );
    const total = activeComments.length;
    const startIndex = (options.page - 1) * options.limit;
    const endIndex = startIndex + options.limit;
    const data = activeComments
      .slice(startIndex, endIndex)
      .map(this.toListData);

    return Effect.succeed({
      data,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit),
    });
  }

  // 변환 헬퍼 메서드들
  private toListData(comment: Comment): CommentListData {
    return {
      id: comment.id,
      content: comment.content.value,
      authorId: comment.authorId,
      postId: comment.postId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
