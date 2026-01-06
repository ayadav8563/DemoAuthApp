// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'SIGNUP_REQUEST' }
  | { type: 'SIGNUP_SUCCESS'; payload: User }
  | { type: 'SIGNUP_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

export interface Credentials {
  email: string;
  password: string;
}

export interface SignupData extends Credentials {
  name: string;
  confirmPassword?: string;
}

// ✅ ADD THIS: AuthContextType definition
export interface AuthContextType extends AuthState {
  login: (credentials: Credentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type InputType = 'text' | 'email' | 'password' | 'number';