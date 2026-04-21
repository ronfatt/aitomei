export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="panel max-w-md p-8 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">TOMEI</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--foreground)]">
          Preparing your workspace
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Loading the member growth platform, campaign intelligence, and AI-ready modules.
        </p>
      </div>
    </div>
  );
}
