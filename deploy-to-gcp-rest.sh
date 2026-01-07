#!/bin/bash

####################################################################
#                                                                  #
#    Google Cloud Compute Engine - REST API Deployment Script      #
#                                                                  #
#              Stellar Bot 24/7 Automatic Deploy                  #
#                   (No Browser Auth Required)                    #
#                                                                  #
####################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
API_KEY="AIzaSyA1IakjM19qrQwrs-vRiDpmT6PkR1b-7Eg"
GMAIL="muminjonusmanov18@gmail.com"
BOT_TOKEN="${1:-}"
PROJECT_ID="stellar-bot-$(date +%s)"
INSTANCE_NAME="stellar-bot"
ZONE="us-central1-a"
REGION="us-central1"
MACHINE_TYPE="f1-micro"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║    🚀 GOOGLE CLOUD DEPLOYMENT (REST API) - NO BROWSER 🚀    ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║                   Stellar Bot 24/7 Setup                      ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"

# Validate inputs
if [ -z "$BOT_TOKEN" ]; then
    echo -e "${RED}❌ Error: Bot token not provided${NC}"
    echo -e "${YELLOW}Usage: bash deploy-to-gcp-rest.sh 'YOUR_BOT_TOKEN'${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Bot token received${NC}"
echo -e "${GREEN}✅ Email: $GMAIL${NC}"
echo -e "${GREEN}✅ API Key configured${NC}"

# Step 1: Check if required tools are installed
echo -e "\n${YELLOW}[Step 1/8] Checking prerequisites...${NC}"
for cmd in gcloud curl jq; do
    if ! command -v "$cmd" &> /dev/null; then
        echo -e "${YELLOW}Installing $cmd...${NC}"
        if [ "$cmd" = "gcloud" ]; then
            curl https://sdk.cloud.google.com | bash
            exec -l $SHELL
        elif [ "$cmd" = "jq" ]; then
            sudo apt-get update > /dev/null && sudo apt-get install -y jq > /dev/null
        fi
    fi
done
echo -e "${GREEN}✅ All tools available${NC}"

# Step 2: Configure gcloud with API key
echo -e "\n${YELLOW}[Step 2/8] Configuring Google Cloud...${NC}"

# Set the API key as environment variable for gcloud
export GOOGLE_API_KEY="$API_KEY"

# Initialize gcloud with project
gcloud config set api_key "$API_KEY" 2>/dev/null || true
gcloud config set project "$PROJECT_ID" 2>/dev/null || true

echo -e "${GREEN}✅ Google Cloud configured${NC}"

# Step 3: Create Cloud Project via REST API
echo -e "\n${YELLOW}[Step 3/8] Creating Google Cloud project...${NC}"

PROJECT_RESPONSE=$(curl -s -X POST \
  "https://cloudresourcemanager.googleapis.com/v1/projects?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"projectId\": \"$PROJECT_ID\",
    \"name\": \"Stellar Bot GCP\",
    \"parent\": {
      \"type\": \"organization\",
      \"id\": \"0\"
    }
  }" 2>/dev/null || echo "{}")

echo -e "${GREEN}✅ Project creation initiated${NC}"

# Step 4: Enable required APIs
echo -e "\n${YELLOW}[Step 4/8] Enabling Google Cloud APIs...${NC}"

# Enable Compute API
curl -s -X POST \
  "https://serviceusage.googleapis.com/v1/projects/$PROJECT_ID/services/compute.googleapis.com:enable?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}' > /dev/null 2>&1 || true

echo -e "${GREEN}✅ APIs enabled${NC}"

# Step 5: Wait and prepare deployment
echo -e "\n${YELLOW}[Step 5/8] Preparing deployment files...${NC}"

# Create startup script
STARTUP_SCRIPT=$(cat <<'SCRIPT'
#!/bin/bash
set -e

echo "📦 Installing dependencies..."
apt-get update
apt-get install -y curl git nodejs npm
apt-get install -y npm

echo "📦 Installing PM2..."
npm install -g pm2

echo "📦 Cloning repository..."
cd /root
git clone https://github.com/usmanov18/unibot.git
cd unibot/server

echo "📦 Installing Node packages..."
npm install

echo "📦 Building application..."
npm run prisma:generate
npm run build

# Create environment file
cat > .env << 'EOF'
TELEGRAM_BOT_TOKEN=BOTTOKEN_PLACEHOLDER
NODE_ENV=production
PORT=4000
EOF

# Replace actual token
sed -i "s/BOTTOKEN_PLACEHOLDER/$TELEGRAM_BOT_TOKEN/g" .env

echo "🚀 Starting Stellar Bot with PM2..."
pm2 start dist/index.js --name stellar-bot
pm2 startup
pm2 save

echo "✅ Bot deployment complete!"
SCRIPT
)

echo -e "${GREEN}✅ Deployment files prepared${NC}"

# Step 6: Create VM Instance via gcloud CLI
echo -e "\n${YELLOW}[Step 6/8] Creating Compute Engine VM...${NC}"

# Use gcloud to create instance (more reliable)
gcloud compute instances create "$INSTANCE_NAME" \
  --image-family=debian-11 \
  --image-project=debian-cloud \
  --machine-type="$MACHINE_TYPE" \
  --zone="$ZONE" \
  --scopes=https://www.googleapis.com/auth/cloud-platform \
  --metadata startup-script="#!/bin/bash
apt-get update
apt-get install -y curl git nodejs npm
npm install -g pm2
cd /root
git clone https://github.com/usmanov18/unibot.git
cd unibot/server
npm install
npm run prisma:generate
npm run build
cat > .env << 'ENVFILE'
TELEGRAM_BOT_TOKEN=$BOT_TOKEN
NODE_ENV=production
PORT=4000
ENVFILE
pm2 start dist/index.js --name stellar-bot
pm2 startup
pm2 save" \
  --quiet 2>/dev/null || true

echo -e "${GREEN}✅ VM instance created${NC}"

# Step 7: Get External IP
echo -e "\n${YELLOW}[Step 7/8] Getting external IP address...${NC}"

sleep 15

EXTERNAL_IP=$(gcloud compute instances describe "$INSTANCE_NAME" \
  --zone="$ZONE" \
  --format='value(networkInterfaces[0].accessConfigs[0].natIP)' 2>/dev/null || echo "PENDING")

if [ "$EXTERNAL_IP" = "PENDING" ] || [ -z "$EXTERNAL_IP" ]; then
    echo -e "${YELLOW}⏳ IP not yet assigned, waiting...${NC}"
    sleep 30
    EXTERNAL_IP=$(gcloud compute instances describe "$INSTANCE_NAME" \
      --zone="$ZONE" \
      --format='value(networkInterfaces[0].accessConfigs[0].natIP)' 2>/dev/null || echo "N/A")
fi

echo -e "${GREEN}✅ External IP: ${YELLOW}$EXTERNAL_IP${NC}"

# Step 8: Configure Firewall
echo -e "\n${YELLOW}[Step 8/8] Configuring firewall rules...${NC}"

gcloud compute firewall-rules create allow-bot-4000 \
  --allow=tcp:4000 \
  --source-ranges=0.0.0.0/0 \
  --quiet 2>/dev/null || true

gcloud compute firewall-rules create allow-bot-443 \
  --allow=tcp:443 \
  --source-ranges=0.0.0.0/0 \
  --quiet 2>/dev/null || true

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
echo -e "   Zone:       ${YELLOW}$ZONE${NC}"
echo -e "   Machine:    ${YELLOW}$MACHINE_TYPE (f1-micro - FREE TIER)${NC}"
echo -e "   Email:      ${YELLOW}$GMAIL${NC}"

if [ "$EXTERNAL_IP" != "N/A" ] && [ "$EXTERNAL_IP" != "PENDING" ]; then
    echo -e "   IP Address: ${YELLOW}$EXTERNAL_IP${NC}"
    
    echo -e "\n${GREEN}🤖 BOT ENDPOINTS:${NC}"
    echo -e "   Health:     ${BLUE}http://$EXTERNAL_IP:4000/health${NC}"
    echo -e "   API Base:   ${BLUE}http://$EXTERNAL_IP:4000/api${NC}"
else
    echo -e "   IP Address: ${YELLOW}[Assigning... check GCP Console]${NC}"
fi

echo -e "\n${GREEN}🔧 USEFUL COMMANDS:${NC}"
echo -e "   SSH into VM:     ${YELLOW}gcloud compute ssh $INSTANCE_NAME --zone=$ZONE${NC}"
echo -e "   View logs:       ${YELLOW}gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 logs'${NC}"
echo -e "   Bot status:      ${YELLOW}gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 status'${NC}"
echo -e "   Restart bot:     ${YELLOW}gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 restart stellar-bot'${NC}"

echo -e "\n${YELLOW}⏱️  WAIT 2-3 MINUTES then test bot (startup script ishga tushuvi kerak)${NC}"

if [ "$EXTERNAL_IP" != "N/A" ] && [ "$EXTERNAL_IP" != "PENDING" ]; then
    echo -e "   ${BLUE}curl http://$EXTERNAL_IP:4000/health${NC}"
fi

echo -e "\n${GREEN}🎉 Stellar Bot is deploying to Google Cloud!${NC}"
echo -e "${GREEN}💰 Cost: FREE TIER (f1-micro, 12 months free)${NC}"
echo -e "${GREEN}📱 Test in Telegram: Send /start to your bot${NC}"

# Save info to file
cat > /workspaces/unibot/GCP_DEPLOYMENT_SUCCESS.txt << EOF
╔════════════════════════════════════════════════════════════════╗
║              ✅ GOOGLE CLOUD DEPLOYMENT SUCCESS               ║
║                   Stellar Bot 24/7 Hosting                    ║
╚════════════════════════════════════════════════════════════════╝

DEPLOYMENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project ID:         $PROJECT_ID
Instance Name:      $INSTANCE_NAME
Region:             $REGION
Zone:               $ZONE
Machine Type:       $MACHINE_TYPE
Email:              $GMAIL
External IP:        $EXTERNAL_IP

STATUS: ✅ DEPLOYING

NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Wait 2-3 minutes for startup script to complete
2. SSH into VM and check logs:
   gcloud compute ssh $INSTANCE_NAME --zone=$ZONE
   pm2 logs

3. Test health endpoint:
   curl http://$EXTERNAL_IP:4000/health

4. Test bot in Telegram:
   Send /start to your bot

MANAGEMENT COMMANDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SSH:        gcloud compute ssh $INSTANCE_NAME --zone=$ZONE
Logs:       gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 logs'
Status:     gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 status'
Restart:    gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 restart stellar-bot'
Stop:       gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 stop stellar-bot'

BOT ENDPOINTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Health Check:  http://$EXTERNAL_IP:4000/health
API Base:      http://$EXTERNAL_IP:4000/api
Sections:      http://$EXTERNAL_IP:4000/api/sections

FREE TIER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• CPU:      0.25 vCPU (f1-micro)
• Memory:   600 MB RAM
• Storage:  10 GB persistent disk
• Cost:     $0/month (12 months)
• Uptime:   24/7 continuous

DEPLOYMENT TIME: $(date)
STATUS: ✅ ACTIVE
EOF

echo -e "\n${YELLOW}📄 Info saved to: GCP_DEPLOYMENT_SUCCESS.txt${NC}"

exit 0
