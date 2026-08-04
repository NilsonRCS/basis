import { randomUUID } from "node:crypto";
import type { CreateUserInputDto, UserResponseDto } from "@/application/dtos/user.dto.js";
import { User } from "@/domain/entities/user.entity.js";
import type { UserRepositoryPort } from "@/domain/ports/user-repository.port.js";

export interface ICreateUserUseCase {
  execute(input: CreateUserInputDto): Promise<UserResponseDto>;
}

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(input: CreateUserInputDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error("User already exists");
    }

    const user = new User(randomUUID(), input.name, input.email, input.password, new Date());
    const created = await this.userRepository.create(user);

    return {
      id: created.id,
      name: created.name,
      email: created.email,
      createdAt: created.createdAt,
    };
  }
}
