import type { ListUsersInputDto, ListUsersOutputDto } from "@/application/dtos/user.dto.js";

export interface IListUsersUseCase {
  execute(input: ListUsersInputDto): Promise<ListUsersOutputDto>;
}
