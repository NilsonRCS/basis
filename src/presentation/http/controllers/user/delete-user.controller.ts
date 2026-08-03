import type { FastifyRequest, FastifyReply } from "fastify";
import { userIdParamSchema } from "@/presentation/http/schemas/user.schemas.js";
import type { IDeleteUserUseCase } from "@/application/use-cases/user/delete-user.use-case.js";

export class DeleteUserController {
  constructor(private readonly useCase: IDeleteUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = userIdParamSchema.parse(request.params);
    await this.useCase.execute(id);
    await reply.status(204).send();
  }
}
