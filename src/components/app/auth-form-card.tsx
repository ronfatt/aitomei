"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { BrandMark } from "@/components/layout/brand-mark";
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
      "Enter your email address and the Supabase Auth flow can send a secure password reset link.",
    cta: "Send reset link",
    helper: "Remembered your password?",
    helperHref: "/login",
    helperLabel: "Back to login",
  },
} as const;

const schemas = {
  login: z.object({
    email: z.email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
  }),
  signup: z.object({
    firstName: z.string().min(2, "First name is required."),
    lastName: z.string().min(2, "Last name is required."),
    email: z.email("Enter a valid email address."),
    mobileNumber: z.string().min(8, "Enter a valid mobile number."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    preferredLanguage: z.string().min(2, "Preferred language is required."),
  }),
  forgot: z.object({
    email: z.email("Enter a valid email address."),
  }),
} as const;

export function AuthFormCard({ variant }: { variant: keyof typeof authCopy }) {
  const copy = authCopy[variant];
  const [submitted, setSubmitted] = useState(false);
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
          : {
              email: "",
            },
  });

  function onSubmit() {
    startTransition(() => {
      setSubmitted(true);
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
              <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.firstName?.message as string | undefined}</p>
            </div>
            <div>
              <Input placeholder="Last name" {...form.register("lastName")} />
              <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.lastName?.message as string | undefined}</p>
            </div>
          </div>
        ) : null}
        <div>
          <Input type="email" placeholder="Email address" {...form.register("email")} />
          <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.email?.message as string | undefined}</p>
        </div>
        {variant === "signup" ? (
          <div>
            <Input placeholder="Mobile number" {...form.register("mobileNumber")} />
            <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.mobileNumber?.message as string | undefined}</p>
          </div>
        ) : null}
        {variant !== "forgot" ? (
          <div>
            <Input type="password" placeholder="Password" {...form.register("password")} />
            <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.password?.message as string | undefined}</p>
          </div>
        ) : null}
        {variant === "signup" ? (
          <div>
            <Input placeholder="Preferred language (English first)" {...form.register("preferredLanguage")} />
            <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.preferredLanguage?.message as string | undefined}</p>
          </div>
        ) : null}
        <Button className="w-full" type="submit">
          {copy.cta}
        </Button>
        {submitted ? (
          <Badge className="w-fit" variant="success">
            {variant === "forgot"
              ? "Password reset request captured for Supabase integration"
              : "Validated form ready for Supabase auth wiring"}
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
