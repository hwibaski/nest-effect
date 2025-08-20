import { Effect } from 'effect';
import { AuthUser } from 'src/auth/domain/auth-user.entity';

export abstract class AuthUserRepository {
  abstract findByEmail(email: string): Effect.Effect<AuthUser | null>;
}
