import { Module } from '@nestjs/common';
import {
  RegisterMemberUseCase,
  UpdateMemberProfileUseCase,
} from 'src/member/application/usecase';
import { MemberEmailUpdateService } from 'src/member/domain/member-email-update.service';
import { MemberController } from 'src/member/presentation/member.controller';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [MemberController],
  providers: [
    RegisterMemberUseCase,
    UpdateMemberProfileUseCase,
    MemberEmailUpdateService,
  ],
  exports: [RegisterMemberUseCase, UpdateMemberProfileUseCase],
})
export class MemberModule {}
