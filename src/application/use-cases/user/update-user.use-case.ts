import type { UpdateUserInputDto, UserResponseDto } from "@/application/dtos/user.dto.js";
import type { UserRepositoryPort } from "@/domain/ports/user-repository.port.js";
import { User } from "@/domain/entities/user.entity.js";
import { Email } from "@/domain/value-objects/email.value-object.js";
import { UserName } from "@/domain/value-objects/user-name.value-object.js";
import { ConflictError, NotFoundError } from "@/shared/errors/app-error.js";

export interface IUpdateUserUseCase {
  execute(id: string, input: UpdateUserInputDto): Promise<UserResponseDto>;
}

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string, input: UpdateUserInputDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("User");
    }

    const nextEmail = input.email ? Email.create(input.email) : existing.email;

    if (nextEmail.value !== existing.email.value) {
      const userWithSameEmail = await this.userRepository.findByEmail(nextEmail.value);
      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new ConflictError("User already exists");
      }
    }

    const updated = new User(
      existing.id,
      input.name ? UserName.create(input.name) : existing.name,
      nextEmail,
      existing.passwordHash,
      existing.createdAt
    );

    const stored = await this.userRepository.update(updated);
    return {
      id: stored.id,
      name: stored.name.value,
      email: stored.email.value,
      createdAt: stored.createdAt,
    };
  }
}
