import type { UpdateUserInputDto, UserResponseDto } from "@/application/dtos/user.dto.js";
import type { UserRepositoryPort } from "@/domain/ports/user-repository.port.js";
import { User } from "@/domain/entities/user.entity.js";

export interface IUpdateUserUseCase {
  execute(id: string, input: UpdateUserInputDto): Promise<UserResponseDto>;
}

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string, input: UpdateUserInputDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new Error("User not found");
    }

    const updated = new User(
      existing.id,
      input.name ?? existing.name,
      input.email ?? existing.email,
      existing.passwordHash,
      existing.createdAt
    );

    const stored = await this.userRepository.update(updated);
    return {
      id: stored.id,
      name: stored.name,
      email: stored.email,
      createdAt: stored.createdAt,
    };
  }
}
