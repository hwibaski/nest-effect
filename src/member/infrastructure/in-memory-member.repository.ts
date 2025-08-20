import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { Member } from 'src/member/domain/member.entity';
import { MemberRepository } from 'src/member/domain/member.repository';

export const membersMap = new Map<string, Member>();

@Injectable()
export class InMemoryMemberRepository implements MemberRepository {
  // DAO에서 사용할 수 있도록 members를 반환하는 getter
  getMembersData(): Map<string, Member> {
    return membersMap;
  }

  save(member: Member): Effect.Effect<Member> {
    membersMap.set(member.id, member);
    return Effect.succeed(member);
  }

  findById(id: string): Effect.Effect<Member | null> {
    return Effect.succeed(membersMap.get(id) || null);
  }

  findByEmail(email: string): Effect.Effect<Member | null> {
    for (const member of membersMap.values()) {
      if (member.email.value === email) {
        return Effect.succeed(member);
      }
    }
    return Effect.succeed(null);
  }

  update(member: Member): Effect.Effect<Member> {
    if (!membersMap.has(member.id)) {
      throw new Error('Member not found');
    }
    membersMap.set(member.id, member);
    return Effect.succeed(member);
  }

  delete(id: string): Effect.Effect<void> {
    membersMap.delete(id);
    return Effect.succeed(void 0);
  }

  existsByEmail(email: string): Effect.Effect<boolean> {
    return Effect.map(this.findByEmail(email), (member) => member !== null);
  }
}
