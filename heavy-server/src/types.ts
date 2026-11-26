export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
}

export interface Session {
  userId: number;
  token: string;
}

export interface HttpError {
  status: number;
  message: string;
}
