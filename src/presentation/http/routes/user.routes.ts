import type { FastifyInstance } from "fastify";
import type { CreateUserController } from "@/presentation/http/controllers/user/create-user.controller.js";
import type { ListUsersController } from "@/presentation/http/controllers/user/list-users.controller.js";
import type { GetUserController } from "@/presentation/http/controllers/user/get-user.controller.js";
import type { UpdateUserController } from "@/presentation/http/controllers/user/update-user.controller.js";
import type { DeleteUserController } from "@/presentation/http/controllers/user/delete-user.controller.js";

interface UserControllers {
  createUser: CreateUserController;
  listUsers: ListUsersController;
  getUser: GetUserController;
  updateUser: UpdateUserController;
  deleteUser: DeleteUserController;
}

export function userRoutes(controllers: UserControllers) {
  return async (app: FastifyInstance) => {
    app.post("/users", (req, reply) => controllers.createUser.handle(req, reply));
    app.get("/users", (req, reply) => controllers.listUsers.handle(req, reply));
    app.get("/users/:id", (req, reply) => controllers.getUser.handle(req, reply));
    app.patch("/users/:id", (req, reply) => controllers.updateUser.handle(req, reply));
    app.delete("/users/:id", (req, reply) => controllers.deleteUser.handle(req, reply));
  };
}
