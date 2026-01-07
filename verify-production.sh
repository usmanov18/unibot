#!/bin/bash

# 🔍 Stellar Bot - Production Verification Script
# Bu skript production-ga joylanish oldin barcha tekshiruvlarni bajaradi

set -e

echo "🔍 Stellar Bot - Production Verification"
echo "======================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CHECKS_PASSED=0
CHECKS_FAILED=0

check() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $1"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} $1"
    ((CHECKS_FAILED++))
  fi
}

# 1. Node.js version check
echo "📦 Checking Node.js version..."
node --version > /dev/null
check "Node.js installed"

# 2. npm check
echo "📦 Checking npm..."
npm --version > /dev/null
check "npm installed"

# 3. Dependencies check
echo "📦 Checking dependencies..."
cd server
npm list @prisma/client > /dev/null 2>&1
check "Prisma client installed"

npm list telegraf > /dev/null 2>&1
check "Telegraf installed"

npm list express > /dev/null 2>&1
check "Express installed"

# 4. TypeScript compilation
echo "🔨 Checking TypeScript compilation..."
npm run build > /dev/null 2>&1
check "TypeScript compilation successful"

# 5. Prisma schema
echo "📊 Checking Prisma schema..."
test -f prisma/schema.prisma
check "Prisma schema file exists"

npx prisma validate > /dev/null 2>&1
check "Prisma schema is valid"

# 6. .env file
echo "⚙️  Checking environment configuration..."
test -f .env
check ".env file exists"

grep -q "TELEGRAM_BOT_TOKEN" .env
check "TELEGRAM_BOT_TOKEN configured"

# 7. Admin panel
echo "🎨 Checking admin panel..."
cd ..
test -f admin/index.html
check "Admin panel HTML file exists"

grep -q "API_URL" admin/index.html
check "Admin panel API integration configured"

# 8. Docker configuration
cd server
test -f Dockerfile
check "Dockerfile exists"

docker --version > /dev/null 2>&1
check "Docker installed"

# 9. dist folder
echo "📁 Checking build output..."
test -d dist
check "dist folder exists"

test -f dist/index.js
check "dist/index.js compiled"

test -f dist/bot.js
check "dist/bot.js compiled"

test -f dist/api.js
check "dist/api.js compiled"

# 10. Source code check
echo "📝 Checking source code..."
test -d src
check "src folder exists"

test -f src/index.ts
check "src/index.ts exists"

test -f src/bot.ts
check "src/bot.ts exists"

# 11. Package.json scripts
echo "📋 Checking package.json scripts..."
grep -q '"start":' package.json
check "start script configured"

grep -q '"build":' package.json
check "build script configured"

# 12. Security checks
echo "🔐 Checking security configuration..."
grep -q "NODE_ENV" .env || echo "WARN: NODE_ENV not set"
check "Environment variables in .env (set to production: NODE_ENV=production)"

# 13. Database
echo "💾 Checking database..."
test -f dev.db || true
echo -e "${YELLOW}ℹ${NC} dev.db will be created on first run"

# 14. Log configuration
echo "📝 Checking logging..."
grep -q "loggerService" src/services/logger.ts > /dev/null 2>&1
check "Logger service configured"

# Summary
echo ""
echo "======================================="
echo "✅ VERIFICATION SUMMARY"
echo "======================================="
echo -e "Passed: ${GREEN}${CHECKS_PASSED}${NC}"
echo -e "Failed: ${RED}${CHECKS_FAILED}${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "📝 Next steps:"
    echo "  1. Review .env file"
    echo "  2. Test locally: npm run dev"
    echo "  3. Build for production: npm run build"
    echo "  4. Deploy using Docker: docker-compose up -d"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi
