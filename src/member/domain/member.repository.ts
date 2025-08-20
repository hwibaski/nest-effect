import { Effect } from 'effect';
import { Member } from 'src/member/domain/member.entity';

export abstract class MemberRepository {
  // Aggregate Root 영속성 관리만 담당
  abstract save(member: Member): Effect.Effect<Member>;
  abstract findById(id: string): Effect.Effect<Member | null>;
  abstract findByEmail(email: string): Effect.Effect<Member | null>;
  abstract update(member: Member): Effect.Effect<Member>;
  abstract delete(id: string): Effect.Effect<void>;

  // 도메인 특화 검증
  abstract existsByEmail(email: string): Effect.Effect<boolean>;
}
