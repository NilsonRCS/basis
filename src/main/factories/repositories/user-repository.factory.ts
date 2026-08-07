import type { UserRepositoryPort } from "@/domain/ports/user-repository.port.js";
import { InMemoryUserRepository } from "@/infrastructure/repositories/in-memory-user.repository.js";
import { PrismaUserRepository } from "@/infrastructure/repositories/prisma-user.repository.js";
import { prismaClient } from "@/infrastructure/database/prisma/client.js";

export function makeUserRepository(): UserRepositoryPort {
  if (process.env.USER_REPOSITORY === "prisma") {
    return new PrismaUserRepository(prismaClient);
  }

  return new InMemoryUserRepository();
}
