import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { Member } from 'src/member/domain/member.entity';
import { MemberRepository } from 'src/member/domain/member.repository';
import { ResourceAlreadyExistsError } from 'src/shared/errors';

@Injectable()
export class MemberEmailUpdateService {
  constructor(private readonly memberRepository: MemberRepository) {}

  execute(targetEmail: string, member: Member) {
    return Effect.gen(this, function* () {
      const existingMember =
        yield* this.memberRepository.findByEmail(targetEmail);

      if (existingMember && existingMember.id !== member.id) {
        return yield* Effect.fail(
          new ResourceAlreadyExistsError({
            resourceType: 'MEMBER',
            identifier: targetEmail,
          }),
        );
      }

      yield* member.updateEmailWithValidation(targetEmail);
    });
  }
}
