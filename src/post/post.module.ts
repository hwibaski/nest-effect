import { Module } from '@nestjs/common';
import {
  CreatePostUseCase,
  DeletePostUseCase,
  GetPostByIdUseCase,
  GetPostsUseCase,
  PublishPostUseCase,
  UpdatePostUseCase,
} from 'src/post/application/usecase';
import { PostsController } from 'src/post/presentation/posts.controller';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [PostsController],
  providers: [
    CreatePostUseCase,
    DeletePostUseCase,
    GetPostByIdUseCase,
    GetPostsUseCase,
    PublishPostUseCase,
    UpdatePostUseCase,
  ],
})
export class PostModule {}
