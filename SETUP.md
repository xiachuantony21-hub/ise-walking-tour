# Ise Sacred Walk — Setup Guide

## 1. Install Node.js (if not already installed)

Download and install from: https://nodejs.org  
Choose the **LTS** version. This also installs `npm`.

---

## 2. Install project dependencies

Open Terminal, navigate to this folder, and run:

```bash
cd "/Users/xiachuantony/Desktop/YamaTrips株式会社/ise-walking-tour"
npm install
```

---

## 3. Configure environment variables

Edit the `.env.local` file in this folder:

```
STRIPE_SECRET_KEY=sk_test_...          ← from Stripe Dashboard > Developers > API Keys
STRIPE_PUBLISHABLE_KEY=pk_test_...     ← same page
STRIPE_WEBHOOK_SECRET=whsec_...        ← see step 4
ADMIN_PASSWORD=your-secure-password    ← password to log into /admin
ADMIN_JWT_SECRET=any-32-char-string    ← e.g. "my-super-secret-jwt-key-12345678"
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 4. Set up Stripe webhook (for local development)

Install the Stripe CLI: https://stripe.com/docs/stripe-cli

Then run (in a separate Terminal window while the dev server is running):

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the `whsec_...` key it shows and paste it into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## 5. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Pages

| URL                      | What it is                         |
|--------------------------|------------------------------------|
| `/`                      | Main booking page                  |
| `/booking-success`       | Shown after successful payment     |
| `/admin`                 | Admin login (管理画面)              |
| `/admin/dashboard`       | Full admin panel                   |

---

## Admin Panel Features

- 📋 **Bookings** — see all reservations with status (pending/paid/cancelled)
- 💴 **Pricing** — change private/group tour prices live
- 🕐 **Sessions** — enable/disable morning or afternoon sessions, change times
- 🚫 **Blocked Dates** — block specific dates from being booked
- 📢 **Announcement** — show a banner on the booking page

---

## Production Deployment (Vercel — recommended)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → New Project → Import repo
3. Add all environment variables (with production Stripe keys and your domain as `NEXT_PUBLIC_BASE_URL`)
4. Set up a Stripe webhook pointing to `https://your-domain.com/api/webhook`

> ⚠️ The booking data is stored in `data/bookings.json` on the server filesystem.
> On Vercel's serverless platform, this file resets on each deployment.
> For production, consider migrating to a database (e.g. PlanetScale, Supabase, or Vercel KV).

---

## Stripe Test Cards

During development (test mode), use these card numbers:
- ✅ Success: `4242 4242 4242 4242` · any future date · any CVC
- ❌ Decline:  `4000 0000 0000 0002`
