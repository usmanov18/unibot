import { Context } from 'telegraf';
import { IFeature } from '../manager';

// Placeholder feature handlers - Full implementation in dist/
export class SearchFeature implements IFeature {
  key = 'search';
  name = '🔎 Qidiruv';
  
  async onCommand(ctx: Context) {
    await ctx.reply('Qidiruv funksiyasi ishga tushirildi...');
  }
}

export class ImageGenFeature implements IFeature {
  key = 'image_gen';
  name = '🎨 Grafik';
  
  async onCommand(ctx: Context) {
    await ctx.reply('Rasm chizish funksiyasi ishga tushirildi...');
  }
}

export class WeatherFeature implements IFeature {
  key = 'weather';
  name = '🌤️ Ob-havo';
  
  async onCommand(ctx: Context) {
    await ctx.reply('Ob-havo funksiyasi ishga tushirildi...');
  }
}

export class FinanceFeature implements IFeature {
  key = 'finance';
  name = '📈 Moliya';
  
  async onCommand(ctx: Context) {
    await ctx.reply('Moliya funksiyasi ishga tushirildi...');
  }
}

export class PlacesFeature implements IFeature {
  key = 'places';
  name = '📍 Yaqin joylar';
  
  async onCommand(ctx: Context) {
    await ctx.reply('Yaqin joylar funksiyasi ishga tushirildi...');
  }
}

export class PaymentFeature implements IFeature {
  key = 'payment';
  name = '💳 To\'lov';
  
  async onCommand(ctx: Context) {
    await ctx.reply('To\'lov funksiyasi ishga tushirildi...');
  }
}
