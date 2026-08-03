import type { UserResponseDto } from "@/application/dtos/user.dto.js";

export interface IGetUserUseCase {
  execute(id: string): Promise<UserResponseDto>;
}
