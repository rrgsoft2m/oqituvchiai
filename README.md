# O'qituvchi AI - Full Stack Platform

Super professional, production-ready, deploy-ready O'qituvchi AI loyihasi.

## 📁 Papkalar tuzilishi

- `/frontend` - Next.js 14 App Router (Vercel uchun)
- `/backend` - Node.js + Express REST API (Render uchun)

## 🚀 Qadam-ba-qadam Deploy qilish

### 1. Database v (Vercel Postgres)
- Vercel boshqaruv paneliga kiring va yangi Postgres ma'lumotlar bazasini yarating.
- `.env` sozlamalaridan `DATABASE_URL` linkini nusxalang.

### 2. Backend (Render.com)
1. GitHub orqali repo yarating va kodlarni yuklang.
2. Render.com tarmog'ida "New Web Service" yarating.
3. Reponi ulang.
4. **Environment Variables** ga qo'shing:
   - `DATABASE_URL` (Vercel Postgres urli)
   - `JWT_SECRET` (Ixtiyoriy kuchli parolni yozing)
   - `GEMINI_API_KEYS` (Misol: `key1,key2,key3`)
   - `PORT=3001`
5. **Build command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
6. **Start command**: `npm start`
*Eslatma: backend Renderda deploy bo'lgach, uning manzilini nusxalang.*

### 3. Frontend (Vercel.com)
1. Vercel.com tarmog'ida yangi loyiha yarating.
2. Reponi ulang va `frontend` papkasini **Root Directory** sifatida tanlang.
3. Framework: **Next.js**
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` (Render.com dagi backend API manzilingiz, misol: `https://vibe-backend.onrender.com/api`)
5. Deploy tugmasini bosing!

## Xususiyatlar (Features)
✅ **Auth System (JWT)**: Login, Ro'yxatdan o'tish (Bepul, Ustoz, Katta ustoz tariflari).
✅ **Generatsiya (Gemini AI)**: Taqdimot, test, S&A, o'yin, krossvord, mantiqiy jumboq tayyorlash.
✅ **Limit nazorati**: Foydalanuvchi obunasiga mos AI limitlar by-pass tizimi.
✅ **API Fallback Pooling**: Gemini kalitlari tugaganda rotate qilinadi.
✅ **History**: Har bir generatsiya qilingan darslar saqlanadi va print qilinadi.
✅ **UI/UX**: Modern Glassmorphism, Animated Cards (Framer Motion).

### Mahalida run qilish (Localhost)
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && npm run dev`
*(Mahalliydagi `npx prisma init` uchun MacOS qandaydir EPERM xatosi bor, shuning uchun deploy paytida muammo bo'lmaydi).*
