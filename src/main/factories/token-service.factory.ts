import type { SignOptions } from "jsonwebtoken";
import type { TokenServicePort } from "@/application/ports/token-service.port.js";
import { JwtTokenService } from "@/infrastructure/security/jwt-token.service.js";

export function makeTokenService(): TokenServicePort {
  const secret = process.env.JWT_SECRET ?? "dev-secret-change-me";
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "1h") as SignOptions["expiresIn"];
  return new JwtTokenService(secret, expiresIn);
}
