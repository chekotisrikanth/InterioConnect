export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
    createdAt: string;
  } | null;
  session: any | null;
}

export interface AuthError {
  message: string;
  status: number;
}