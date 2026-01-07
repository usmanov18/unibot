#!/bin/bash

# 🚀 Stellar Bot - Render.com Deploy Helper
# Bu skript GitHub va Render-ga deploy qilishni avtomatlashtirydi

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║  🚀 STELLAR BOT - RENDER.COM DEPLOY HELPER                   ║"
echo "║     24/7 Bepul Hosting uchun                                 ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}❌ Git o'rnatilmagan. Git o'rnatni: https://git-scm.com${NC}"
    exit 1
fi

echo -e "${BLUE}📋 QADAM 1: Git Setup${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if already configured
if git config user.name &> /dev/null; then
    echo "✓ Git user already configured"
    git_user=$(git config user.name)
    echo "  User: $git_user"
else
    echo "Git user configuration kerak:"
    read -p "Email kiriting: " email
    read -p "Ism kiriting: " name
    git config user.email "$email"
    git config user.name "$name"
    echo -e "${GREEN}✓ Git configured${NC}"
fi

echo ""
echo -e "${BLUE}📤 QADAM 2: Kodni GitHub-ga yuborni${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if it's a git repo
if [ ! -d .git ]; then
    echo "Git repo yaratilmoqda..."
    git init
fi

# Check for changes
if git status --porcelain | grep -q .; then
    echo "O'zgarishlar topildi. Commit qilinmoqda..."
    git add .
    
    # Create meaningful commit message
    echo ""
    echo "Commit message kiriting (yoki Enter bosib default foydalaning):"
    read -p "> " commit_msg
    
    if [ -z "$commit_msg" ]; then
        commit_msg="Production deployment to Render.com"
    fi
    
    git commit -m "$commit_msg"
    echo -e "${GREEN}✓ Committed${NC}"
else
    echo "✓ Barcha fayllar commit qilinjandi"
fi

# Check remote
if ! git remote get-url origin &> /dev/null; then
    echo ""
    echo "GitHub repository URL-i kerak:"
    echo "👉 https://github.com/<USERNAME>/<REPO> ko'rinishida"
    read -p "GitHub URL: " github_url
    
    git remote add origin "$github_url"
    echo -e "${GREEN}✓ Remote added${NC}"
else
    github_url=$(git remote get-url origin)
    echo "✓ Remote already configured: $github_url"
fi

# Push to GitHub
echo ""
echo "GitHub-ga push qilinmoqda..."
if git push -u origin main 2>/dev/null; then
    echo -e "${GREEN}✓ GitHub-ga jo'natildi${NC}"
else
    echo -e "${YELLOW}⚠️  Push-da xato. Token-ga murojaat qiling.${NC}"
    echo "GitHub: https://github.com/settings/tokens"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo -e "║ ${GREEN}✅ GITHUB-GA JO'NATILDI${NC}                                        ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

echo ""
echo -e "${BLUE}🌐 QADAM 3: Render.com-da Deploy Qilni${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "Quyidagi bosqichlarni bajaring:"
echo ""
echo "1️⃣  Render.com-ga kiring:"
echo "   🔗 https://render.com"
echo ""
echo "2️⃣  GitHub bilan login qiling"
echo ""
echo "3️⃣  'New Web Service' bosing"
echo ""
echo "4️⃣  GitHub repo-ni ulang: $github_url"
echo ""
echo "5️⃣  Quyidagi konfiguratsiya o'rnatni:"
echo ""
echo "   Build Command:"
echo "   cd server && npm install && npm run prisma:generate && npm run build"
echo ""
echo "   Start Command:"
echo "   cd server && node dist/index.js"
echo ""
echo "6️⃣  Environment Variables qo'shing:"
echo ""
echo "   TELEGRAM_BOT_TOKEN=your_bot_token"
echo "   DATABASE_URL=file:./prod.db"
echo "   NODE_ENV=production"
echo "   PORT=4000"
echo ""
echo "7️⃣  'Create Web Service' bosing"
echo ""
echo "⏱️  5-10 daqiqada deploy bo'ladi"
echo ""

read -p "Boshlashga tayyormisiz? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}Kerakli linkni brauzerda oching:${NC}"
    echo "👉 https://dashboard.render.com"
    echo ""
    
    # Try to open browser if possible
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://dashboard.render.com" &
    elif command -v open &> /dev/null; then
        open "https://dashboard.render.com" &
    fi
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║  📚 BATAFSIL QOLLANMA:                                       ║"
echo "║  👉 RENDER_DEPLOY.md faylini o'qing                         ║"
echo "║                                                               ║"
echo "║  ✅ DEPLOY TUGAGANDAN SO'NG:                                 ║"
echo "║  Bot URL: https://stellar-bot.onrender.com                  ║"
echo "║  Health: https://stellar-bot.onrender.com/health            ║"
echo "║                                                               ║"
echo "║  Telegram-da bot-ga /start yozing                           ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Omadingiz bo'lsin! 🚀"
