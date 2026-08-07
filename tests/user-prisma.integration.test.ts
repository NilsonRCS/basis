import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { after, before, test } from "node:test";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;

before(async () => {
  process.env.USER_REPOSITORY = "prisma";
  process.env.DATABASE_URL = "file:./prisma/test.db";

  execSync("npx prisma db push --skip-generate", {
    stdio: "pipe",
    env: process.env,
  });

  const { prismaClient } = await import("../src/infrastructure/database/prisma/client.js");
  await prismaClient.user.deleteMany();

  const { buildApp } = await import("../src/main/app.js");
  app = buildApp();
  await app.ready();
});

after(async () => {
  const { prismaClient } = await import("../src/infrastructure/database/prisma/client.js");
  await prismaClient.user.deleteMany();
  await app.close();
  await prismaClient.$disconnect();
});

test("create and list users through HTTP using Prisma repository", async () => {
  const createResponse = await app.inject({
    method: "POST",
    url: "/api/users",
    payload: {
      name: "Integration Prisma",
      email: "integration.prisma@example.com",
      password: "secret123",
    },
  });

  assert.equal(createResponse.statusCode, 201);
  const created = createResponse.json();
  assert.equal(created.email, "integration.prisma@example.com");

  const listResponse = await app.inject({
    method: "GET",
    url: "/api/users?page=1&limit=10",
  });

  assert.equal(listResponse.statusCode, 200);
  const list = listResponse.json();

  assert.equal(list.total, 1);
  assert.equal(list.users.length, 1);
  assert.equal(list.users[0].id, created.id);
});
