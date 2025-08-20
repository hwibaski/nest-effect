import { Module } from '@nestjs/common';
import { AuthUserRepository } from 'src/auth/domain/auth-user.repository';
import { InMemoryAuthUserRepository } from 'src/auth/infrastructure/in-memory-auth-user.repository';
import { CommentRepository } from 'src/comment/domain';
import { InMemoryCommentDao } from 'src/comment/infrastructure/in-memory-comment.dao';
import { InMemoryCommentRepository } from 'src/comment/infrastructure/in-memory-comment.repository';
import { MemberRepository } from 'src/member/domain/member.repository';
import { InMemoryMemberRepository } from 'src/member/infrastructure/in-memory-member.repository';
import { PostRepository } from 'src/post/domain';
import { InMemoryPostDao } from 'src/post/infrastructure/in-memory-post.dao';
import { InMemoryPostRepository } from 'src/post/infrastructure/in-memory-post.repository';

@Module({
  providers: [
    // Repositories
    {
      provide: MemberRepository,
      useClass: InMemoryMemberRepository,
    },
    {
      provide: CommentRepository,
      useClass: InMemoryCommentRepository,
    },
    {
      provide: PostRepository,
      useClass: InMemoryPostRepository,
    },
    {
      provide: AuthUserRepository,
      useClass: InMemoryAuthUserRepository,
    },
    // DAOs
    InMemoryCommentDao,
    InMemoryPostDao,
  ],
  exports: [
    MemberRepository,
    CommentRepository,
    PostRepository,
    AuthUserRepository,
    InMemoryCommentDao,
    InMemoryPostDao,
  ],
})
export class RepositoryModule {}
