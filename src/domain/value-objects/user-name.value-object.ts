import { AppError } from "@/shared/errors/app-error.js";

export class UserName {
  private constructor(private readonly nameValue: string) {}

  static create(value: string): UserName {
    const normalized = value.trim();

    if (normalized.length < 2 || normalized.length > 100) {
      throw new AppError("Invalid user name", 422);
    }

    return new UserName(normalized);
  }

  get value(): string {
    return this.nameValue;
  }
}
