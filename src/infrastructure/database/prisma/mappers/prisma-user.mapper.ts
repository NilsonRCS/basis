import type { User as PrismaUser } from "@prisma/client";
import { User } from "@/domain/entities/user.entity.js";
import { Email } from "@/domain/value-objects/email.value-object.js";
import { UserName } from "@/domain/value-objects/user-name.value-object.js";

export class PrismaUserMapper {
  static toDomain(user: PrismaUser): User {
    return new User(
      user.id,
      UserName.create(user.name),
      Email.create(user.email),
      user.passwordHash,
      user.createdAt
    );
  }
}
