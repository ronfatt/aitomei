import { DemoAccessCard } from "@/components/app/demo-access-card";
import { redirectAuthenticatedUser } from "@/lib/auth/session";

export default async function ForgotPasswordPage() {
  await redirectAuthenticatedUser();
  return <DemoAccessCard variant="forgot" />;
}
