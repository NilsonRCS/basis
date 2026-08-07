export interface LoginInputDto {
  email: string;
  password: string;
}

export interface LoginOutputDto {
  accessToken: string;
}
