import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { Post } from 'src/post/domain';
import { PostRepository } from 'src/post/domain/post.repository';

@Injectable()
export class InMemoryPostRepository implements PostRepository {
  private posts: Map<string, Post> = new Map();

  // DAO에서 사용할 수 있도록 posts를 반환하는 getter
  getPostsData(): Map<string, Post> {
    return this.posts;
  }

  save(post: Post): Effect.Effect<Post> {
    this.posts.set(post.id, post);
    return Effect.succeed(post);
  }

  findById(id: string): Effect.Effect<Post | null> {
    return Effect.succeed(this.posts.get(id) || null);
  }

  update(post: Post): Effect.Effect<Post> {
    this.posts.set(post.id, post);
    return Effect.succeed(post);
  }

  delete(id: string): Effect.Effect<void> {
    this.posts.delete(id);
    return Effect.succeed(void 0);
  }

  incrementViewCount(id: string): Effect.Effect<void> {
    const post = this.posts.get(id);
    if (post) {
      post.incrementViewCount();
      this.posts.set(id, post);
    }
    return Effect.succeed(void 0);
  }
}
