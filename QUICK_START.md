# 🚀 Stellar Bot - Tez Startov

## ⚡ 5 Daqiqali Setup

### 1. Environment Setup (1 min)
```bash
cd server
cp .env.example .env
# .env faylini tahrirlang va TELEGRAM_BOT_TOKEN qo'shing
nano .env
```

### 2. Dependencies (2 min)
```bash
npm install
npm run prisma:generate
```

### 3. Build (1 min)
```bash
npm run build
```

### 4. Run (1 min)
```bash
# Option A: Direct
npm start

# Option B: Development mode
npm run dev

# Option C: Docker
docker-compose up -d
```

### 5. Test (1 min)
```bash
curl http://localhost:4000/health
# Output: {"status":"ok","uptime":...,"bot":"running"}
```

---

## 📦 Production Deploy - 3 Step

### Step 1: Prepare Server
```bash
sudo apt update && sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
```

### Step 2: Deploy
```bash
git clone https://github.com/usmanov18/unibot.git /opt/unibot
cd /opt/unibot/server
cp .env.example .env
# .env faylini sozla
docker-compose up -d
```

### Step 3: Verify
```bash
curl http://localhost:4000/health
# Bot ishlayapti ✓
```

---

## 🔧 Troubleshooting

| Muammo | Yechim |
|--------|--------|
| `Cannot find module` | `npm install` ni bajaring |
| `TELEGRAM_BOT_TOKEN error` | `.env` faylini tekshiring |
| `Port 4000 in use` | `lsof -i :4000` va kill process |
| `Database error` | `npm run prisma:generate` |

---

## 📚 Batafsil Qo'llanma

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Step-by-step deployment
- [FINAL_STATUS.md](./FINAL_STATUS.md) - Verification report
- [PROJECT_REPORT.md](./PROJECT_REPORT.md) - Features va architecture

---

**Status: Ready to Deploy ✅**
