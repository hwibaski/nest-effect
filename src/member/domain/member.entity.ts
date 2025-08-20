import { Effect } from 'effect';
import { Email } from 'src/member/domain/email.vo';
import { Password } from 'src/member/domain/password.vo';
import { InvalidNameError } from 'src/shared/errors/domain/member/errors';
import { v4 as uuid } from 'uuid';
import {
  AggregateRoot,
  AggregateRootId,
  AuthUserRole,
  ValidationField,
} from '../../shared/types';

export class Member extends AggregateRoot<'Member'> {
  #email: Email;
  #password: Password;
  #name: string;
  #role: AuthUserRole;
  #isActive: boolean;

  constructor(props: {
    id?: AggregateRootId<'Member'>;
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
      props.id || (uuid() as AggregateRootId<'Member'>),
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

  static create(email: string, password: string, name: string) {
    return Effect.gen(this, function* () {
      const emailVO = yield* Email.create(email);
      const passwordVO = yield* Password.create(password);

      const member = new Member({
        email: emailVO,
        password: passwordVO,
        name,
      });

      return member;
    });
  }

  get email(): Email {
    return this.#email;
  }

  get password(): Password {
    return this.#password;
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

  updateProfile(name: string) {
    return Effect.gen(this, function* () {
      if (!name || name.trim().length === 0) {
        return yield* Effect.fail(
          new InvalidNameError({
            field: ValidationField.NAME,
            receivedValue: name,
          }),
        );
      }
      this.#name = name.trim();
      this.updatedAt = new Date();
    });
  }

  updateEmailWithValidation(newEmail: string) {
    return Effect.gen(this, function* () {
      const emailVO = yield* Email.create(newEmail);

      this.#email = emailVO;
      this.updatedAt = new Date();
    });
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
}
