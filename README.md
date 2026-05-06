# Pulser — רחובות מתעוררת Campaign Tool

A Hebrew-first civic action campaign tool. Residents open a campaign page and click one button to send a pre-written WhatsApp message to a designated number. Organizers create campaigns through a protected admin panel.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="choose-a-strong-password"
ADMIN_SESSION_SECRET="a-random-string-at-least-32-characters-long"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start the dev server

```bash
npm run dev
```

App is running at **http://localhost:3000**

---

## Usage

### Public campaign page

```
http://localhost:3000/campaign/demo01
```

This is the URL you share with residents (via WhatsApp, social media, etc.). They land here, read the campaign, and click the CTA to send the message.

### Admin panel

```
http://localhost:3000/admin/campaigns
```

Log in with the `ADMIN_PASSWORD` from `.env`.

### Create a campaign

1. Go to `/admin/campaigns/new`
2. Fill in:
   - **כותרת הקמפיין** — Campaign headline
   - **תיאור קצר** — Short description of the campaign goal
   - **מספר וואטסאפ יעד** — Target phone number (international format: +972501234567)
   - **נוסח ההודעה** — The pre-written WhatsApp message residents will send
   - **טקסט לכפתור** — CTA button label (default: "שלחו הודעה עכשיו")
3. Click "יצירת קישור לקמפיין"
4. Copy the shareable URL and send it to residents

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Prisma DB URL. SQLite: `file:./dev.db`. PostgreSQL: `postgresql://...` |
| `ADMIN_PASSWORD` | ✅ | Password for the admin panel |
| `ADMIN_SESSION_SECRET` | ✅ | Secret for signing session cookies (32+ random chars) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Base URL of the app (e.g., `https://pulser.yourdomain.com`) |

---

## Migrating to PostgreSQL / Supabase

1. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`
2. Update `DATABASE_URL` in `.env` to your PostgreSQL connection string
3. Run: `npx prisma migrate deploy`

No code changes required.

---

## Inspect the database

```bash
npx prisma studio
```

Opens a visual browser at http://localhost:5555.

---

## Project structure

```
pulser-app/
├── prisma/
│   ├── schema.prisma        # DB schema
│   └── seed.ts              # Demo campaign seed
├── src/
│   ├── app/
│   │   ├── campaign/[slug]/ # Public campaign page
│   │   ├── admin/           # Admin panel (protected)
│   │   └── api/             # API routes
│   ├── components/
│   │   ├── campaign/        # CampaignHero, WhatsAppCTA, ClickCounter, etc.
│   │   └── admin/           # CampaignForm, CampaignTable
│   └── lib/
│       ├── prisma.ts        # DB client
│       ├── whatsapp.ts      # Phone normalization + link builder
│       ├── auth.ts          # Admin session auth
│       └── validation.ts    # Campaign form validation
└── .env.example
```

---

## Design

Brand colors: Yellow `#F5C800` · Black `#1A1A1A` · Red `#D42B3A`

The campaign page is designed to feel like a protest poster — bold, yellow-first, high-contrast, urgent. All copy is in Hebrew (RTL).
