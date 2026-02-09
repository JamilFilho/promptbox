Stripe integration setup

Environment variables required:

- `STRIPE_SECRET_KEY` - your Stripe secret key (starts with `sk_...`)
- `STRIPE_WEBHOOK_SECRET` - webhook signing secret (optional but recommended)
- `NEXT_PUBLIC_BASE_URL` - your site base URL (e.g. `http://localhost:3000`)

Notes:
- After editing `prisma/schema.prisma` the project requires a Prisma migration to add the `paid` and `stripeCustomerId` fields:

  ```bash
  npx prisma migrate dev --name add-paid-field
  ```

- Install the Stripe SDK before running the server:

  ```bash
  npm install stripe
  ```

- Configure a Stripe webhook endpoint pointing to `/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET`.

Usage flow:
- Client calls `POST /api/box/proxy` with `{ userId }`.
- If user already paid, API returns `{ paid: true }`.
- If not, API returns `{ url }` with a Stripe Checkout URL — client redirects user to Stripe.
- On payment success Stripe calls the webhook which sets `paid=true` for the user.
