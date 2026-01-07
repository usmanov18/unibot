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
  await ctx.reply('Assalomu alaykum! 👋\n\nBizning botga xush kelibsiz. Quyidagi funksiyalardan foydalaning:\n\n🔎 Qidiruv\n🎨 Rasm chizish\n🌤️ Ob-havo\n📈 Moliya\n📍 Yaqin joylar', {
    reply_markup: {
      keyboard: [
        [{ text: '🔎 Qidiruv' }, { text: '🎨 Rasm chizish' }],
        [{ text: '🌤️ Ob-havo' }, { text: '📈 Moliya' }],
        [{ text: '📍 Yaqin joylar' }]
      ],
      resize_keyboard: true
    }
  });
});

// Generic message handler
bot.on('message', async (ctx) => {
  await ctx.reply('Xabar qabul qilindi!');
});

export { bot, featureManager };
