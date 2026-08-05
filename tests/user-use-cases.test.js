"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const create_user_use_case_js_1 = require("../src/application/use-cases/user/create-user.use-case.js");
const delete_user_use_case_js_1 = require("../src/application/use-cases/user/delete-user.use-case.js");
const get_user_use_case_js_1 = require("../src/application/use-cases/user/get-user.use-case.js");
const list_users_use_case_js_1 = require("../src/application/use-cases/user/list-users.use-case.js");
const update_user_use_case_js_1 = require("../src/application/use-cases/user/update-user.use-case.js");
const in_memory_user_repository_js_1 = require("../src/infrastructure/repositories/in-memory-user.repository.js");
(0, node_test_1.default)("create and list users", async () => {
    const repository = new in_memory_user_repository_js_1.InMemoryUserRepository();
    const createUser = new create_user_use_case_js_1.CreateUserUseCase(repository);
    const listUsers = new list_users_use_case_js_1.ListUsersUseCase(repository);
    const created = await createUser.execute({
        name: "Ana",
        email: "ana@example.com",
        password: "secret123",
    });
    strict_1.default.equal(created.email, "ana@example.com");
    const result = await listUsers.execute({ page: 1, limit: 10 });
    strict_1.default.equal(result.total, 1);
    strict_1.default.equal(result.users[0].id, created.id);
});
(0, node_test_1.default)("reject duplicate email", async () => {
    const repository = new in_memory_user_repository_js_1.InMemoryUserRepository();
    const createUser = new create_user_use_case_js_1.CreateUserUseCase(repository);
    await createUser.execute({
        name: "Ana",
        email: "ana@example.com",
        password: "secret123",
    });
    await strict_1.default.rejects(() => createUser.execute({
        name: "Outra",
        email: "ana@example.com",
        password: "secret456",
    }), /User already exists/);
});
(0, node_test_1.default)("get, update and delete a user", async () => {
    const repository = new in_memory_user_repository_js_1.InMemoryUserRepository();
    const createUser = new create_user_use_case_js_1.CreateUserUseCase(repository);
    const getUser = new get_user_use_case_js_1.GetUserUseCase(repository);
    const updateUser = new update_user_use_case_js_1.UpdateUserUseCase(repository);
    const deleteUser = new delete_user_use_case_js_1.DeleteUserUseCase(repository);
    const created = await createUser.execute({
        name: "Bruno",
        email: "bruno@example.com",
        password: "secret123",
    });
    const fetched = await getUser.execute(created.id);
    strict_1.default.equal(fetched.name, "Bruno");
    const updated = await updateUser.execute(created.id, { name: "Bruno Editado" });
    strict_1.default.equal(updated.name, "Bruno Editado");
    await deleteUser.execute(created.id);
    await strict_1.default.rejects(() => getUser.execute(created.id), /User not found/);
});
