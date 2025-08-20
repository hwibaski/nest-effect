import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { PostRepository } from 'src/post/domain';
import { Post } from 'src/post/domain/post.entity';

export class CreatePostCommand {
  constructor(
    public readonly authorId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly tags?: string[],
  ) {}
}

export class CreatePostResponse {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly status: string,
    public readonly authorId: string,
    public readonly tags: string[],
    public readonly viewCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly publishedAt?: Date,
  ) {}
}

@Injectable()
export class CreatePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  execute(command: CreatePostCommand) {
    return Effect.gen(this, function* () {
      const post = yield* Post.create({
        title: command.title,
        content: command.content,
        authorId: command.authorId,
        tags: command.tags,
      });

      const savedPost = yield* this.postRepository.save(post);
      const plainPost = savedPost.toPlain();

      return yield* Effect.succeed({
        id: plainPost.id,
        title: plainPost.title,
        content: plainPost.content,
        status: plainPost.status,
        authorId: plainPost.authorId,
        publishedAt: plainPost.publishedAt,
        tags: plainPost.tags,
        viewCount: plainPost.viewCount,
        createdAt: plainPost.createdAt,
        updatedAt: plainPost.updatedAt,
      });
    });
  }
}
