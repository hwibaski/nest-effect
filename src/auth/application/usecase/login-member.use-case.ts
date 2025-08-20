import { Injectable } from '@nestjs/common';
import { Effect } from 'effect';
import { AuthJwtService } from 'src/auth/application/jwt.service';
import { AuthUserRepository } from 'src/auth/domain/auth-user.repository';
import {
  AccountDeactivatedError,
  InvalidCredentialsError,
} from 'src/shared/errors/domain/auth/errors';
import { InvalidEmailError } from 'src/shared/errors/domain/member/errors';

export class AuthReponseResult {
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
    public readonly accessToken: string,
  ) {}
}

export class LoginMemberCommand {
  readonly email: string;

  readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

@Injectable()
export class LoginMemberUseCase {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly jwtService: AuthJwtService,
  ) {}

  execute(
    command: LoginMemberCommand,
  ): Effect.Effect<
    AuthReponseResult,
    InvalidEmailError | InvalidCredentialsError | AccountDeactivatedError
  > {
    return Effect.gen(this, function* () {
      const authUser = yield* this.authUserRepository.findByEmail(
        command.email,
      );
      if (!authUser) {
        return yield* Effect.fail(new InvalidCredentialsError());
      }

      yield* authUser.login(command.password);

      const accessToken = yield* Effect.promise(() =>
        this.jwtService.generateAccessToken(authUser),
      );

      return yield* Effect.succeed(
        new AuthReponseResult(
          {
            id: authUser.id,
            email: authUser.email.value,
            name: authUser.name,
            role: authUser.role,
            isActive: authUser.isActive,
            createdAt: authUser.createdAt,
            updatedAt: authUser.updatedAt,
          },
          accessToken,
        ),
      );
    });
  }
}
