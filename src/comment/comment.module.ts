import { Module } from '@nestjs/common';
import {
  CreateCommentUseCase,
  DeleteCommentUseCase,
  GetCommentsUseCase,
  UpdateCommentUseCase,
} from 'src/comment/application';
import { CommentsController } from 'src/comment/presentation/comments.controller';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [CommentsController],
  providers: [
    CreateCommentUseCase,
    DeleteCommentUseCase,
    GetCommentsUseCase,
    UpdateCommentUseCase,
  ],
})
export class CommentModule {}
