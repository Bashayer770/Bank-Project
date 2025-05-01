export interface RegisterRequest {
  username: string;
  password: string;
  image?: File | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}
