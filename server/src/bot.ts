import { Telegraf, session } from 'telegraf';
import { Context } from 'telegraf';
import { FeatureManager } from './features/manager';
import { SearchFeature } from './features/handlers/search';
import { ImageGenFeature } from './features/handlers/image_gen';
import { WeatherFeature } from './features/handlers/weather';
import { FinanceFeature } from './features/handlers/finance';
import { PlacesFeature } from './features/handlers/places';
import { PaymentFeature } from './features/handlers/payment';
import { SearchWebFeature } from './features/handlers/search_web';
import { SearchFinanceFeature } from './features/handlers/search_finance';
import { SearchPlacesFeature } from './features/handlers/search_places';
import { SearchImagesFeature } from './features/handlers/search_images';
import { SearchVideosFeature } from './features/handlers/search_videos';
import { GraphicArtFeature } from './features/handlers/graphic_art';
import { StudyModeFeature } from './features/handlers/study_mode';
import { DocumentManagementFeature } from './features/handlers/document_management';
import { VoiceAssistantFeature } from './features/handlers/voice_assistant';
import { MediaContentFeature } from './features/handlers/media_content';
import { UserMemoryFeature } from './features/handlers/user_memory';
import { loggerService } from './services/logger';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const featureManager = new FeatureManager();

// Initialize All Features (17 total)
const features = [
  new SearchFeature(),
  new SearchWebFeature(),
  new SearchFinanceFeature(),
  new SearchPlacesFeature(),
  new SearchImagesFeature(),
  new SearchVideosFeature(),
  new ImageGenFeature(),
  new GraphicArtFeature(),
  new WeatherFeature(),
  new FinanceFeature(),
  new PlacesFeature(),
  new PaymentFeature(),
  new StudyModeFeature(),
  new DocumentManagementFeature(),
  new VoiceAssistantFeature(),
  new MediaContentFeature(),
  new UserMemoryFeature()
];

features.forEach(f => featureManager.register(f));
console.log(`✅ Features registered (${features.length} total)`);

// Middleware: Session
bot.use(session());

// Middleware: Global Logger & Analytics
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
  } else if (ctx.message && 'voice' in ctx.message) {
    action = 'voice_message';
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

// ============= MAIN MENU COMMANDS =============

bot.command('start', async (ctx) => {
  try {
    await ctx.reply(
      `👋 Assalomu alaykum! ${ctx.from?.first_name || 'Foydalanuvchi'}\n\n` +
      `🤖 Yangilashtirilgan AI Bot - Barcha Xizmatlar Bilan\n\n` +
      `Quyidagi xizmatlardan foydalanishingiz mumkin:\n\n` +
      `🔎 **Qidiruv:** Web, Moliya, Joylar, Rasmlar, Videolar\n` +
      `🎨 **Grafika:** AI Rasmlar, Diagrammalar\n` +
      `📚 **Ta'lim:** Bepul O'quv, Qo'shimcha Tahlil\n` +
      `📄 **Hujjatlar:** Sahifalar, Export\n` +
      `🛒 **Savdo:** Narx Kuzatuvi, Cashback\n` +
      `🗣️ **Ovozli:** Ovozli Suhbat\n` +
      `🎧 **Media:** Podkastlar, Yangiliklar\n` +
      `🧠 **Xotira:** Shaxsiylashtirilgan Ma'lumot\n\n` +
      `Tugmalardan foydalanib boshlang 👇`,
      {
        reply_markup: {
          keyboard: [
            ['🔎 Qidiruv', '🎨 Grafika'],
            ['📚 Ta\'lim', '📄 Hujjatlar'],
            ['🛒 Savdo', '🗣️ Ovozli'],
            ['🎧 Media', '🧠 Xotira'],
            ['⚙️ Sozlamalar', '❓ Yordam']
          ],
          resize_keyboard: true
        }
      }
    );
  } catch (e) {
    console.error('Start command error:', e);
    await ctx.reply('❌ Xatolik');
  }
});

bot.command('help', async (ctx) => {
  const helpText = `🔎 Web qidiruv
📊 Moliyaviy tahlil
📍 Joylar qidiruvi
📸 Rasm qidiruvi
🎥 Video qidiruvi
🎨 AI Rasm yaratish
📚 O'quv rejimi
📄 Hujjat boshqaruvi
🛒 Savdo va shopping
🗣️ Ovozli suhbat
🎧 Media va kontent
🧠 Xotira va personalizatsiya`;
  await ctx.reply(helpText);
});

// ============= MAIN FEATURES COMMANDS =============

bot.command('search', async (ctx) => {
  try {
    const query = ctx.message?.text?.replace('/search ', '').trim() || '';
    if (!query) {
      await ctx.reply('Qidiruv matni kiriting: /search <so\'z>');
      return;
    }
    const feature = featureManager.getFeature('search');
    if (feature?.onCommand) await feature.onCommand(ctx);
  } catch (e) {
    await ctx.reply('❌ Qidiruv xatosi');
  }
});

bot.command('finance', async (ctx) => {
  try {
    const query = ctx.message?.text?.replace('/finance ', '').trim() || '';
    if (!query) {
      await ctx.reply('Valyuta juftligini kiriting: /finance USD/UZS');
      return;
    }
    const feature = featureManager.getFeature('search_finance');
    if (feature?.onCommand) await feature.onCommand(ctx);
  } catch (e) {
    await ctx.reply('❌ Moliya xatosi');
  }
});

bot.command('places', async (ctx) => {
  try {
    const query = ctx.message?.text?.replace('/places ', '').trim() || '';
    if (!query) {
      await ctx.reply('Joy nomini kiriting: /places <joy>');
      return;
    }
    const feature = featureManager.getFeature('search_places');
    if (feature?.onCommand) await feature.onCommand(ctx);
  } catch (e) {
    await ctx.reply('❌ Joylar xatosi');
  }
});

bot.command('art', async (ctx) => {
  try {
    const prompt = ctx.message?.text?.replace('/art ', '').trim() || '';
    if (!prompt) {
      await ctx.reply('Rasm tavsifi kiriting: /art <tavsif>');
      return;
    }
    const feature = featureManager.getFeature('graphic_art');
    if (feature?.onCommand) await feature.onCommand(ctx);
  } catch (e) {
    await ctx.reply('❌ Rasm xatosi');
  }
});

bot.command('study', async (ctx) => {
  try {
    const topic = ctx.message?.text?.replace('/study ', '').trim() || '';
    if (!topic) {
      await ctx.reply('Mavzuni kiriting: /study <mavzu>');
      return;
    }
    const feature = featureManager.getFeature('study_mode');
    if (feature?.onCommand) await feature.onCommand(ctx);
  } catch (e) {
    await ctx.reply('❌ O\'quv xatosi');
  }
});

bot.command('docs', async (ctx) => {
  try {
    const feature = featureManager.getFeature('document_management');
    if (feature?.onCommand) await feature.onCommand(ctx);
  } catch (e) {
    await ctx.reply('❌ Hujjat xatosi');
  }
});

bot.command('memory', async (ctx) => {
  try {
    const feature = featureManager.getFeature('user_memory');
    if (feature?.onCommand) await feature.onCommand(ctx);
  } catch (e) {
    await ctx.reply('❌ Xotira xatosi');
  }
});

bot.command('media', async (ctx) => {
  try {
    const feature = featureManager.getFeature('media_content');
    if (feature?.onCommand) await feature.onCommand(ctx);
  } catch (e) {
    await ctx.reply('❌ Media xatosi');
  }
});

// ============= BUTTON HANDLERS =============

bot.hears('🔎 Qidiruv', async (ctx) => {
  await ctx.reply('🔎 Qidiruv bo\'limi', {
    reply_markup: {
      keyboard: [
        ['🌐 Web', '📸 Rasmlar'],
        ['🎥 Videolar', '📊 Moliya'],
        ['📍 Joylar', '⬅️ Orqaga']
      ],
      resize_keyboard: true
    }
  });
});

bot.hears('🎨 Grafika', async (ctx) => {
  await ctx.reply('🎨 Grafika va vizual bo\'limi', {
    reply_markup: {
      keyboard: [
        ['✨ AI Rasm', '📊 Diagramma'],
        ['⬅️ Orqaga']
      ],
      resize_keyboard: true
    }
  });
});

bot.hears('📚 Ta\'lim', async (ctx) => {
  await ctx.reply('📚 Ta\'lim va o\'quva bo\'limi', {
    reply_markup: {
      keyboard: [
        ['📖 O\'quv', '❓ Test'],
        ['📇 Flashcard', '⬅️ Orqaga']
      ],
      resize_keyboard: true
    }
  });
});

bot.hears('📄 Hujjatlar', async (ctx) => {
  await ctx.reply('📄 Hujjat boshqaruvi bo\'limi', {
    reply_markup: {
      keyboard: [
        ['✏️ Yangi', '📋 Ro\'yxat'],
        ['💾 Saqlash', '⬅️ Orqaga']
      ],
      resize_keyboard: true
    }
  });
});

bot.hears('🛒 Savdo', async (ctx) => {
  await ctx.reply('🛒 Savdo va shopping bo\'limi', {
    reply_markup: {
      keyboard: [
        ['💰 Narx', '💳 Cashback'],
        ['⬅️ Orqaga']
      ],
      resize_keyboard: true
    }
  });
});

bot.hears('🗣️ Ovozli', async (ctx) => {
  await ctx.reply('🗣️ Ovozli xizmatlar bo\'limi', {
    reply_markup: {
      keyboard: [
        ['🎤 Suhbat', '🎙️ Diktofon'],
        ['⬅️ Orqaga']
      ],
      resize_keyboard: true
    }
  });
});

bot.hears('🎧 Media', async (ctx) => {
  await ctx.reply('🎧 Media va kontent bo\'limi', {
    reply_markup: {
      keyboard: [
        ['🎙️ Podkastlar', '📰 Yangiliklar'],
        ['⬅️ Orqaga']
      ],
      resize_keyboard: true
    }
  });
});

bot.hears('🧠 Xotira', async (ctx) => {
  await ctx.reply('🧠 Xotira va shaxsiylashtirilgan ma\'lumot', {
    reply_markup: {
      keyboard: [
        ['➕ Yangi', '📋 Ro\'yxat'],
        ['🔄 Eslatish', '⬅️ Orqaga']
      ],
      resize_keyboard: true
    }
  });
});

bot.hears('⚙️ Sozlamalar', async (ctx) => {
  await ctx.reply('⚙️ Sozlamalar', {
    reply_markup: {
      keyboard: [
        ['🌙 Tungi', '🌞 Kunduzgi'],
        ['🇺🇿 O\'zbekcha', '🇬🇧 English'],
        ['⬅️ Orqaga']
      ],
      resize_keyboard: true
    }
  });
});

bot.hears('❓ Yordam', async (ctx) => {
  await ctx.reply('❓ Yordam va qo\'llab-qo\'vlash\n\nEmail: support@stellarbot.uz\nTelegram: @StellarBotChanneli');
});

// ============= VOICE HANDLER =============

bot.on('voice', async (ctx) => {
  try {
    const feature = featureManager.getFeature('voice_assistant');
    if (feature?.onVoice) {
      await feature.onVoice(ctx);
    }
  } catch (e) {
    console.error('Voice error:', e);
    await ctx.reply('❌ Ovozni qayta ishlashda xatolik');
  }
});

// ============= TEXT INPUT HANDLER (MUST BE LAST) =============

bot.on('message', async (ctx) => {
  try {
    if (ctx.message && 'text' in ctx.message) {
      const text = ctx.message.text;
      
      // Skip if it's a command
      if (text?.startsWith('/')) return;
      
      // Generic response
      await ctx.reply('✅ Xabarini qabul qildim!\n\nTugmalardan foydalaning yoki /help yozing');
    }
  } catch (e) {
    console.error('Message handler error:', e);
  }
});

export { bot, featureManager };
