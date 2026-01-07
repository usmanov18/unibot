# Telegram Bot va Premium Admin Panel

Ushbu loyiha barcha turdagi funksiyalarni o'zida jamlagan Telegram bot va uni boshqarish uchun zamonaviy Admin Paneldan iborat.

## Xususiyatlari
- **Dinamik Bo'limlar**: Admin panelidan yangi bo'limlar qo'shish, o'chirish yoki tahrirlash.
- **Tartibni o'zgartirish**: Drag-and-drop orqali bot menyusidagi tugmalar ketma-ketligini o'zgartirish.
- **Premium Dizayn**: Shisha effektli (Glassmorphism) va qorong'u rejimli (Dark mode) admin paneli.
- **Admin Xavfsizligi**: Faqat ro'yxatdan o'tgan Telegram ID foydalanuvchilari botni boshqara oladi.

## O'rnatish tartibi

### 1. Backend sozlash
`server` papkasiga kiring va [.env.example](file:///c:/Users/mumin/.gemini/antigravity/playground/sparse-gravity/server/.env.example) faylini `.env` ga o'zgartiring:
```bash
cd server
npm install
npx prisma db push
npm run dev
```

> [!IMPORTANT]
> `.env` fayliga Telegram Bot tokinini yozishni unutmang!

### 2. Admin Panelni ochish
`admin/index.html` faylini brauzerda oching. Backend ishlayotgan bo'lsa, u avtomatik ravishda ma'lumotlarni bog'laydi.

### 3. Botni ishga tushirish
Botga `/setup` buyrug'ini yuboring. Birinchi bo'lib ushbu buyruqni yuborgan foydalanuvchi "Super Admin"ga aylanadi.

## Texnologiyalar
- **Backend**: Node.js, Express, Telegraf (Bot framework)
- **Ma'lumotlar bazasi**: Prisma + SQLite (Oson o'rnatish uchun)
- **Frontend**: Vanilla JS, CSS (Premium UI), SortableJS (Drag & Drop)

---
Ishlab chiquvchi: Antigravity AI
