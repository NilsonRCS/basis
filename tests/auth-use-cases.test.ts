import assert from "node:assert/strict";
import test from "node:test";
import { CreateUserUseCase } from "../src/application/use-cases/user/create-user.use-case.js";
import { LoginUseCase } from "../src/application/use-cases/auth/login.use-case.js";
import { GetCurrentUserUseCase } from "../src/application/use-cases/auth/me.use-case.js";
import { InMemoryUserRepository } from "../src/infrastructure/repositories/in-memory-user.repository.js";
import { AppError } from "../src/shared/errors/app-error.js";
import type { TokenPayload, TokenServicePort } from "../src/application/ports/token-service.port.js";

class FakeTokenService implements TokenServicePort {
  sign(payload: TokenPayload): string {
    return `token:${payload.sub}:${payload.email}`;
  }

  verify(token: string): TokenPayload | null {
    const parts = token.split(":");
    if (parts.length !== 3 || parts[0] !== "token") {
      return null;
    }

    const [, sub, email] = parts;
    return { sub, email };
  }
}

test("login returns access token with valid credentials", async () => {
  const repository = new InMemoryUserRepository();
  const createUser = new CreateUserUseCase(repository);
  const loginUseCase = new LoginUseCase(repository, new FakeTokenService());

  const created = await createUser.execute({
    name: "Auth User",
    email: "auth@example.com",
    password: "secret123",
  });

  const result = await loginUseCase.execute({
    email: "auth@example.com",
    password: "secret123",
  });

  assert.equal(result.accessToken, `token:${created.id}:auth@example.com`);
});

test("login rejects invalid credentials", async () => {
  const repository = new InMemoryUserRepository();
  const createUser = new CreateUserUseCase(repository);
  const loginUseCase = new LoginUseCase(repository, new FakeTokenService());

  await createUser.execute({
    name: "Auth User",
    email: "auth@example.com",
    password: "secret123",
  });

  await assert.rejects(
    () =>
      loginUseCase.execute({
        email: "auth@example.com",
        password: "wrong-password",
      }),
    (error: unknown) => error instanceof AppError && error.statusCode === 401
  );
});

test("me returns current user with valid bearer token", async () => {
  const repository = new InMemoryUserRepository();
  const tokenService = new FakeTokenService();
  const createUser = new CreateUserUseCase(repository);
  const meUseCase = new GetCurrentUserUseCase(repository, tokenService);

  const created = await createUser.execute({
    name: "Current User",
    email: "me@example.com",
    password: "secret123",
  });

  const token = tokenService.sign({ sub: created.id, email: created.email });
  const result = await meUseCase.execute(`Bearer ${token}`);

  assert.equal(result.id, created.id);
  assert.equal(result.email, "me@example.com");
});

test("me rejects when bearer token is missing", async () => {
  const repository = new InMemoryUserRepository();
  const meUseCase = new GetCurrentUserUseCase(repository, new FakeTokenService());

  await assert.rejects(
    () => meUseCase.execute(undefined),
    (error: unknown) => error instanceof AppError && error.statusCode === 401
  );
});
