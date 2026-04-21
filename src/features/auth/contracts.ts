export interface AuthFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export const defaultAuthState: AuthFormState = {
  status: "idle",
};
