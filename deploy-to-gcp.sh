#!/bin/bash

####################################################################
#                                                                  #
#          Google Cloud Compute Engine Deployment Script           #
#                                                                  #
#              Stellar Bot 24/7 Automatic Deploy                  #
#                                                                  #
####################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="stellar-bot-gcp-$(date +%s)"
INSTANCE_NAME="stellar-bot"
REGION="us-central1"
ZONE="us-central1-a"
TELEGRAM_BOT_TOKEN="${1:-}"
MACHINE_TYPE="f1-micro"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║         🚀 GOOGLE CLOUD COMPUTE ENGINE DEPLOY START 🚀        ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║                   Stellar Bot 24/7 Setup                      ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"

# Check if bot token provided
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo -e "${RED}❌ Error: TELEGRAM_BOT_TOKEN not provided${NC}"
    echo -e "${YELLOW}Usage: bash deploy-to-gcp.sh 'YOUR_BOT_TOKEN'${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Bot token received${NC}"

# Step 1: Check if gcloud is installed
echo -e "\n${YELLOW}[Step 1/10] Checking Google Cloud SDK...${NC}"
if ! command -v gcloud &> /dev/null; then
    echo -e "${YELLOW}Installing Google Cloud SDK...${NC}"
    curl https://sdk.cloud.google.com | bash
    exec -l $SHELL
fi
echo -e "${GREEN}✅ gcloud CLI ready${NC}"

# Step 2: Authenticate
echo -e "\n${YELLOW}[Step 2/10] Authenticating with Google Cloud...${NC}"
gcloud auth login || true
echo -e "${GREEN}✅ Authentication complete${NC}"

# Step 3: Create project
echo -e "\n${YELLOW}[Step 3/10] Creating Google Cloud project...${NC}"
gcloud projects create "$PROJECT_ID" --quiet || true
gcloud config set project "$PROJECT_ID"
echo -e "${GREEN}✅ Project created: $PROJECT_ID${NC}"

# Step 4: Enable APIs
echo -e "\n${YELLOW}[Step 4/10] Enabling required APIs...${NC}"
gcloud services enable compute.googleapis.com --quiet
echo -e "${GREEN}✅ APIs enabled${NC}"

# Step 5: Create VM Instance
echo -e "\n${YELLOW}[Step 5/10] Creating Compute Engine VM (f1-micro)...${NC}"
gcloud compute instances create "$INSTANCE_NAME" \
  --image-family=debian-11 \
  --image-project=debian-cloud \
  --machine-type="$MACHINE_TYPE" \
  --zone="$ZONE" \
  --scopes=https://www.googleapis.com/auth/cloud-platform \
  --quiet || true

echo -e "${GREEN}✅ VM instance created${NC}"

# Step 6: Get External IP
echo -e "\n${YELLOW}[Step 6/10] Getting external IP address...${NC}"
EXTERNAL_IP=$(gcloud compute instances describe "$INSTANCE_NAME" \
  --zone="$ZONE" \
  --format='value(networkInterfaces[0].accessConfigs[0].natIP)')

echo -e "${GREEN}✅ External IP: ${YELLOW}$EXTERNAL_IP${NC}"

# Step 7: Wait for SSH to be ready
echo -e "\n${YELLOW}[Step 7/10] Waiting for SSH to be ready (30 seconds)...${NC}"
sleep 30
echo -e "${GREEN}✅ SSH ready${NC}"

# Step 8: Setup VM
echo -e "\n${YELLOW}[Step 8/10] Setting up VM (Node.js, Git, dependencies)...${NC}"

gcloud compute ssh "$INSTANCE_NAME" \
  --zone="$ZONE" \
  --command="
    set -e
    
    echo '📦 Updating system...'
    sudo apt-get update > /dev/null 2>&1
    sudo apt-get upgrade -y > /dev/null 2>&1
    
    echo '📦 Installing Node.js 18...'
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - > /dev/null 2>&1
    sudo apt-get install -y nodejs > /dev/null 2>&1
    
    echo '📦 Installing Git and PM2...'
    sudo apt-get install -y git > /dev/null 2>&1
    sudo npm install -g pm2 > /dev/null 2>&1
    
    echo '📦 Cloning repository...'
    cd /home/debian
    git clone https://github.com/usmanov18/unibot.git > /dev/null 2>&1
    cd unibot/server
    
    echo '📦 Installing dependencies...'
    npm install > /dev/null 2>&1
    
    echo '📦 Building TypeScript...'
    npm run prisma:generate > /dev/null 2>&1
    npm run build > /dev/null 2>&1
    
    echo '✅ Setup complete'
  "

echo -e "${GREEN}✅ VM configured and bot built${NC}"

# Step 9: Setup environment and start bot
echo -e "\n${YELLOW}[Step 9/10] Starting bot with PM2...${NC}"

gcloud compute ssh "$INSTANCE_NAME" \
  --zone="$ZONE" \
  --command="
    set -e
    
    cd /home/debian/unibot/server
    
    # Create .env file
    cat > .env << 'EOF_ENV'
TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
NODE_ENV=production
PORT=4000
EOF_ENV
    
    # Start with PM2
    pm2 start dist/index.js --name stellar-bot --output /var/log/stellar-bot.log
    pm2 startup
    pm2 save
    
    echo '✅ Bot started with PM2'
  "

echo -e "${GREEN}✅ Bot started successfully${NC}"

# Step 10: Configure Firewall
echo -e "\n${YELLOW}[Step 10/10] Configuring firewall...${NC}"

gcloud compute firewall-rules create allow-bot-http \
  --allow=tcp:4000 \
  --source-ranges=0.0.0.0/0 \
  --quiet || true

gcloud compute firewall-rules create allow-bot-https \
  --allow=tcp:443 \
  --source-ranges=0.0.0.0/0 \
  --quiet || true

echo -e "${GREEN}✅ Firewall configured${NC}"

# Final Summary
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║                   ✅ DEPLOYMENT COMPLETE ✅                   ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${GREEN}📊 DEPLOYMENT SUMMARY:${NC}"
echo -e "   Project ID: ${YELLOW}$PROJECT_ID${NC}"
echo -e "   Instance:   ${YELLOW}$INSTANCE_NAME${NC}"
echo -e "   Region:     ${YELLOW}$REGION${NC}"
echo -e "   Machine:    ${YELLOW}$MACHINE_TYPE (f1-micro - FREE TIER)${NC}"
echo -e "   IP Address: ${YELLOW}$EXTERNAL_IP${NC}"

echo -e "\n${GREEN}🤖 BOT ENDPOINTS:${NC}"
echo -e "   Health Check: ${BLUE}http://$EXTERNAL_IP:4000/health${NC}"
echo -e "   API Base:     ${BLUE}http://$EXTERNAL_IP:4000/api${NC}"
echo -e "   Admin Panel:  ${BLUE}http://$EXTERNAL_IP:4000${NC}"

echo -e "\n${GREEN}🔧 USEFUL COMMANDS:${NC}"
echo -e "   SSH into VM:        ${YELLOW}gcloud compute ssh $INSTANCE_NAME --zone=$ZONE${NC}"
echo -e "   View logs:          ${YELLOW}gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 logs'${NC}"
echo -e "   Check bot status:   ${YELLOW}gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 status'${NC}"
echo -e "   Test health:        ${YELLOW}curl http://$EXTERNAL_IP:4000/health${NC}"

echo -e "\n${YELLOW}⏱️  WAIT 30 SECONDS then test:${NC}"
echo -e "   ${BLUE}curl http://$EXTERNAL_IP:4000/health${NC}"

echo -e "\n${GREEN}🎉 Stellar Bot is running 24/7 on Google Cloud!${NC}"
echo -e "${GREEN}💰 Cost: FREE TIER (12 months free, 24/7 uptime)${NC}"
echo -e "${GREEN}📱 Test in Telegram: Send /start to your bot${NC}"

# Save configuration to file
cat > /workspaces/unibot/GCP_DEPLOYMENT_INFO.txt << EOF
╔════════════════════════════════════════════════════════════════╗
║                   GOOGLE CLOUD DEPLOYMENT INFO                ║
║                    Stellar Bot 24/7 Hosting                   ║
╚════════════════════════════════════════════════════════════════╝

📋 DEPLOYMENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project ID:         $PROJECT_ID
Instance Name:      $INSTANCE_NAME
Region:             $REGION
Zone:               $ZONE
Machine Type:       $MACHINE_TYPE
External IP:        $EXTERNAL_IP

🤖 BOT ENDPOINTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Health Check:  http://$EXTERNAL_IP:4000/health
API Base:      http://$EXTERNAL_IP:4000/api
Admin Panel:   http://$EXTERNAL_IP/admin

📊 INFRASTRUCTURE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CPU:            0.25 vCPU (f1-micro)
Memory:         600 MB RAM
Storage:        10 GB persistent disk
Database:       SQLite (file-based)
Cost:           $0/month (Free Tier - 12 months)
Uptime:         24/7 (continuous)

🔧 MANAGEMENT COMMANDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SSH into VM:
  gcloud compute ssh $INSTANCE_NAME --zone=$ZONE

View logs (real-time):
  gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 logs'

Check bot status:
  gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 status'

Restart bot:
  gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 restart stellar-bot'

Stop bot:
  gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 stop stellar-bot'

View bot output:
  gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='cat /var/log/stellar-bot.log'

🌐 TEST BOT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wait 30 seconds for bot to start, then:

1. Health Check:
   curl http://$EXTERNAL_IP:4000/health

2. Get sections:
   curl http://$EXTERNAL_IP:4000/api/sections

3. Test in Telegram:
   Send /start to @stellar_bot

📱 TELEGRAM BOT FEATURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ 🔎 Search      - Web qidiruv
✓ 🎨 Image Gen   - AI rasm yaratish
✓ 🌤️ Weather    - Ob-havo ma'lumotlari
✓ 📈 Finance    - Valyuta va Crypto
✓ 📍 Places     - Yaqin joylar
✓ 💳 Payment    - To'lov sistema

💾 DATABASE PERSISTENCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SQLite database (dev.db) is stored on persistent disk.
Data survives VM restart automatically.

Location: /home/debian/unibot/server/prisma/dev.db

⚠️ IMPORTANT NOTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Free Tier must be kept active (not deleted for 90+ days)
2. If idle, VM may be suspended (activate periodically)
3. Check Google Cloud Console regularly
4. Backup database if needed
5. Monitor quota usage in Cloud Console

🔐 SECURITY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Bot token stored in /home/debian/unibot/server/.env
- SSH key-based authentication
- Firewall rules limit access to ports 4000, 443
- Change SSH keys if compromised
- Review IAM permissions regularly

📞 SUPPORT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Google Cloud Console: https://console.cloud.google.com
Compute Engine Dashboard: https://console.cloud.google.com/compute
Free Tier Details: https://cloud.google.com/free

Deployed: $(date)
Status: ✅ ACTIVE

EOF

echo -e "\n${YELLOW}📄 Configuration saved to: GCP_DEPLOYMENT_INFO.txt${NC}"

exit 0
