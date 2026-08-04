import type { ListUsersInputDto, ListUsersOutputDto } from "@/application/dtos/user.dto.js";
import type { UserRepositoryPort } from "@/domain/ports/user-repository.port.js";

export interface IListUsersUseCase {
  execute(input: ListUsersInputDto): Promise<ListUsersOutputDto>;
}

export class ListUsersUseCase implements IListUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(input: ListUsersInputDto): Promise<ListUsersOutputDto> {
    const result = await this.userRepository.findAll(input.page, input.limit);
    return {
      users: result.users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })),
      total: result.total,
      page: input.page,
      limit: input.limit,
    };
  }
}
