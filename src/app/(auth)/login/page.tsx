import { AuthFormCard } from "@/components/app/auth-form-card";
import { redirectAuthenticatedUser } from "@/lib/auth/session";

export default async function LoginPage() {
  await redirectAuthenticatedUser();
  return <AuthFormCard variant="login" />;
}
