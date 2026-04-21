"use client";

import { startTransition, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  displayName: z.string().min(2, "Display name is required."),
  mobileNumber: z.string().min(8, "Enter a valid mobile number."),
  preferredTone: z.string().min(3, "Add your preferred content tone."),
  favoriteCategory: z.string().min(3, "Add a favorite product category."),
  bio: z.string().min(24, "Share a short member introduction."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
export type { ProfileFormValues };

const defaults: ProfileFormValues = {
  firstName: "Nur",
  lastName: "Amirah",
  displayName: "Nur Amirah",
  mobileNumber: "+60 12-345 6789",
  preferredTone: "Elegant and educational",
  favoriteCategory: "Gold gifting",
  bio: "I enjoy creating elegant social content and helping my audience discover gift-worthy jewelry collections.",
};

export function ProfileForm({
  initialValues = defaults,
  source = "mock",
}: {
  initialValues?: ProfileFormValues;
  source?: "mock" | "supabase";
}) {
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  const watchedValues = useWatch({ control: form.control });
  const completion = Math.round(
    (Object.values(watchedValues).filter((value) => String(value).trim().length > 0).length /
      Object.keys(initialValues).length) *
      100,
  );

  function onSubmit() {
    startTransition(() => {
      setSaveState("saved");
    });
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
                : "Showing local MVP fallback data."}
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
            <Button type="submit">Save profile updates</Button>
            {saveState === "saved" ? (
              <Badge variant="success">Profile saved locally for MVP flow</Badge>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <Badge variant="neutral">Profile photo</Badge>
        <div className="mt-4 flex h-64 items-center justify-center rounded-[28px] border border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.7)]">
          <div className="text-center">
            <p className="font-semibold text-[var(--foreground)]">Profile image upload zone</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Supabase Storage bucket: `profile-uploads`</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Uploading a profile image supports poster personalization and progress completion.</p>
          </div>
        </div>
      </Card>
    </section>
  );
}
