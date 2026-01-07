# 🚀 BEPUL 24/7 HOSTING OPTIONS

Sizning bot uchun eng yaxshi bepul variantlari:

---

## 🎯 TAVSIYA ETILGAN: Render.com ⭐

**Nima yaxshi:**
- ✅ 24/7 ishlaydi (spin down yo'q)
- ✅ Bepul Node.js support
- ✅ SQLite database
- ✅ GitHub CI/CD
- ✅ Custom domain support (paid)

**Qanday deploy qilish:**
👉 [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) faylini o'qing

**URL:** `https://stellar-bot.onrender.com`

---

## 🚂 IKKINCHI VARIANT: Railway.app

**Nima yaxshi:**
- ✅ $5 free credits/month (~ 24/7 ishlash uchun yetarli)
- ✅ Oson deploy
- ✅ GitHub integration
- ✅ SQLite support

**Deploy uchun:**

### 1. Railway-ga kiring
```
https://railway.app
```

### 2. GitHub bilan login
- "Login with GitHub" bosing

### 3. Yangi project
- "New Project"
- "Deploy from GitHub repo"
- `usmanov18/unibot` tanlang

### 4. Environment setup
```
TELEGRAM_BOT_TOKEN=your_token
DATABASE_URL=file:./prod.db
NODE_ENV=production
```

### 5. Deploy
- Build Command: `cd server && npm install && npm run build`
- Start Command: `cd server && node dist/index.js`

**Afzalligi:** Bepul credits 24/7 ishlash uchun yetarli

---

## 🌐 UCHINCHI VARIANT: Fly.io

**Nima yaxshi:**
- ✅ 3 shared CPU VM-lar bepul
- ✅ 3 GB storage
- ✅ Global deployment
- ✅ Tez va ishonchli

**Deploy uchun:**

### 1. Fly CLI o'rnatni
```bash
curl -L https://fly.io/install.sh | sh
```

### 2. Login
```bash
flyctl auth login
```

### 3. App yaratni
```bash
cd /workspaces/unibot
flyctl launch --name stellar-bot
```

### 4. Environment variables
```bash
flyctl secrets set TELEGRAM_BOT_TOKEN=your_token
```

### 5. Deploy
```bash
flyctl deploy
```

**Bot-ni tekshiring:**
```bash
flyctl logs
```

---

## 📊 COMPARISON TABLE

| Feature | Render | Railway | Fly.io |
|---------|--------|---------|--------|
| **24/7 Uptime** | ✅ Yes | ✅ Yes (with credits) | ✅ Yes |
| **Free Tier** | ✅ $0 | ✅ $5/mo free | ✅ $0 (limited) |
| **Build Time** | ~10 min | ~5 min | ~5 min |
| **Database** | SQLite ✅ | SQLite ✅ | SQLite ✅ |
| **GitHub CI/CD** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Custom Domain** | Paid | Paid | Paid |
| **Speed** | Medium | Fast | Fast |
| **Difficulty** | Easy | Easy | Medium |

---

## 🏃 TEZKOR START (5 MIN)

### Render.com orqali:

```bash
# 1. GitHub-ga push qiling
cd /workspaces/unibot
git push origin main

# 2. https://render.com ga kiring
# 3. "New Web Service" bosing
# 4. GitHub repo ulang
# 5. Konfiguratsiya o'rnatni:
#    - Build: cd server && npm install && npm run prisma:generate && npm run build
#    - Start: cd server && node dist/index.js
# 6. Environment variables qo'shing
# 7. "Create Web Service" bosing

# 8. 5-10 daqiqada deploy bo'ladi
# Bot URL: https://stellar-bot.onrender.com
```

---

## 🔄 DEPLOY KEYINGI YANGILASHLAR

Kodni yangilash uchun shunchaki push qiling:

```bash
# Qandaydir o'zgartirishlar...
git add .
git commit -m "Updated features"
git push origin main
```

Render/Railway/Fly.io **avtomatik ravishda** yangi kodni deploy qiladi!

---

## ⚠️ MUHIM ESLATMALAR

### Database Cheklovlar

- SQLite **5-100 MB** gacha
- Bot 247 users logga saqlaydigan bo'lsa, ~1-2 MB/month

### Memory Cheklovlar

- Bot **30-50 MB** memory ishlatadi
- Bepul plan **512 MB** - yetarli ✅

### Build Cheklovlar

- Build vaqti: **~10 daqiqa**
- Deploy vaqti: **~30 sekund**

---

## ✅ DEPLOYMENT AFTER CHECKLIST

- [x] Kod GitHub-da
- [x] .env variables o'rnatilgan
- [x] `render.yaml` / deployment config tayyor
- [x] Bot token mavjud
- [x] Build command testlangan
- [x] Health endpoint ishlaydI

---

## 📊 MONITORING

### Health Check
```bash
curl https://stellar-bot.onrender.com/health
```

### Logs Ko'rish
- **Render**: Dashboard → Logs
- **Railway**: Dashboard → Deployments → Logs
- **Fly.io**: `flyctl logs`

### Bot Tekshirish
Telegram-da bot-ga `/start` yozing.

---

## 🎯 NATIJA

✅ Bot **24/7 ishlaydi**  
✅ Hech qanday pul xarchamadi  
✅ Avtomatik deploy (GitHub push-dan)  
✅ Monitoring va logs mavjud  

**Omadingiz bo'lsin! 🚀**

---

## 📚 BATAFSIL QOLLANMA

- **Render Deploy:** [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) ⭐ **TAVSIYA ETILGAN**
- **Main Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Production Setup:** [PRODUCTION_READY.md](./PRODUCTION_READY.md)
