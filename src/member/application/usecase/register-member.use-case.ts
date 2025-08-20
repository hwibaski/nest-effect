import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';

import { Member } from 'src/member/domain/member.entity';
import { MemberRepository } from 'src/member/domain/member.repository';
import { ResourceAlreadyExistsError } from 'src/shared/errors';
export class MemberRegistrationResult {
  constructor(
    public readonly member: {
      id: string;
      email: string;
      name: string;
      role: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    },
  ) {}
}

export class RegisterMemberCommand {
  readonly email: string;

  readonly password: string;

  readonly name: string;

  constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}

@Injectable()
export class RegisterMemberUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  execute(command: RegisterMemberCommand) {
    return Effect.gen(this, function* () {
      const existingMember = yield* this.memberRepository.findByEmail(
        command.email,
      );
      if (existingMember) {
        return yield* Effect.fail(
          new ResourceAlreadyExistsError({
            resourceType: 'MEMBER',
            identifier: command.email,
          }),
        );
      }

      const member = yield* Member.create(
        command.email,
        command.password,
        command.name,
      );
      const savedMember = yield* this.memberRepository.save(member);

      return yield* Effect.succeed(
        new MemberRegistrationResult({
          id: savedMember.id,
          email: savedMember.email.value,
          name: savedMember.name,
          role: savedMember.role,
          isActive: savedMember.isActive,
          createdAt: savedMember.createdAt,
          updatedAt: savedMember.updatedAt,
        }),
      );
    });
  }
}
