import { CreateUserUseCase } from "@/application/use-cases/user/create-user.use-case.js";
import { GetUserUseCase } from "@/application/use-cases/user/get-user.use-case.js";
import { ListUsersUseCase } from "@/application/use-cases/user/list-users.use-case.js";
import { UpdateUserUseCase } from "@/application/use-cases/user/update-user.use-case.js";
import { DeleteUserUseCase } from "@/application/use-cases/user/delete-user.use-case.js";
import { CreateUserController } from "@/presentation/http/controllers/user/create-user.controller.js";
import { ListUsersController } from "@/presentation/http/controllers/user/list-users.controller.js";
import { GetUserController } from "@/presentation/http/controllers/user/get-user.controller.js";
import { UpdateUserController } from "@/presentation/http/controllers/user/update-user.controller.js";
import { DeleteUserController } from "@/presentation/http/controllers/user/delete-user.controller.js";
import { InMemoryUserRepository } from "@/infrastructure/repositories/in-memory-user.repository.js";

export function makeUserControllers() {
  const userRepository = new InMemoryUserRepository();

  return {
    createUser: new CreateUserController(new CreateUserUseCase(userRepository)),
    listUsers: new ListUsersController(new ListUsersUseCase(userRepository)),
    getUser: new GetUserController(new GetUserUseCase(userRepository)),
    updateUser: new UpdateUserController(new UpdateUserUseCase(userRepository)),
    deleteUser: new DeleteUserController(new DeleteUserUseCase(userRepository)),
  };
}
