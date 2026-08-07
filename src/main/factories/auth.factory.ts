import { LoginUseCase } from "@/application/use-cases/auth/login.use-case.js";
import { GetCurrentUserUseCase } from "@/application/use-cases/auth/me.use-case.js";
import { LoginController } from "@/presentation/http/controllers/auth/login.controller.js";
import { MeController } from "@/presentation/http/controllers/auth/me.controller.js";
import { makeUserRepository } from "@/main/factories/repositories/user-repository.factory.js";
import { makeTokenService } from "@/main/factories/token-service.factory.js";

export function makeAuthControllers() {
  const userRepository = makeUserRepository();
  const tokenService = makeTokenService();

  return {
    login: new LoginController(new LoginUseCase(userRepository, tokenService)),
    me: new MeController(new GetCurrentUserUseCase(userRepository, tokenService)),
  };
}
