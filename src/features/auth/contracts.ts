export interface AuthFormState {
  status: "idle" | "success" | "error";
  message?: string;
  redirectTo?: string;
}

export const defaultAuthState: AuthFormState = {
  status: "idle",
};
