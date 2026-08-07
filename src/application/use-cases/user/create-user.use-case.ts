import { randomUUID } from "node:crypto";
import type { CreateUserInputDto, UserResponseDto } from "@/application/dtos/user.dto.js";
import { User } from "@/domain/entities/user.entity.js";
import type { UserRepositoryPort } from "@/domain/ports/user-repository.port.js";
import { Email } from "@/domain/value-objects/email.value-object.js";
import { UserName } from "@/domain/value-objects/user-name.value-object.js";
import { ConflictError } from "@/shared/errors/app-error.js";
import { hashPassword } from "@/shared/security/password.js";

export interface ICreateUserUseCase {
  execute(input: CreateUserInputDto): Promise<UserResponseDto>;
}

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(input: CreateUserInputDto): Promise<UserResponseDto> {
    const email = Email.create(input.email);
    const existing = await this.userRepository.findByEmail(email.value);
    if (existing) {
      throw new ConflictError("User already exists");
    }

    const user = new User(
      randomUUID(),
      UserName.create(input.name),
      email,
      hashPassword(input.password),
      new Date()
    );
    const created = await this.userRepository.create(user);

    return {
      id: created.id,
      name: created.name.value,
      email: created.email.value,
      createdAt: created.createdAt,
    };
  }
}
