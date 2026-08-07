import { sign, verify, type JwtPayload, type SignOptions } from "jsonwebtoken";
import type { TokenPayload, TokenServicePort } from "@/application/ports/token-service.port.js";

export class JwtTokenService implements TokenServicePort {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: SignOptions["expiresIn"] = "1h"
  ) {}

  sign(payload: TokenPayload): string {
    return sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token: string): TokenPayload | null {
    try {
      const decoded = verify(token, this.secret);
      if (typeof decoded === "string") {
        return null;
      }

      const payload = decoded as JwtPayload;
      if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
        return null;
      }

      return {
        sub: payload.sub,
        email: payload.email,
      };
    } catch {
      return null;
    }
  }
}
