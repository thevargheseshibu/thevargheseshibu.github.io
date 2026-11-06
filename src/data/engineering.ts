/** Verified against KeraSobha worker/index.ts, email.ts, enquiries.ts, admin.ts and migrations. No deployment identifiers. */
export const systemNodes = [
  {
    id: "browser",
    label: "Browser",
    sub: "Public experience",
    description: "The browser receives pre-rendered pages. Interactive forms call same-origin /api/* routes.",
    x: 30,
    y: 150,
  },
  {
    id: "assets",
    label: "Edge assets",
    sub: "Next.js static export",
    description: "Cloudflare serves the static export directly. Only /api/* runs the Worker first.",
    x: 300,
    y: 35,
  },
  {
    id: "worker",
    label: "Worker",
    sub: "/api/* · run_worker_first",
    description:
      "The API routes enquiries, orders, admin operations and visitor events. Static page requests stay on the asset path.",
    x: 300,
    y: 255,
  },
  {
    id: "enquiries",
    label: "Enquiries",
    sub: "Validated public submissions",
    description:
      "Consent, server validation, same-origin requests, a honeypot and five attempts per IP per hour protect submissions. Submission IDs make retries idempotent. Enquiries write to D1; they do not send automatic email notifications.",
    x: 580,
    y: 150,
  },
  {
    id: "admin",
    label: "Admin",
    sub: "Session · CSRF · activity log",
    description:
      "Authenticated admin routes check CSRF on mutations. The enquiry inbox supports search, filters, pagination, private notes and an activity log.",
    x: 580,
    y: 360,
  },
  {
    id: "d1",
    label: "D1 / SQLite",
    sub: "18 versioned migrations",
    description:
      "Numbered SQL migrations evolve orders, enquiries, visitor CRM, segments and checkout autosave. The database also holds the email outbox.",
    x: 860,
    y: 255,
  },
  {
    id: "cron",
    label: "Cron trigger",
    sub: "Every 15 minutes",
    description:
      "The scheduled Worker retries the email outbox, expires rate limits and purges abandoned data. It also rolls up visitor statistics.",
    x: 30,
    y: 465,
  },
  {
    id: "email",
    label: "Resend",
    sub: "Order email outbox",
    description:
      "The Worker claims pending or failed email rows, sends through Resend with an idempotency key and records the result in D1.",
    x: 860,
    y: 465,
  },
] as const;
export const systemEdges = [
  ["browser", "assets"],
  ["browser", "worker"],
  ["worker", "enquiries"],
  ["worker", "admin"],
  ["worker", "d1"],
  ["enquiries", "d1"],
  ["admin", "d1"],
  ["cron", "worker"],
  ["worker", "email"],
] as const;
