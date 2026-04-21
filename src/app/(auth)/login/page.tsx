import { DemoAccessCard } from "@/components/app/demo-access-card";
import { redirectAuthenticatedUser } from "@/lib/auth/session";

export default async function LoginPage() {
  await redirectAuthenticatedUser();
  return <DemoAccessCard variant="login" />;
}
