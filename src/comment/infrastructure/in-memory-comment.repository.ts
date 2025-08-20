import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { Comment } from 'src/comment/domain';
import { CommentRepository } from 'src/comment/domain/comment.repository';

@Injectable()
export class InMemoryCommentRepository implements CommentRepository {
  private comments: Map<string, Comment> = new Map();

  // DAO에서 사용할 수 있도록 comments를 반환하는 getter
  getCommentsData(): Map<string, Comment> {
    return this.comments;
  }

  save(comment: Comment): Effect.Effect<Comment> {
    this.comments.set(comment.id, comment);
    return Effect.succeed(comment);
  }

  findById(id: string): Effect.Effect<Comment | null> {
    return Effect.succeed(this.comments.get(id) || null);
  }

  update(comment: Comment): Effect.Effect<Comment> {
    this.comments.set(comment.id, comment);
    return Effect.succeed(comment);
  }

  delete(id: string): Effect.Effect<void> {
    this.comments.delete(id);
    return Effect.succeed(void 0);
  }
}
