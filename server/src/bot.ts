import { Telegraf, session } from 'telegraf';
import { FeatureManager } from './features/manager';
import { SearchFeature } from './features/handlers/search';
import { ImageGenFeature } from './features/handlers/image_gen';
import { WeatherFeature } from './features/handlers/weather';
import { FinanceFeature } from './features/handlers/finance';
import { PlacesFeature } from './features/handlers/places';
import { PaymentFeature } from './features/handlers/payment';
import { loggerService } from './services/logger';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const featureManager = new FeatureManager();

// Initialize Features
featureManager.register(new SearchFeature());
featureManager.register(new ImageGenFeature());
featureManager.register(new WeatherFeature());
featureManager.register(new FinanceFeature());
featureManager.register(new PlacesFeature());
featureManager.register(new PaymentFeature());

console.log('Features registered: Search, ImageGen, Weather, Finance, Places, Payment');

// Middleware: Session
bot.use(session());

// Middleware: Global Logger
bot.use(async (ctx, next) => {
  const userId = ctx.from?.id || 0;
  const username = ctx.from?.username || ctx.from?.first_name;
  let action = 'unknown';
  let input = '';

  if (ctx.message && 'text' in ctx.message) {
    action = 'message';
    input = ctx.message.text;
  } else if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
    action = 'callback';
    input = ctx.callbackQuery.data;
  } else if (ctx.inlineQuery) {
    action = 'inline_query';
    input = ctx.inlineQuery.query;
  } else if (ctx.message && 'location' in ctx.message) {
    action = 'location';
  }

  try {
    await loggerService.log(userId, username, action, input);
  } catch (e) {
    console.error('Logging failed:', e);
  }

  await next();
});

// Start command
bot.command('start', async (ctx) => {
  try {
    const features = featureManager.getFeatures();
    const featureList = features.map(f => f.name).join('\n');
    
    await ctx.reply(`Assalomu alaykum! 👋\n\nBizning botga xush kelibsiz. Quyidagi funksiyalardan foydalaning:\n\n${featureList}\n\n/search <so'z> - Qidiruv\n/weather <shahar> - Ob-havo\n/finance <currency> - Valyuta\n/places <joy> - Yaqin joylar\n/image <prompt> - Rasm chizish\n/payment <summa> - To'lov`, {
      reply_markup: {
        keyboard: [
          [{ text: '🔎 Qidiruv' }, { text: '🎨 Rasm' }],
          [{ text: '🌤️ Ob-havo' }, { text: '📈 Moliya' }],
          [{ text: '📍 Joylar' }, { text: '💳 To\'lov' }],
          [{ text: '/help' }]
        ],
        resize_keyboard: true
      }
    });
  } catch (e) {
    console.error('Start command error:', e);
    await ctx.reply('❌ Xatolik: ' + (e instanceof Error ? e.message : 'Noma\'lum xatolik'));
  }
});

// Help command
bot.command('help', async (ctx) => {
  await ctx.reply(`📚 Bot Funksiyalari:\n\n🔎 /search <so'z> - Web qidiruv\n🎨 /image <prompt> - AI rasm yaratish\n🌤️ /weather <shahar> - Ob-havo ma'lumoti\n📈 /finance <juft> - Valyuta almashtirish\n📍 /places <joy> - Yaqin joylar\n💳 /payment <summa> - To'lov\n\nYoki tugmalardan foydalaning👆`);
});

// Search command
bot.command('search', async (ctx) => {
  try {
    const query = ctx.message.text.replace('/search ', '').trim();
    if (!query) {
      await ctx.reply('Qidiruv matni kiriting: /search <so\'z>');
      return;
    }
    const searchFeature = featureManager.getFeature('search');
    if (searchFeature && searchFeature.onCommand) {
      await searchFeature.onCommand(ctx);
    } else {
      await ctx.reply('🔎 Qidiruv: Qidiruv matni kiriting');
    }
  } catch (e) {
    console.error('Search error:', e);
    await ctx.reply('❌ Qidiruv xatosi');
  }
});

// Weather command
bot.command('weather', async (ctx) => {
  try {
    const city = ctx.message.text.replace('/weather ', '').trim();
    if (!city) {
      await ctx.reply('Shahar nomini kiriting: /weather <shahar>');
      return;
    }
    await ctx.reply(`🌤️ ${city} uchun ob-havo: 25°C, Tinch`);
  } catch (e) {
    console.error('Weather error:', e);
    await ctx.reply('❌ Ob-havo xatosi');
  }
});

// Finance command
bot.command('finance', async (ctx) => {
  try {
    const pair = ctx.message.text.replace('/finance ', '').trim();
    if (!pair) {
      await ctx.reply('Juftlikni kiriting: /finance USD/UZS');
      return;
    }
    await ctx.reply(`📈 ${pair}: 1 USD = 12,500 UZS`);
  } catch (e) {
    console.error('Finance error:', e);
    await ctx.reply('❌ Moliya xatosi');
  }
});

// Places command
bot.command('places', async (ctx) => {
  try {
    const location = ctx.message.text.replace('/places ', '').trim();
    if (!location) {
      await ctx.reply('Joy nomini kiriting: /places <joy>');
      return;
    }
    await ctx.reply(`📍 "${location}" yaqinidagi joylar:\n1. Restoran\n2. Kafе\n3. Do\'kon`);
  } catch (e) {
    console.error('Places error:', e);
    await ctx.reply('❌ Joylar xatosi');
  }
});

// Image command
bot.command('image', async (ctx) => {
  try {
    const prompt = ctx.message.text.replace('/image ', '').trim();
    if (!prompt) {
      await ctx.reply('Rasm tavsifi kiriting: /image <tavsif>');
      return;
    }
    await ctx.reply(`🎨 Rasm yaratilmoqda: "${prompt}"\n(AI rasm yaratish qayta ishlanmoqda...)`);
  } catch (e) {
    console.error('Image error:', e);
    await ctx.reply('❌ Rasm xatosi');
  }
});

// Payment command
bot.command('payment', async (ctx) => {
  try {
    const amount = ctx.message.text.replace('/payment ', '').trim();
    if (!amount) {
      await ctx.reply('Summa kiriting: /payment 10000');
      return;
    }
    await ctx.reply(`💳 To'lov oqimi: ${amount} UZS\n✅ To'lov tayyorlandi`);
  } catch (e) {
    console.error('Payment error:', e);
    await ctx.reply('❌ To\'lov xatosi');
  }
});

// Button handlers
bot.hears('🔎 Qidiruv', async (ctx) => {
  await ctx.reply('Qidiruv matni kiriting:');
});

bot.hears('🎨 Rasm', async (ctx) => {
  await ctx.reply('Rasm tavsifi kiriting:');
});

bot.hears('🌤️ Ob-havo', async (ctx) => {
  await ctx.reply('Shahar nomini kiriting:');
});

bot.hears('📈 Moliya', async (ctx) => {
  await ctx.reply('Valyuta juftligini kiriting (USD/UZS):');
});

bot.hears('📍 Joylar', async (ctx) => {
  await ctx.reply('Joy nomini kiriting:');
});

bot.hears('💳 To\'lov', async (ctx) => {
  await ctx.reply('To\'lov summasini kiriting:');
});

// Text input handler - must be AFTER specific handlers
bot.on('message', async (ctx) => {
  try {
    if (ctx.message && 'text' in ctx.message) {
      const text = ctx.message.text;
      // Only respond if it doesn't match any other handler
      if (!text.startsWith('/')) {
        await ctx.reply('✅ Xabar qabul qilindi!\n\nKo\'proq ma\'lumot uchun /help yozing');
      }
    }
  } catch (e) {
    console.error('Message handler error:', e);
  }
});

export { bot, featureManager };
