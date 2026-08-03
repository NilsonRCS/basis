import type { CreateUserInputDto, UserResponseDto } from "@/application/dtos/user.dto.js";

export interface ICreateUserUseCase {
  execute(input: CreateUserInputDto): Promise<UserResponseDto>;
}
