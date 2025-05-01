export interface RegisterRequest {
  username: string;
  password: string;
  image: File;
}

export interface LoginRequest {
  username: string;
  password: string;
}
