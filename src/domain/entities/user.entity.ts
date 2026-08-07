import { Email } from "@/domain/value-objects/email.value-object.js";
import { UserName } from "@/domain/value-objects/user-name.value-object.js";

export class User {
  constructor(
    public readonly id: string,
    public readonly name: UserName,
    public readonly email: Email,
    public readonly passwordHash: string,
    public readonly createdAt: Date
  ) {}
}
