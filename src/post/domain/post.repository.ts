import { Effect } from 'effect';
import { Post } from 'src/post/domain';

export abstract class PostRepository {
  // Aggregate Root 영속성 관리만 담당
  abstract save(post: Post): Effect.Effect<Post>;
  abstract findById(id: string): Effect.Effect<Post | null>;
  abstract update(post: Post): Effect.Effect<Post>;
  abstract delete(id: string): Effect.Effect<void>;

  // 도메인 특화 행위
  abstract incrementViewCount(id: string): Effect.Effect<void>;
}
