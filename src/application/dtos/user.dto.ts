export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CreateUserInputDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInputDto {
  name?: string;
  email?: string;
}

export interface ListUsersInputDto {
  page: number;
  limit: number;
}

export interface ListUsersOutputDto {
  users: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
}
