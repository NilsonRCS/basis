import assert from "node:assert/strict";
import test from "node:test";
import { CreateUserUseCase } from "../src/application/use-cases/user/create-user.use-case.js";
import { DeleteUserUseCase } from "../src/application/use-cases/user/delete-user.use-case.js";
import { GetUserUseCase } from "../src/application/use-cases/user/get-user.use-case.js";
import { ListUsersUseCase } from "../src/application/use-cases/user/list-users.use-case.js";
import { UpdateUserUseCase } from "../src/application/use-cases/user/update-user.use-case.js";
import { InMemoryUserRepository } from "../src/infrastructure/repositories/in-memory-user.repository.js";

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
    /User already exists/
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

  await assert.rejects(() => getUser.execute(created.id), /User not found/);
});
