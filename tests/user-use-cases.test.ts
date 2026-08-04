import assert from "node:assert/strict";
import test from "node:test";
import { CreateUserUseCase } from "../src/application/use-cases/user/create-user.use-case.js";
import { ListUsersUseCase } from "../src/application/use-cases/user/list-users.use-case.js";
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
