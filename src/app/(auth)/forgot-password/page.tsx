import { AuthFormCard } from "@/components/app/auth-form-card";
import { redirectAuthenticatedUser } from "@/lib/auth/session";

export default async function ForgotPasswordPage() {
  await redirectAuthenticatedUser();
  return <AuthFormCard variant="forgot" />;
}
