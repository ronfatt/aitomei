import { DemoAccessCard } from "@/components/app/demo-access-card";
import { redirectAuthenticatedUser } from "@/lib/auth/session";

export default async function SignupPage() {
  await redirectAuthenticatedUser();
  return <DemoAccessCard variant="signup" />;
}
