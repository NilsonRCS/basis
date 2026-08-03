import type { UpdateUserInputDto, UserResponseDto } from "@/application/dtos/user.dto.js";

export interface IUpdateUserUseCase {
  execute(id: string, input: UpdateUserInputDto): Promise<UserResponseDto>;
}
