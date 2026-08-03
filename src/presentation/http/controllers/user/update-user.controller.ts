import type { FastifyRequest, FastifyReply } from "fastify";
import {
  userIdParamSchema,
  updateUserSchema,
} from "@/presentation/http/schemas/user.schemas.js";
import type { IUpdateUserUseCase } from "@/application/use-cases/user/update-user.use-case.js";

export class UpdateUserController {
  constructor(private readonly useCase: IUpdateUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = userIdParamSchema.parse(request.params);
    const body = updateUserSchema.parse(request.body);
    const result = await this.useCase.execute(id, body);
    await reply.send(result);
  }
}
