import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { AuthUser } from 'src/auth/domain/auth-user.entity';
import { AuthUserRepository } from 'src/auth/domain/auth-user.repository';
import { membersMap } from 'src/member/infrastructure/in-memory-member.repository';
import { AggregateRootId } from 'src/shared/types';

@Injectable()
export class InMemoryAuthUserRepository implements AuthUserRepository {
  findByEmail(email: string): Effect.Effect<AuthUser | null> {
    for (const member of membersMap.values()) {
      if (member.email.value === email) {
        return Effect.succeed(
          AuthUser.of({
            id: member.id as unknown as AggregateRootId<'AuthUser'>,
            email: member.email,
            password: member.password,
            name: member.name,
            role: member.role,
          }),
        );
      }
    }
    return Effect.succeed(null);
  }
}
