import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from 'src/auth/auth.module';
import { CommentModule } from 'src/comment/comment.module';
import { MemberModule } from 'src/member/member.module';
import { PostModule } from 'src/post/post.module';
import { RepositoryModule } from 'src/repository/repository.module';
import { JwtAuthGuard } from 'src/shared/guards';

@Module({
  imports: [
    AuthModule,
    MemberModule,
    CommentModule,
    PostModule,
    RepositoryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
