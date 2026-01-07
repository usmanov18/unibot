import { Context } from 'telegraf';
import { IFeature } from '../manager';

export class WeatherFeature implements IFeature {
  key = 'weather';
  name = '🌤️ Ob-havo';
  
  async onCommand(ctx: Context) {
    await ctx.reply('Ob-havo funksiyasi ishga tushirildi...');
  }
}
