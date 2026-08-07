import type { UserResponseDto } from "@/application/dtos/user.dto.js";
import type { TokenServicePort } from "@/application/ports/token-service.port.js";
import type { UserRepositoryPort } from "@/domain/ports/user-repository.port.js";
import { AppError } from "@/shared/errors/app-error.js";

export interface IGetCurrentUserUseCase {
  execute(authorizationHeader: string | undefined): Promise<UserResponseDto>;
}

export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly tokenService: TokenServicePort
  ) {}

  async execute(authorizationHeader: string | undefined): Promise<UserResponseDto> {
    if (!authorizationHeader?.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", 401);
    }

    const token = authorizationHeader.slice("Bearer ".length).trim();
    const payload = this.tokenService.verify(token);

    if (!payload) {
      throw new AppError("Unauthorized", 401);
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      createdAt: user.createdAt,
    };
  }
}
