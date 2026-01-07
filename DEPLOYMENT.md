# 🚀 Stellar Bot - Deployment Guide

Ushbu qo'llanma **unibot** botni serverga (production) joylashni bosqichma-bosqich tavsiflaydi.

---

## 📋 Jami Tekshiruv (Pre-Deployment Checklist)

- [x] TypeScript kodi kompilyatsiya qilingan
- [x] Prisma sxemasi yaratilgan
- [x] Database migratsiyalari tavsiqlandi
- [x] Admin panel HTML to'liq va xatasiz
- [x] .env.example yaratilgan va hujjatlandi
- [x] Docker konfiguratsiyasi tayyor
- [x] Slotsning barcha APIlari ishlayapti

---

## 🔧 Environment Variables (.env)

Server ishga tushgunga oldin, quyidagi o'zgaruvchilarni o'rnatish kerak:

```env
# Majburi
TELEGRAM_BOT_TOKEN=your_bot_token_here
DATABASE_URL="file:./prod.db"
PORT=4000

# Ixtiyoriy (API funksiyalari uchun)
GOOGLE_SEARCH_API_KEY=your_key_here
GOOGLE_SEARCH_CX=your_cx_here
OPENAI_API_KEY=your_key_here
```

### API Kalitlarini qanday olish?

1. **Telegram Bot Token**: [@BotFather](https://t.me/botfather) ga murojaat qiling
2. **Google Search API**: [Google Cloud Console](https://console.cloud.google.com) - Custom Search API yoqing
3. **OpenAI API**: [platform.openai.com](https://platform.openai.com) - API kalitini yarating

---

## 🐳 Docker orqali Deploy

### 1️⃣ Ishchi Serverda Docker o'rnatish

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install docker.io docker-compose

# Startov
sudo systemctl start docker
sudo systemctl enable docker
```

### 2️⃣ Loyihani Klonlash

```bash
cd /opt
git clone https://github.com/usmanov18/unibot.git
cd unibot/server
```

### 3️⃣ .env Faylini Sozlash

```bash
cp .env.example .env
nano .env  # Kerakli qiymatlarni kiriting
```

### 4️⃣ Container Ishga Tushirish

```bash
# Yangi image tayyorlash
docker build -t unibot:latest .

# Container ishga tushirish
docker run -d \
  --name unibot-server \
  -p 4000:4000 \
  --env-file .env \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  unibot:latest

# Yoki docker-compose orqali
docker-compose up -d
```

### 5️⃣ Tekshirish

```bash
# Logs ko'rish
docker logs unibot-server

# Health check
curl http://localhost:4000/health

# Nat ijasi:
# {"status":"ok","uptime":123.45,"timestamp":"2026-01-07T...","bot":"running"}
```

---

## 🌍 Cloud Serverga Deploy

### Render.com orqali (Bepul opciya)

#### 1️⃣ Render.com da account yaratish

- https://render.com ga kiring
- GitHub bilan bog'laning

#### 2️⃣ Yangi Web Service yaratish

```
1. "New" → "Web Service"
2. GitHub repository tanlang
3. Build commands:
   - Build Command: npm install && npm run build
   - Start Command: node dist/index.js
4. Environment Variables o'zgartiruvchilarini qo'shish
5. Deploy
```

#### 3️⃣ Render.yaml konfiguratsiyasi

```yaml
services:
  - type: web
    name: unibot-server
    env: node
    region: oregon
    plan: free
    buildCommand: cd server && npm install && npm run build
    startCommand: cd server && node dist/index.js
    envVars:
      - key: TELEGRAM_BOT_TOKEN
        scope: run
      - key: DATABASE_URL
        value: file:./prod.db
        scope: run
```

### Heroku orqali

```bash
# Heroku CLI o'rnatish
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# App yaratish
heroku create unibot-stellar

# Environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_token

# Push
git push heroku main
```

### DigitalOcean / VPS orqali

```bash
# 1. SSH ulanish
ssh root@your_server_ip

# 2. Node.js o'rnatish
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. PM2 (Process Manager) o'rnatish
sudo npm install -g pm2

# 4. Loyihani klonlash
git clone https://github.com/usmanov18/unibot.git
cd unibot/server

# 5. Dependencies o'rnatish
npm install
npm run build

# 6. PM2 orqali startov
pm2 start dist/index.js --name "unibot-server"
pm2 startup
pm2 save

# 7. Nginx orqali reverse proxy (ixtiyoriy)
sudo apt install nginx
# /etc/nginx/sites-available/default ni tahrirlang
```

---

## 🔐 Xavfsizlik Choralari

### 1. Environment Variables Himoyasi

```bash
# .env fayliga faqat o'qish huquqi
chmod 600 .env

# Kodda environment variables dan foydalanish
process.env.TELEGRAM_BOT_TOKEN // ✓ Xavfsiz
// NEVER: const token = "your_token" // ✗ Xavfsiz emas
```

### 2. Database Himoyasi

```bash
# SQLite database faylini himoya qiling
chmod 600 prod.db

# Regular backup yarating
cp prod.db prod.db.backup.$(date +%Y%m%d)
```

### 3. SSL/TLS Sertifikati

```bash
# Let's Encrypt orqali (bepul)
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
```

### 4. Firewall Sozlamalari

```bash
# 4000 portini faqat lokal tarafdan qabul qiling
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable
```

---

## 📊 Monitoring va Logs

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Log history
pm2 logs unibot-server

# CPU/Memory stats
pm2 stats
```

### Docker Logs

```bash
# Live logs
docker logs -f unibot-server

# Oxirgi 100 satr
docker logs --tail 100 unibot-server

# Timestamp bilan
docker logs --timestamps unibot-server
```

### UptimeRobot integratsiyasi

1. https://uptimerobot.com ga kiring
2. "Add New Monitor" bosing
3. URL: `https://your-domain.com/health`
4. Interval: 5 daqiqa
5. Save

---

## 🔄 Yangilanish va Restart

### Production Yangilanish

```bash
# 1. Yangi kodlar olish
cd /opt/unibot
git pull origin main

# 2. Dependencies yangilash
npm install

# 3. Database migratsiyalari
npx prisma migrate deploy

# 4. Build
npm run build

# 5. Restart (PM2)
pm2 restart unibot-server

# Yoki Docker orqali
docker-compose down
docker-compose up -d
```

### Rollback (Orqagacha qaytish)

```bash
# Oxirgi version
git revert HEAD

# Yoki specific commit
git checkout <commit-hash>

npm install
npm run build
pm2 restart unibot-server
```

---

## 🐛 Troubleshooting

### Bot ishga tushmayapti

```bash
# 1. Token to'g'ri ekanligini tekshiring
curl -X POST https://api.telegram.org/bot<TOKEN>/getMe

# 2. Logs ko'ring
docker logs unibot-server

# 3. Health endpoint tekshiring
curl http://localhost:4000/health
```

### Database errors

```bash
# SQLite database o'rnatish
npm run prisma:generate
npx prisma db push --force-reset # (Faqat dev uchun!)
```

### Memory leaks

```bash
# PM2 memory monitoring
pm2 monit

# Container restart policy sozlash
docker update --restart unless-stopped unibot-server
```

---

## ✅ Deployment Checklist

- [ ] `.env` faylida barcha kerakli o'zgaruvchilar yozilgan
- [ ] `npm run build` xatosiz bajariladi
- [ ] Database migratsiyalari bajarilgan
- [ ] Health endpoint javob beradi: `http://localhost:4000/health`
- [ ] Bot Telegram API bilan bog'lana oladi
- [ ] Admin panel `localhost:4000` (yoki domain) da ochiladI
- [ ] Logs monitoringni sozladiz
- [ ] Backup strategiyasi mavjud
- [ ] SSL sertifikati (HTTPS) o'rnatilgan
- [ ] Firewall rules sozlandi

---

## 📞 Qo'llaniladigan Resurslar

- Telegram Bot API: https://core.telegram.org/bots/api
- Telegraf.js: https://telegraf.js.org
- Prisma: https://www.prisma.io
- Docker: https://www.docker.com
- Render.com: https://render.com
- UptimeRobot: https://uptimerobot.com

---

**Ishlab chiquvchi:** Antigravity AI  
**Oxirgi yangilash:** 2026-01-07

Agar savollaringiz bo'lsa, GitHub issues orqali murojaat qiling! 🚀
