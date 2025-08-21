import { Effect } from 'effect';
import { Post, PostId } from 'src/post/domain';

export abstract class PostRepository {
  // Aggregate Root 영속성 관리만 담당
  abstract save(post: Post): Effect.Effect<Post>;
  abstract findById(id: PostId): Effect.Effect<Post | null>;
  abstract update(post: Post): Effect.Effect<Post>;
  abstract delete(id: PostId): Effect.Effect<void>;

  // 도메인 특화 행위
  abstract incrementViewCount(id: string): Effect.Effect<void>;
}
