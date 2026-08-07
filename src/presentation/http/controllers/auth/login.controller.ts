import type { FastifyReply, FastifyRequest } from "fastify";
import type { ILoginUseCase } from "@/application/use-cases/auth/login.use-case.js";
import { loginSchema } from "@/presentation/http/schemas/auth.schemas.js";

export class LoginController {
  constructor(private readonly loginUseCase: ILoginUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = loginSchema.parse(request.body);
    const result = await this.loginUseCase.execute(body);
    await reply.status(200).send(result);
  }
}
