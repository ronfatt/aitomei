"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <Card className="p-8 text-center">
            <p className="eyebrow">Platform interruption</p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--foreground)]">
              Something interrupted the TOMEI experience
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              We hit an unexpected error while preparing the platform. The reset action retries the current view without forcing the member to restart their journey.
            </p>
            <div className="mt-6 flex justify-center">
              <Button onClick={reset}>Try again</Button>
            </div>
          </Card>
        </div>
      </body>
    </html>
  );
}
