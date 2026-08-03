import type { FastifyRequest, FastifyReply } from "fastify";
import { listUsersQuerySchema } from "@/presentation/http/schemas/user.schemas.js";
import type { IListUsersUseCase } from "@/application/use-cases/user/list-users.use-case.js";

export class ListUsersController {
  constructor(private readonly useCase: IListUsersUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const query = listUsersQuerySchema.parse(request.query);
    const result = await this.useCase.execute(query);
    await reply.send(result);
  }
}
