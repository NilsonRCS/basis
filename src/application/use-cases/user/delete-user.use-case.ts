import type { UserRepositoryPort } from "@/domain/ports/user-repository.port.js";
import { NotFoundError } from "@/shared/errors/app-error.js";

export interface IDeleteUserUseCase {
  execute(id: string): Promise<void>;
}

export class DeleteUserUseCase implements IDeleteUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("User");
    }

    await this.userRepository.delete(id);
  }
}
