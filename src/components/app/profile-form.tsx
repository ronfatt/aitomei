"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import {
  saveMemberPhotoAction,
  saveMemberProfileAction,
} from "@/features/profile/actions";
import {
  defaultProfileValues,
  profileSchema,
  type ProfileFormValues,
} from "@/features/profile/schemas";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export function ProfileForm({
  userId,
  initialValues = defaultProfileValues,
  initialPhotoPath = null,
  source = "mock",
}: {
  userId: string;
  initialValues?: ProfileFormValues;
  initialPhotoPath?: string | null;
  source?: "mock" | "supabase";
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [saveState, setSaveState] = useState<{
    status: "idle" | "success" | "error";
    message?: string;
  }>({ status: "idle" });
  const [uploadState, setUploadState] = useState<{
    status: "idle" | "uploading" | "success" | "error";
    message?: string;
  }>({ status: "idle" });
  const [photoPath, setPhotoPath] = useState<string | null>(initialPhotoPath);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  const watchedValues = useWatch({ control: form.control });
  const completion = useMemo(() => {
    const values = [
      watchedValues.firstName,
      watchedValues.lastName,
      watchedValues.displayName,
      watchedValues.mobileNumber,
      watchedValues.preferredTone,
      watchedValues.favoriteCategory,
      watchedValues.bio,
      photoPath ?? "",
    ];

    return Math.round(
      (values.filter((value) => String(value ?? "").trim().length > 0).length / values.length) * 100,
    );
  }, [photoPath, watchedValues]);

  useEffect(() => {
    let active = true;

    async function loadPreview() {
      if (!photoPath || !hasSupabaseEnv()) {
        setPhotoPreviewUrl(null);
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.storage
        .from("profile-uploads")
        .createSignedUrl(photoPath, 60 * 60);

      if (!active) {
        return;
      }

      if (error || !data?.signedUrl) {
        setPhotoPreviewUrl(null);
        return;
      }

      setPhotoPreviewUrl(data.signedUrl);
    }

    void loadPreview();

    return () => {
      active = false;
    };
  }, [photoPath]);

  async function onSubmit(values: ProfileFormValues) {
    setSaveState({ status: "idle" });

    startTransition(async () => {
      const result = await saveMemberProfileAction(values);
      setSaveState(result);
    });
  }

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!hasSupabaseEnv()) {
      setUploadState({
        status: "error",
        message: "Supabase environment variables are missing. Add them to enable photo uploads.",
      });
      return;
    }

    setUploadState({
      status: "uploading",
      message: "Uploading your profile photo...",
    });

    const supabase = createSupabaseBrowserClient();
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const storagePath = `${userId}/${Date.now()}-profile.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-uploads")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      setUploadState({
        status: "error",
        message: uploadError.message,
      });
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setPhotoPreviewUrl(localPreviewUrl);

    const result = await saveMemberPhotoAction({ photoPath: storagePath });

    if (result.status === "success") {
      setPhotoPath(storagePath);
      setUploadState({
        status: "success",
        message: result.message,
      });
    } else {
      setUploadState({
        status: "error",
        message: result.message,
      });
    }
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge variant="default">Profile completion</Badge>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{completion}% complete</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {source === "supabase"
                ? "Loaded from Supabase member profile data."
                : "Showing local MVP fallback data until Supabase is configured."}
            </p>
          </div>
          <div className="w-44">
            <Progress value={completion} />
          </div>
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Input placeholder="First name" {...form.register("firstName")} />
            <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.firstName?.message}</p>
          </div>
          <div>
            <Input placeholder="Last name" {...form.register("lastName")} />
            <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.lastName?.message}</p>
          </div>
          <div>
            <Input placeholder="Preferred display name" {...form.register("displayName")} />
            <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.displayName?.message}</p>
          </div>
          <div>
            <Input placeholder="Mobile number" {...form.register("mobileNumber")} />
            <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.mobileNumber?.message}</p>
          </div>
          <div>
            <Input placeholder="Preferred content tone" {...form.register("preferredTone")} />
            <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.preferredTone?.message}</p>
          </div>
          <div>
            <Input placeholder="Favorite product category" {...form.register("favoriteCategory")} />
            <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.favoriteCategory?.message}</p>
          </div>
          <div className="md:col-span-2">
            <Textarea {...form.register("bio")} />
            <p className="mt-2 text-xs text-[var(--warning)]">{form.formState.errors.bio?.message}</p>
          </div>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save profile updates
            </Button>
            {saveState.status !== "idle" ? (
              <Badge variant={saveState.status === "success" ? "success" : "warning"}>
                {saveState.message}
              </Badge>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <Badge variant="neutral">Profile photo</Badge>
        <div className="mt-4 rounded-[28px] border border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.78)] p-5">
          <div className="flex flex-col items-center gap-5 text-center">
            <div
              className="flex h-48 w-full max-w-[280px] items-end justify-start overflow-hidden rounded-[28px] border border-[rgba(196,168,114,0.18)] bg-[radial-gradient(circle_at_top,rgba(233,216,179,0.45),transparent_36%),linear-gradient(180deg,#f8f2ea_0%,#efe4d2_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
              style={
                photoPreviewUrl
                  ? {
                      backgroundImage: `linear-gradient(180deg,rgba(255,250,243,0.18),rgba(42,32,22,0.18)), url(${photoPreviewUrl})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }
                  : undefined
              }
            >
              {!photoPath ? (
                <div className="rounded-2xl bg-white/78 px-4 py-2 text-left shadow-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-strong)]">Photo Slot</p>
                  <p className="mt-1 text-sm font-medium text-[var(--foreground)]">Ready for premium member portrait</p>
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-[var(--foreground)]">Profile image upload</p>
              <p className="text-sm leading-7 text-[var(--muted)]">
                Uploading a clear portrait supports personalized posters, onboarding completion, and member identity surfaces.
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Supabase Storage bucket: profile-uploads
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadState.status === "uploading"}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              {uploadState.status === "uploading" ? "Uploading..." : "Upload profile photo"}
            </Button>

            {uploadState.status !== "idle" ? (
              <Badge variant={uploadState.status === "success" ? "success" : "warning"}>
                {uploadState.message}
              </Badge>
            ) : null}
          </div>
        </div>
      </Card>
    </section>
  );
}
