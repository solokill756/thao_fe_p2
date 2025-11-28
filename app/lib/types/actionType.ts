export interface loginState {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
}

export interface registerState {
  errors?: {
    fullName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    server_error?: string[];
  };
  message?: string;
}
