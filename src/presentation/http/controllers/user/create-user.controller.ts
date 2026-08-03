import type { FastifyRequest, FastifyReply } from "fastify";
import { createUserSchema } from "@/presentation/http/schemas/user.schemas.js";
import type { ICreateUserUseCase } from "@/application/use-cases/user/create-user.use-case.js";

export class CreateUserController {
  constructor(private readonly useCase: ICreateUserUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = createUserSchema.parse(request.body);
    const result = await this.useCase.execute(body);
    await reply.status(201).send(result);
  }
}
