import { AppError } from "@/shared/errors/app-error.js";

const EMAIL_REGEX = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

export class Email {
  private constructor(private readonly emailValue: string) {}

  static create(value: string): Email {
    const normalized = value.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalized)) {
      throw new AppError("Invalid email address", 422);
    }

    return new Email(normalized);
  }

  get value(): string {
    return this.emailValue;
  }
}
