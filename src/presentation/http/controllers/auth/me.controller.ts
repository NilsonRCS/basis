import type { FastifyReply, FastifyRequest } from "fastify";
import type { IGetCurrentUserUseCase } from "@/application/use-cases/auth/me.use-case.js";

export class MeController {
  constructor(private readonly getCurrentUserUseCase: IGetCurrentUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const authorization = request.headers.authorization;
    const result = await this.getCurrentUserUseCase.execute(authorization);
    await reply.status(200).send(result);
  }
}
