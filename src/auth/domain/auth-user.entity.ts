import { Effect } from 'effect';
import { Email } from 'src/member/domain/email.vo';
import { Password } from 'src/member/domain/password.vo';
import {
  AccountDeactivatedError,
  InvalidCredentialsError,
} from 'src/shared/errors/domain/auth/errors';
import { v4 as uuid } from 'uuid';
import { AggregateRoot, Id, AuthUserRole } from '../../shared/types';

export type AuthUserId = Id<'AuthUser'>;

export class AuthUser extends AggregateRoot<'AuthUser'> {
  #email: Email;
  #password: Password;
  #name: string;
  #role: AuthUserRole;
  #isActive: boolean;

  private constructor(props: {
    id?: AuthUserId;
    email: Email;
    password: Password;
    name: string;
    role?: AuthUserRole;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    super(
      props.id || (uuid() as AuthUserId),
      props.createdAt || new Date(),
      props.updatedAt || new Date(),
      props.deletedAt || null,
      false,
    );
    this.#email = props.email;
    this.#password = props.password;
    this.#name = props.name;
    this.#role = props.role || AuthUserRole.MEMBER;
    this.#isActive = props.isActive ?? true;
  }

  static of(props: {
    id?: AuthUserId;
    email: Email;
    password: Password;
    name: string;
    role?: AuthUserRole;
  }) {
    return new AuthUser(props);
  }

  get email(): Email {
    return this.#email;
  }

  get name(): string {
    return this.#name;
  }

  get role(): AuthUserRole {
    return this.#role;
  }

  get isActive(): boolean {
    return this.#isActive;
  }

  toPlain() {
    return {
      id: this.id,
      email: this.#email.value,
      name: this.#name,
      role: this.#role,
      isActive: this.#isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      isDeleted: this.isDeleted,
    };
  }

  validatePassword(plainPassword: string): Effect.Effect<boolean, never> {
    return this.#password.compare(plainPassword);
  }

  login(plainPassword: string) {
    return Effect.gen(this, function* () {
      if (!this.#isActive) {
        return yield* Effect.fail(
          new AccountDeactivatedError({ memberId: this.id }),
        );
      }

      const isPasswordValid = yield* this.validatePassword(plainPassword);
      if (!isPasswordValid) {
        return yield* Effect.fail(new InvalidCredentialsError());
      }
    });
  }
}
