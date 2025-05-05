export interface User {
  id: number;
  username: string;
  image: File | null;
  balance: number;
  background?: string;
}
