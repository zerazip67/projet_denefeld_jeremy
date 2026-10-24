export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: number;
  name: string;
  email: string;
}
