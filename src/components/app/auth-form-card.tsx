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
    eyebrow: "欢迎回来",
    title: "登录以继续你的成长旅程",
    description:
      "进入你的任务中心、AI 支持工具、活动更新与高级会员内容工作台。",
    cta: "登录",
    helper: "第一次使用平台？",
    helperHref: "/signup",
    helperLabel: "创建账号",
  },
  signup: {
    eyebrow: "会员启用",
    title: "创建你的 TOMEI 会员工作台",
    description:
      "设置账号、完成引导流程，并开始安心生成品牌内容。",
    cta: "创建账号",
    helper: "已经注册？",
    helperHref: "/login",
    helperLabel: "前往登录",
  },
  forgot: {
    eyebrow: "账号恢复",
    title: "安全重设你的密码",
    description:
      "输入你的邮箱后，Supabase Auth 会发送安全恢复链接给你。",
    cta: "发送重设链接",
    helper: "想起密码了？",
    helperHref: "/login",
    helperLabel: "返回登录",
  },
  updatePassword: {
    eyebrow: "账号恢复",
    title: "设置新的安全密码",
    description:
      "请从恢复邮件打开此页面，并为你的会员工作台设置新的密码。",
    cta: "更新密码",
    helper: "返回登录",
    helperHref: "/login",
    helperLabel: "回到登录页",
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
              <Input placeholder="名字" {...form.register("firstName")} />
              <p className="mt-2 text-xs text-[var(--warning)]">
                {form.formState.errors.firstName?.message as string | undefined}
              </p>
            </div>
            <div>
              <Input placeholder="姓氏" {...form.register("lastName")} />
              <p className="mt-2 text-xs text-[var(--warning)]">
                {form.formState.errors.lastName?.message as string | undefined}
              </p>
            </div>
          </div>
        ) : null}

        {variant !== "updatePassword" ? (
          <div>
            <Input type="email" placeholder="邮箱地址" {...form.register("email")} />
            <p className="mt-2 text-xs text-[var(--warning)]">
              {form.formState.errors.email?.message as string | undefined}
            </p>
          </div>
        ) : null}

        {variant === "signup" ? (
          <div>
            <Input placeholder="手机号码" {...form.register("mobileNumber")} />
            <p className="mt-2 text-xs text-[var(--warning)]">
              {form.formState.errors.mobileNumber?.message as string | undefined}
            </p>
          </div>
        ) : null}

        {variant !== "forgot" ? (
          <div>
            <Input
              type="password"
              placeholder={variant === "updatePassword" ? "新密码" : "密码"}
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
              placeholder="确认新密码"
              {...form.register("confirmPassword")}
            />
            <p className="mt-2 text-xs text-[var(--warning)]">
              {form.formState.errors.confirmPassword?.message as string | undefined}
            </p>
          </div>
        ) : null}

        {variant === "signup" ? (
          <div>
            <Input placeholder="偏好语言（默认英文）" {...form.register("preferredLanguage")} />
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
