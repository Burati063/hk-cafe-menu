# 🍵 HK Cafe — Digital Menu

A production-ready, modern digital menu web application for **HK Cafe**, built with Next.js 15, Prisma, NextAuth, and Tailwind CSS.

## ✨ Features

### 🌐 Public Customer Menu
- **Mobile-first responsive design** — fast, SEO-friendly, and optimized for QR code scanning
- **Hero section** with cafe branding, hours, and contact info
- **Sticky category navigation** with smooth scroll
- **Live search** filtering menu items
- **Animated cards** with Framer Motion
- **Item modals** for detailed views (images, descriptions, pricing, tags)
- **Tag badges** (Popular, Spicy, Vegetarian, New)
- **Availability status** (unavailable items are dimmed)
- **Dark mode toggle**
- **Beautiful HK aesthetic** with warm cream, green, and gold colors

### 🔒 Admin Panel
- **Secure authentication** with NextAuth v5
- **Sidebar layout** with navigation
- **Dashboard** with stats and quick actions
- **Categories CRUD** — add, edit, delete, and reorder categories
- **Menu Items CRUD** — full management with search, filtering, inline availability toggle
- **QR Code Generator** — generate, download PNG/SVG, and print branded QR codes
- **Settings page** — manage cafe info, hours, contact details
- **Toast notifications** for all actions
- **Form validation** with Zod and React Hook Form

### 🧰 Technical Stack
- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Database:** Prisma ORM + PostgreSQL (Vercel Postgres, Supabase, or Neon)
- **Authentication:** NextAuth v5 (Credentials provider)
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **QR Codes:** `qrcode` library
- **Icons:** Lucide React
- **Toasts:** Sonner
- **Deployment:** Vercel

---

## 📦 Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd hk
npm install
```

### 2. Set Up Database

Create a PostgreSQL database using one of the following providers:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Neon](https://neon.tech/)

Copy `.env.example` to `.env.local` and add your database connection strings:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="your-secret-here"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

### 3. Run Migrations and Seed Data

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with HK Cafe menu items
npm run db:seed
```

**Default admin credentials:**
- Email: `admin@hkcafe.com`
- Password: `admin123`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

- **Public menu:** [http://localhost:3000/menu](http://localhost:3000/menu)
- **Admin panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🚀 Deployment to Vercel

### Step 1: Push to Git

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (e.g., `https://your-app.vercel.app`)
   - `AUTH_SECRET`

3. Deploy!

Vercel will automatically:
- Run `prisma generate`
- Build the Next.js app
- Deploy to a global CDN

### Step 3: Seed Production Database

After deployment, run the seed script from your local machine:

```bash
# Set DATABASE_URL to your production database
npm run db:seed
```

Or use Vercel's CLI:

```bash
vercel env pull .env.production.local
npm run db:seed
```

### Step 4: Update Settings

1. Log in to admin panel: `https://your-app.vercel.app/admin`
2. Go to **Settings**
3. Update **Menu URL** to your production domain
4. Go to **QR Code** and regenerate for your live URL

---

## 📂 Project Structure

```
hk/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── categories/      # Category CRUD
│   │   ├── items/           # Menu items CRUD
│   │   ├── menu/            # Public menu endpoint
│   │   ├── settings/        # Settings CRUD
│   │   └── stats/           # Dashboard stats
│   ├── admin/               # Admin panel
│   │   ├── categories/
│   │   ├── dashboard/
│   │   ├── items/
│   │   ├── login/
│   │   ├── qr/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── menu/                # Public menu page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Redirects to /menu
├── components/
│   ├── admin/               # Admin components
│   │   └── sidebar.tsx
│   ├── menu/                # Public menu components
│   │   ├── item-modal.tsx
│   │   ├── menu-item-card.tsx
│   │   ├── menu-skeleton.tsx
│   │   └── tag-badge.tsx
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── prisma.ts            # Prisma client
│   └── utils.ts             # Utility functions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script
├── types/
│   └── menu.ts              # TypeScript types
├── .env.example             # Environment variables template
├── .env.local               # Local environment (gitignored)
├── middleware.ts            # NextAuth middleware
├── next.config.ts           # Next.js config
├── package.json
├── README.md
├── tailwind.config.ts       # Tailwind config (v4)
├── tsconfig.json
└── vercel.json              # Vercel config
```

---

## 🗄️ Database Schema

### Models

- **Category** — menu sections (Breakfast, Lunch, Drinks, etc.)
- **MenuItem** — individual menu items with name, price, description, image, availability, tags
- **AdminUser** — admin credentials (bcrypt hashed passwords)
- **Setting** — key-value store for cafe info

### Relationships

- `Category` has many `MenuItem`
- `MenuItem` belongs to one `Category`

---

## 🔐 Authentication

- **NextAuth v5** with Credentials provider
- Passwords hashed with **bcryptjs**
- Protected admin routes via middleware
- Automatic redirects for unauthenticated users

---

## 🎨 Styling & Design

- **Tailwind CSS v4** (CSS-first configuration)
- **shadcn/ui** components (Radix UI primitives)
- **Custom HK Cafe theme:**
  - Warm cream background (`#faf8f3`)
  - Deep green primary (`#2d5a3d`)
  - Gold accent (`#c8973a`)
  - Retro Hong Kong aesthetic
- **Framer Motion** for smooth animations
- **Responsive design** (mobile-first)

---

## 📱 QR Code Usage

1. Go to **Admin → QR Code**
2. Generate QR code for your menu URL
3. **Download as PNG** for digital use (social media, websites)
4. **Download as SVG** for print (scalable, high quality)
5. **Print** with cafe branding for table placement

**Recommended print size:** Minimum 3cm × 3cm

---

## 🧪 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database (no migrations)
npm run db:migrate   # Create and apply migrations
npm run db:seed      # Seed database with sample data
```

---

## 🛠️ Customization

### Change Colors

Edit `app/globals.css` CSS variables:

```css
:root {
  --hk-cream: #faf8f3;
  --hk-green: #2d5a3d;
  --hk-gold: #c8973a;
  /* ... */
}
```

### Add New Tags

Edit `app/admin/items/page.tsx`:

```ts
const AVAILABLE_TAGS = ["Popular", "Spicy", "Vegetarian", "New", "YourTag"];
```

Update badge styles in `components/ui/badge.tsx` and `components/menu/tag-badge.tsx`.

### Change Currency

1. Go to **Admin → Settings**
2. Update **Currency** field (e.g., `USD`, `GBP`, `EUR`)
3. Update `formatPrice` in `lib/utils.ts` if needed

---

## 🔧 Troubleshooting

### Prisma Issues

```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Regenerate client
npm run db:generate
```

### NextAuth Errors

- Ensure `NEXTAUTH_URL` matches your domain
- Generate a new `NEXTAUTH_SECRET`
- Check middleware is running on `/admin` paths

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

---

## 📄 License

MIT License — free for personal and commercial use.

---

## 🙌 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

---

## 📧 Support

For issues or questions, open an issue on the repository or contact the development team.

**Enjoy your HK Cafe Digital Menu! 🍵**
