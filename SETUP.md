# 🌿 FreshMart — Full Stack Setup Guide

## 1️⃣ MongoDB Atlas Setup (Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → Sign up free
2. Create a **Free Cluster** (M0)
3. **Database Access** → Add New Database User (username + password)
4. **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere — for dev)
5. **Connect** → Drivers → Copy connection string. It looks like:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/freshmart?retryWrites=true&w=majority
   ```

## 2️⃣ Environment Variables

Open `.env.local` and replace:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/freshmart?retryWrites=true&w=majority
BETTER_AUTH_SECRET=run: openssl rand -base64 32   (paste result here)
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional — only if you want Google login:
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Generate a secret:
```bash
openssl rand -base64 32
```

## 3️⃣ Google OAuth (Optional)

1. [console.cloud.google.com](https://console.cloud.google.com) → New Project
2. APIs & Services → Credentials → Create OAuth Client ID
3. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID & Secret into `.env.local`

> If you skip this, just remove the Google button usage or leave the env vars blank — email/password login still works fully.

## 4️⃣ Run the project

```bash
npm install
npm run dev
```

Visit **http://localhost:3000**

## 5️⃣ Make yourself Admin

After signing up once, go to MongoDB Atlas → Browse Collections → `freshmart` database → `user` collection → find your user → edit the `role` field from `"user"` to `"admin"`.

Then visit **http://localhost:3000/admin** to manage all orders.

## 📦 What's Included

- ✅ Better Auth — Email/Password + Google OAuth
- ✅ MongoDB — Orders saved permanently
- ✅ User Dashboard (`/dashboard`) — order history, stats
- ✅ Admin Panel (`/admin`) — manage all orders, update status
- ✅ Full checkout flow — bKash / Nagad / Card / COD
- ✅ Glass morphism dark UI
- ✅ Wishlist + Cart with real-time toast notifications
- ✅ Real Unsplash product images

## 🗂 Project Structure

```
app/
├── api/
│   ├── auth/[...all]/route.ts    → Better Auth handler
│   └── orders/
│       ├── route.ts              → POST (place order), GET (list orders)
│       └── [id]/route.ts         → PATCH (admin: update status)
├── lib/
│   ├── auth.ts                   → Better Auth server config
│   ├── auth-client.ts            → Better Auth React client
│   └── mongodb.ts                → Mongoose connection
├── models/
│   └── Order.ts                  → Order schema
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── dashboard/page.tsx             → User order history
├── admin/page.tsx                 → Admin order management
├── context/
│   ├── CartContext.tsx
│   ├── WishlistContext.tsx
│   └── ToastContext.tsx
└── components/                    → All UI components
```
