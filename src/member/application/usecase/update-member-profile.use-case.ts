import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { MemberEmailUpdateService } from 'src/member/domain/member-email-update.service';
import { MemberRepository } from 'src/member/domain/member.repository';
import { ResourceNotFoundError } from 'src/shared/errors';

export class UpdateMemberProfileCommand {
  readonly memberId: string;
  readonly name?: string;
  readonly email?: string;
  constructor(memberId: string, name?: string, email?: string) {
    this.memberId = memberId;
    this.name = name;
    this.email = email;
  }
}

export class MemberResponseDto {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
    readonly role: string,
    readonly isActive: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}

@Injectable()
export class UpdateMemberProfileUseCase {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly memberEmailUpdateService: MemberEmailUpdateService,
  ) {}

  execute(command: UpdateMemberProfileCommand) {
    return Effect.gen(this, function* () {
      const member = yield* this.memberRepository.findById(command.memberId);
      if (!member) {
        return yield* Effect.fail(
          new ResourceNotFoundError({
            resourceType: 'MEMBER',
            resourceId: command.memberId,
          }),
        );
      }

      if (command.name) {
        yield* member.updateProfile(command.name);
      }

      if (command.email) {
        yield* this.memberEmailUpdateService.execute(command.email, member);
      }

      const updatedMember = yield* this.memberRepository.update(member);

      return yield* Effect.succeed(
        new MemberResponseDto(
          updatedMember.id,
          updatedMember.email.value,
          updatedMember.name,
          updatedMember.role,
          updatedMember.isActive,
          updatedMember.createdAt,
          updatedMember.updatedAt,
        ),
      );
    });
  }
}
