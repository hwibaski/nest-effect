import { Effect } from 'effect';
import { Comment } from 'src/comment/domain/comment.entity';

export abstract class CommentRepository {
  // Aggregate Root 영속성 관리만 담당
  abstract save(comment: Comment): Effect.Effect<Comment>;
  abstract findById(id: string): Effect.Effect<Comment | null>;
  abstract update(comment: Comment): Effect.Effect<Comment>;
  abstract delete(id: string): Effect.Effect<void>;
}
