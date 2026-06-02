import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-neutral-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <span className="text-lg font-semibold text-brand-dark">ClientFlow</span>
        <div className="flex gap-2">
          <Link href="/auth/login">
            <Button variant="ghost" type="button">
              Log in
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button type="button">Get started</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20">
        <section className="grid gap-10 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
              ClientFlow CRM
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-neutral-900 md:text-5xl">
              One workspace for every client you onboard.
            </h1>
            <p className="mt-4 text-base text-neutral-600">
              Replace scattered email threads and folders with referrals, intake, workspaces,
              documents, chat, and milestones — built for freelancers and agencies.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/signup">
                <Button type="button" size="lg">
                  Get started free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" type="button" size="lg">
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-card border border-neutral-200 bg-white p-6 shadow-card">
            <p className="text-sm font-medium text-brand-dark">Live preview</p>
            <p className="mt-2 text-sm text-neutral-600">
              Pipeline, requests, workspaces, and Gemini assistant — wired to Supabase with RLS
              and realtime channels.
            </p>
            <div className="mt-6 h-40 rounded-nav bg-gradient-to-r from-brand-dark to-brand-light opacity-90" />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Structured intake",
              body: "Referral codes, five-step wizard, and asset uploads land in your inbox in realtime.",
            },
            {
              title: "Shared workspace",
              body: "Todos, milestones with approvals, chat, time logs, and team invites stay in sync.",
            },
            {
              title: "Documents & billing",
              body: "Proposals, invoices, and contracts with send flows, signatures, and payment status.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-card border border-neutral-200 bg-white p-5 shadow-card">
              <h3 className="text-lg font-medium text-neutral-900">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{f.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-card border border-brand-surface bg-white p-8 text-center shadow-card">
          <h2 className="text-2xl font-semibold text-neutral-900">Ready to ship your FYP demo?</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Connect Supabase, run migrations, add keys to `.env.local`, and deploy to Vercel.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/auth/signup">
              <Button type="button" size="lg">
                Create your workspace
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
