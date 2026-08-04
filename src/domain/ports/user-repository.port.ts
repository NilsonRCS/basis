import type { User } from "../entities/user.entity.js";

export interface UserRepositoryPort {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(page: number, limit: number): Promise<{ users: User[]; total: number }>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}
