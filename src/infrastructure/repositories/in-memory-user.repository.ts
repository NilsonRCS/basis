import { User } from "../../domain/entities/user.entity.js";
import type { UserRepositoryPort } from "../../domain/ports/user-repository.port.js";

export class InMemoryUserRepository implements UserRepositoryPort {
  private users: User[] = [];

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async findAll(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const start = (page - 1) * limit;
    const paginated = this.users.slice(start, start + limit);
    return { users: paginated, total: this.users.length };
  }

  async update(user: User): Promise<User> {
    this.users = this.users.map((current) => (current.id === user.id ? user : current));
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email.value === email) ?? null;
  }
}
