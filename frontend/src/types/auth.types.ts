import { User } from "./user.types";

export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface RegisterFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (data: LoginFormInputs) => Promise<void>;
  logout: () => void;
  register: (data: RegisterFormInputs) => Promise<void>;
  isLoading: boolean;
}
