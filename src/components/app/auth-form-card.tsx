"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BrandMark } from "@/components/layout/brand-mark";
import {
  requestPasswordResetAction,
  signInWithPasswordAction,
  signUpWithPasswordAction,
  updatePasswordAction,
} from "@/features/auth/actions";
import {
  forgotPasswordSchema,
  loginSchema,
  signupSchema,
  updatePasswordSchema,
  type ForgotPasswordFormValues,
  type LoginFormValues,
  type SignupFormValues,
  type UpdatePasswordFormValues,
} from "@/features/auth/schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const authCopy = {
  login: {
    eyebrow: "Welcome back",
    title: "Sign in to continue your growth journey",
    description:
      "Access your missions, AI support tools, campaign updates, and premium member content workspace.",
    cta: "Sign in",
    helper: "New to the platform?",
    helperHref: "/signup",
    helperLabel: "Create an account",
  },
  signup: {
    eyebrow: "Member onboarding",
    title: "Create your TOMEI member workspace",
    description:
      "Set up your account, complete onboarding, and start generating branded content with confidence.",
    cta: "Create account",
    helper: "Already registered?",
    helperHref: "/login",
    helperLabel: "Sign in",
  },
  forgot: {
    eyebrow: "Recovery",
    title: "Reset your password securely",
    description:
      "Enter your email address and Supabase Auth will send a secure recovery link to continue.",
    cta: "Send reset link",
    helper: "Remembered your password?",
    helperHref: "/login",
    helperLabel: "Back to login",
  },
  updatePassword: {
    eyebrow: "Account recovery",
    title: "Create a new secure password",
    description:
      "Open this page from your recovery email and set a fresh password for your member workspace.",
    cta: "Update password",
    helper: "Back to sign in",
    helperHref: "/login",
    helperLabel: "Return to login",
  },
} as const;

const schemas = {
  login: loginSchema,
  signup: signupSchema,
  forgot: forgotPasswordSchema,
  updatePassword: updatePasswordSchema,
} as const;

export function AuthFormCard({ variant }: { variant: keyof typeof authCopy }) {
  const copy = authCopy[variant];
  const router = useRouter();
  const [feedback, setFeedback] = useState<{
    status: "idle" | "success" | "error";
    message?: string;
  }>({ status: "idle" });
  const schema = schemas[variant];

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      variant === "signup"
        ? {
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: "",
            password: "",
            preferredLanguage: "English",
          }
        : variant === "login"
          ? {
              email: "",
              password: "",
            }
          : variant === "forgot"
            ? {
                email: "",
              }
            : {
                password: "",
                confirmPassword: "",
              },
  });

  async function onSubmit(values: unknown) {
    setFeedback({ status: "idle" });

    startTransition(async () => {
      const result =
        variant === "login"
          ? await signInWithPasswordAction(values as LoginFormValues)
          : variant === "signup"
            ? await signUpWithPasswordAction(values as SignupFormValues)
            : variant === "forgot"
              ? await requestPasswordResetAction(values as ForgotPasswordFormValues)
              : await updatePasswordAction(values as UpdatePasswordFormValues);

      setFeedback({
        status: result.status,
        message: result.message,
      });

      if (result.status === "success" && result.redirectTo) {
        router.push(result.redirectTo);
        router.refresh();
      }
    });
  }

  return (
    <Card className="w-full max-w-xl p-8 lg:p-10">
      <BrandMark />
      <div className="mt-8 space-y-3">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl leading-none text-[var(--foreground)]">
          {copy.title}
        </h1>
        <p className="max-w-lg text-sm leading-7 text-[var(--muted)]">{copy.description}</p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {variant === "signup" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Input placeholder="First name" {...form.register("firstName")} />
              <p className="mt-2 text-xs text-[var(--warning)]">
                {form.formState.errors.firstName?.message as string | undefined}
              </p>
            </div>
            <div>
              <Input placeholder="Last name" {...form.register("lastName")} />
              <p className="mt-2 text-xs text-[var(--warning)]">
                {form.formState.errors.lastName?.message as string | undefined}
              </p>
            </div>
          </div>
        ) : null}

        {variant !== "updatePassword" ? (
          <div>
            <Input type="email" placeholder="Email address" {...form.register("email")} />
            <p className="mt-2 text-xs text-[var(--warning)]">
              {form.formState.errors.email?.message as string | undefined}
            </p>
          </div>
        ) : null}

        {variant === "signup" ? (
          <div>
            <Input placeholder="Mobile number" {...form.register("mobileNumber")} />
            <p className="mt-2 text-xs text-[var(--warning)]">
              {form.formState.errors.mobileNumber?.message as string | undefined}
            </p>
          </div>
        ) : null}

        {variant !== "forgot" ? (
          <div>
            <Input
              type="password"
              placeholder={variant === "updatePassword" ? "New password" : "Password"}
              {...form.register("password")}
            />
            <p className="mt-2 text-xs text-[var(--warning)]">
              {form.formState.errors.password?.message as string | undefined}
            </p>
          </div>
        ) : null}

        {variant === "updatePassword" ? (
          <div>
            <Input
              type="password"
              placeholder="Confirm new password"
              {...form.register("confirmPassword")}
            />
            <p className="mt-2 text-xs text-[var(--warning)]">
              {form.formState.errors.confirmPassword?.message as string | undefined}
            </p>
          </div>
        ) : null}

        {variant === "signup" ? (
          <div>
            <Input
              placeholder="Preferred language (English first)"
              {...form.register("preferredLanguage")}
            />
            <p className="mt-2 text-xs text-[var(--warning)]">
              {form.formState.errors.preferredLanguage?.message as string | undefined}
            </p>
          </div>
        ) : null}

        <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
          {copy.cta}
        </Button>

        {feedback.status !== "idle" ? (
          <Badge className="w-fit" variant={feedback.status === "success" ? "success" : "warning"}>
            {feedback.message}
          </Badge>
        ) : null}
      </form>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
        <span>{copy.helper}</span>
        <Link href={copy.helperHref} className="font-semibold text-[var(--gold-strong)]">
          {copy.helperLabel}
        </Link>
      </div>
    </Card>
  );
}
