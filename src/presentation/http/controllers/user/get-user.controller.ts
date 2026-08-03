import type { FastifyRequest, FastifyReply } from "fastify";
import { userIdParamSchema } from "@/presentation/http/schemas/user.schemas.js";
import type { IGetUserUseCase } from "@/application/use-cases/user/get-user.use-case.js";

export class GetUserController {
  constructor(private readonly useCase: IGetUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = userIdParamSchema.parse(request.params);
    const result = await this.useCase.execute(id);
    await reply.send(result);
  }
}
