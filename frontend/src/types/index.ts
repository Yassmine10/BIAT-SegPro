export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'Administrator' | 'Retail Banking Analyst';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: 'Administrator' | 'Retail Banking Analyst';
  user: User;
}

export interface ApiError {
  detail: string | { msg: string; loc: (string | number)[]; type: string }[];
}
