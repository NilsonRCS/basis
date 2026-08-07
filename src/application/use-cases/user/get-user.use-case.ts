import type { UserResponseDto } from "@/application/dtos/user.dto.js";
import type { UserRepositoryPort } from "@/domain/ports/user-repository.port.js";
import { NotFoundError } from "@/shared/errors/app-error.js";

export interface IGetUserUseCase {
  execute(id: string): Promise<UserResponseDto>;
}

export class GetUserUseCase implements IGetUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User");
    }

    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      createdAt: user.createdAt,
    };
  }
}
