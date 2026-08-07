import assert from "node:assert/strict";
import test from "node:test";
import { CreateUserUseCase } from "../src/application/use-cases/user/create-user.use-case.js";
import { DeleteUserUseCase } from "../src/application/use-cases/user/delete-user.use-case.js";
import { GetUserUseCase } from "../src/application/use-cases/user/get-user.use-case.js";
import { ListUsersUseCase } from "../src/application/use-cases/user/list-users.use-case.js";
import { UpdateUserUseCase } from "../src/application/use-cases/user/update-user.use-case.js";
import { InMemoryUserRepository } from "../src/infrastructure/repositories/in-memory-user.repository.js";
import { AppError, ConflictError, NotFoundError } from "../src/shared/errors/app-error.js";

test("create and list users", async () => {
  const repository = new InMemoryUserRepository();
  const createUser = new CreateUserUseCase(repository);
  const listUsers = new ListUsersUseCase(repository);

  const created = await createUser.execute({
    name: "Ana",
    email: "ana@example.com",
    password: "secret123",
  });

  assert.equal(created.email, "ana@example.com");

  const result = await listUsers.execute({ page: 1, limit: 10 });
  assert.equal(result.total, 1);
  assert.equal(result.users[0].id, created.id);
});

test("reject duplicate email", async () => {
  const repository = new InMemoryUserRepository();
  const createUser = new CreateUserUseCase(repository);

  await createUser.execute({
    name: "Ana",
    email: "ana@example.com",
    password: "secret123",
  });

  await assert.rejects(
    () =>
      createUser.execute({
        name: "Outra",
        email: "ana@example.com",
        password: "secret456",
      }),
    ConflictError
  );
});

test("get, update and delete a user", async () => {
  const repository = new InMemoryUserRepository();
  const createUser = new CreateUserUseCase(repository);
  const getUser = new GetUserUseCase(repository);
  const updateUser = new UpdateUserUseCase(repository);
  const deleteUser = new DeleteUserUseCase(repository);

  const created = await createUser.execute({
    name: "Bruno",
    email: "bruno@example.com",
    password: "secret123",
  });

  const fetched = await getUser.execute(created.id);
  assert.equal(fetched.name, "Bruno");

  const updated = await updateUser.execute(created.id, { name: "Bruno Editado" });
  assert.equal(updated.name, "Bruno Editado");

  await deleteUser.execute(created.id);

  await assert.rejects(() => getUser.execute(created.id), NotFoundError);
});

test("reject update email when another user already uses it", async () => {
  const repository = new InMemoryUserRepository();
  const createUser = new CreateUserUseCase(repository);
  const updateUser = new UpdateUserUseCase(repository);

  const firstUser = await createUser.execute({
    name: "Rafa",
    email: "rafa@example.com",
    password: "secret123",
  });

  await createUser.execute({
    name: "Lia",
    email: "lia@example.com",
    password: "secret123",
  });

  await assert.rejects(
    () => updateUser.execute(firstUser.id, { email: "lia@example.com" }),
    ConflictError
  );
});

test("normalize email and still reject duplicates", async () => {
  const repository = new InMemoryUserRepository();
  const createUser = new CreateUserUseCase(repository);

  const created = await createUser.execute({
    name: "Nina",
    email: "NINA@Example.Com ",
    password: "secret123",
  });

  assert.equal(created.email, "nina@example.com");

  await assert.rejects(
    () =>
      createUser.execute({
        name: "Nina 2",
        email: "nina@example.com",
        password: "secret123",
      }),
    ConflictError
  );
});

test("reject invalid email and invalid name from domain rules", async () => {
  const repository = new InMemoryUserRepository();
  const createUser = new CreateUserUseCase(repository);

  await assert.rejects(
    () =>
      createUser.execute({
        name: "Ana",
        email: "invalido",
        password: "secret123",
      }),
    (error: unknown) => error instanceof AppError && error.statusCode === 422
  );

  await assert.rejects(
    () =>
      createUser.execute({
        name: "A",
        email: "ana2@example.com",
        password: "secret123",
      }),
    (error: unknown) => error instanceof AppError && error.statusCode === 422
  );
});
