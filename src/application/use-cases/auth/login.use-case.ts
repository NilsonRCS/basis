import type { LoginInputDto, LoginOutputDto } from "@/application/dtos/auth.dto.js";
import type { TokenServicePort } from "@/application/ports/token-service.port.js";
import type { UserRepositoryPort } from "@/domain/ports/user-repository.port.js";
import { AppError } from "@/shared/errors/app-error.js";
import { verifyPassword } from "@/shared/security/password.js";

export interface ILoginUseCase {
  execute(input: LoginInputDto): Promise<LoginOutputDto>;
}

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly tokenService: TokenServicePort
  ) {}

  async execute(input: LoginInputDto): Promise<LoginOutputDto> {
    const user = await this.userRepository.findByEmail(input.email.trim().toLowerCase());

    if (!user || !verifyPassword(input.password, user.passwordHash)) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = this.tokenService.sign({
      sub: user.id,
      email: user.email.value,
    });

    return { accessToken };
  }
}
