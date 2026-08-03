import type { ICreateUserUseCase } from "@/application/use-cases/user/create-user.use-case.js";
import type { IGetUserUseCase } from "@/application/use-cases/user/get-user.use-case.js";
import type { IListUsersUseCase } from "@/application/use-cases/user/list-users.use-case.js";
import type { IUpdateUserUseCase } from "@/application/use-cases/user/update-user.use-case.js";
import type { IDeleteUserUseCase } from "@/application/use-cases/user/delete-user.use-case.js";
import type {
  CreateUserInputDto,
  ListUsersInputDto,
  UpdateUserInputDto,
  UserResponseDto,
} from "@/application/dtos/user.dto.js";
import { CreateUserController } from "@/presentation/http/controllers/user/create-user.controller.js";
import { ListUsersController } from "@/presentation/http/controllers/user/list-users.controller.js";
import { GetUserController } from "@/presentation/http/controllers/user/get-user.controller.js";
import { UpdateUserController } from "@/presentation/http/controllers/user/update-user.controller.js";
import { DeleteUserController } from "@/presentation/http/controllers/user/delete-user.controller.js";

// TODO: substituir stubs pelas implementações reais no Application layer
class CreateUserStub implements ICreateUserUseCase {
  async execute(input: CreateUserInputDto): Promise<UserResponseDto> {
    return { id: crypto.randomUUID(), name: input.name, email: input.email, createdAt: new Date() };
  }
}

class GetUserStub implements IGetUserUseCase {
  async execute(id: string): Promise<UserResponseDto> {
    return { id, name: "Stub User", email: "stub@example.com", createdAt: new Date() };
  }
}

class ListUsersStub implements IListUsersUseCase {
  async execute(input: ListUsersInputDto) {
    return { users: [], total: 0, page: input.page, limit: input.limit };
  }
}

class UpdateUserStub implements IUpdateUserUseCase {
  async execute(id: string, input: UpdateUserInputDto): Promise<UserResponseDto> {
    return { id, name: input.name ?? "Stub User", email: input.email ?? "stub@example.com", createdAt: new Date() };
  }
}

class DeleteUserStub implements IDeleteUserUseCase {
  async execute(_id: string): Promise<void> {}
}

export function makeUserControllers() {
  return {
    createUser: new CreateUserController(new CreateUserStub()),
    listUsers: new ListUsersController(new ListUsersStub()),
    getUser: new GetUserController(new GetUserStub()),
    updateUser: new UpdateUserController(new UpdateUserStub()),
    deleteUser: new DeleteUserController(new DeleteUserStub()),
  };
}
