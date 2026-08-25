import { LockKeyhole } from "lucide-react";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const message = loginMessage(params.error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">Student Star</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Private dashboard</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This app contains personal course, grade, and schedule data. Sign in before continuing.
        </p>

        {message ? (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
            {message}
          </div>
        ) : null}

        <form action="/api/auth/login" className="mt-6 space-y-4" method="post">
          <input name="next" type="hidden" value={nextPath} />
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Access password</span>
            <input
              autoComplete="current-password"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none ring-teal-700 focus:ring-2"
              name="password"
              required
              type="password"
            />
          </label>
          <button className="min-h-11 w-full rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
            Unlock Student Star
          </button>
        </form>
      </section>
    </main>
  );
}

function safeNextPath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function loginMessage(error: string | undefined) {
  if (error === "config") return "Authentication is not configured yet. Set APP_ACCESS_PASSWORD and SESSION_SECRET in Vercel.";
  if (error === "invalid") return "Password is incorrect.";
  if (error === "rate") return "Too many login attempts. Wait a minute and try again.";
  return null;
}
