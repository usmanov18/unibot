# 🚀 Render.com-ga Deploy Qilish (24/7 Bepul)

## 📋 Qo'shidagi Vaqti: ~10 daqiqa

Stellar Bot botingiz **Render.com**-da 24/7 ishlaydi, xotirasini yo'q uchun bevosita.

---

## 1️⃣ GITHUB-GA PUSH QILING

Kodingizni GitHub-ga jo'natni (agar jo'natmagan bo'lsangiz):

```bash
cd /workspaces/unibot

# Git setup
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Add all files
git add .

# Commit
git commit -m "Production ready with Render configuration"

# Push to GitHub
git push origin main
```

---

## 2️⃣ RENDER.COM-DA ACCOUNT YARATNI

1. **https://render.com** ga kiring
2. GitHub bilan sign up qiling (social login)
3. GitHub-ga permission bering

---

## 3️⃣ YANGI WEB SERVICE YARATNI

### Step 1: Dashboard-ga kiring
```
https://dashboard.render.com
```

### Step 2: "New +" tugmasini bosing
- "Web Service" ni tanlang

### Step 3: GitHub Repository ulang
- Sizning repository-ni tanlang: `usmanov18/unibot`
- "Connect" bosing

### Step 4: Konfiguratsiya
**Service Name:**
```
stellar-bot
```

**Runtime:** 
```
Node
```

**Build Command:**
```
cd server && npm install && npm run prisma:generate && npm run build
```

**Start Command:**
```
cd server && node dist/index.js
```

---

## 4️⃣ ENVIRONMENT VARIABLES O'RNATNI

Dashboard-da **Environment** tab-iga kiring va quyidagilarni qo'shing:

| Key | Value |
|-----|-------|
| `TELEGRAM_BOT_TOKEN` | `8105765097:AAH...` (Sizning token) |
| `DATABASE_URL` | `file:./prod.db` |
| `PORT` | `4000` |
| `NODE_ENV` | `production` |
| `GOOGLE_SEARCH_API_KEY` | (ixtiyoriy) |
| `GOOGLE_SEARCH_CX` | (ixtiyoriy) |
| `OPENAI_API_KEY` | (ixtiyoriy) |

**Token qayerdan olish?**
- [@BotFather](https://t.me/botfather) ga `/mybots` yozing
- Sizning bot-ni tanlang
- "API Token" ni nusxalang

---

## 5️⃣ DEPLOY QILNI

### Opsiya A: YAML Fayl bilan (Recommended)

Render.com-da "Render from YAML" tanlang va **https://github.com/usmanov18/unibot/blob/main/render.yaml** ni qo'shing.

### Opsiya B: Qo'lda Setup

1. Barcha konfiguratsiyani yuqorida o'rnatni
2. Plan tanlang: **Free** (bottleneck 0.5 CPU, 512 MB RAM, bepul)
3. "Create Web Service" bosing

---

## ✅ DEPLOYMENT JARAYONI

Render.com:
1. ✅ GitHub-dan kodni klonlaydi
2. ✅ `npm install` bajara
3. ✅ TypeScript kompilyatsiya qiladi
4. ✅ Bot ishga tushadi

### Build Logs Ko'rish

Dashboard-da "Logs" tab-iga kiring:

```
=== Building and starting service...
npm install
npm run prisma:generate
npm run build
Starting: node dist/index.js
✓ Server is running on http://localhost:4000
✓ Telegram Bot is launched
```

---

## 🔗 BO'TINIZNING URL-I

Deployment tugagan so'ng, siz olasiz:

```
https://stellar-bot.onrender.com
```

Tekshirilsin:
```bash
curl https://stellar-bot.onrender.com/health
# Response: {"status":"ok","uptime":...,"bot":"running"}
```

---

## 📱 BOTNI TELEGRAM-DA ISHLATNI

Telegram-da bot-ga `/start` yozing. Bot javob berishi kerak!

---

## ⚠️ RENDER.COM FREE PLAN CHEKLOVLAR

| Xususiyat | Bepul Plan |
|-----------|-----------|
| **Uptime** | ✅ 24/7 (bepul dynos yo'q) |
| **CPU** | 0.5 vCPU |
| **Memory** | 512 MB |
| **Build Time** | ~5-10 min |
| **Deployed Apps** | 1 ta |
| **Database** | SQLite (file-based) ✅ |

**Eslatma:** Render.com bepul plan **hech qachon spin down** qilmaydi (Heroku kabi). Bot har doim ishlaydi!

---

## 🔄 KODNI YANGILASH

Bot kodini yangilash uchun:

```bash
cd /workspaces/unibot
git add .
git commit -m "Updated features"
git push origin main
```

Render.com **avtomatik ravishda** yangi kodini deploy qiladi (2-5 min).

---

## 📊 MONITORING

### Health Check
```bash
curl https://stellar-bot.onrender.com/health
```

### Logs Ko'rish
Render Dashboard → "Logs" tab

### Bot Status Tekshirish
Telegram-da bot-ga `/start` yozing.

---

## 🆘 MUAMMOLAR VA YECHIM

### "Build failed" xatosi

```
❌ npm ERR! Cannot find module '@prisma/client'
```

**Yechim:** `render.yaml` faylni tekshiring:
```yaml
buildCommand: cd server && npm install && npm run prisma:generate && npm run build
```

### Bot javob bermayapti

1. Health endpoint tekshiring:
   ```bash
   curl https://stellar-bot.onrender.com/health
   ```

2. Logs ko'ring (Render Dashboard)

3. TELEGRAM_BOT_TOKEN to'g'ri ekanligini tekshiring

### Database xatosi

Render.com SQLite-ni **`.db` fayl sifatida** saqlaydi. Keyingi deploy-da data saqlanib qoladi.

---

## 💾 BACKUP

SQLite database avtomatik saqlana, lekin backup qilishni tavsiya etamiz:

```bash
# Local backupdan pull qiling
curl https://stellar-bot.onrender.com/backup -o backup.db
```

---

## 🎯 KEYINGI QADAMLAR

1. **Admin Panel**: Brauzerda `/admin` orqali kirish (Render URL-dan)
   ```
   https://stellar-bot.onrender.com/admin
   ```

2. **Monitoring**: UptimeRobot qo'shing (host alive bo'lsa, bot ishlaydi)

3. **Custom Domain**: (Paid) `yourdomain.com` ga o'zgarting

---

## 📞 YORDAM

Agar muammo bo'lsa:
1. [Render Docs](https://render.com/docs)
2. [Telegraf Issues](https://github.com/telegraf/telegraf/issues)
3. [Prisma Support](https://www.prisma.io/support)

---

**Status:** 🟢 **Ready to Deploy**

Render.com-ga botingiz **hozir deploy qilish uchun tayyor!**

Omadingiz bo'lsin! 🚀
