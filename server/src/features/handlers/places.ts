import { Context } from 'telegraf';
import { IFeature } from '../manager';

export class PlacesFeature implements IFeature {
  key = 'places';
  name = '📍 Yaqin joylar';
  
  async onCommand(ctx: Context) {
    await ctx.reply('Yaqin joylar funksiyasi ishga tushirildi...');
  }
}
