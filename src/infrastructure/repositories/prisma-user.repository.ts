import type { PrismaClient } from "@prisma/client";
import type { UserRepositoryPort } from "@/domain/ports/user-repository.port.js";
import type { User } from "@/domain/entities/user.entity.js";
import { PrismaUserMapper } from "@/infrastructure/database/prisma/mappers/prisma-user.mapper.js";

export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name.value,
        email: user.email.value,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
      },
    });

    return PrismaUserMapper.toDomain(created);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findAll(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: users.map(PrismaUserMapper.toDomain),
      total,
    };
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name.value,
        email: user.email.value,
      },
    });

    return PrismaUserMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }
}
