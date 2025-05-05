export interface User {
  _id: string;
  username: string;
  image: File | null;
  balance: number;
  background?: string;
}
