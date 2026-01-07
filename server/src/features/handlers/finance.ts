import { Context } from 'telegraf';
import { IFeature } from '../manager';

export class FinanceFeature implements IFeature {
  key = 'finance';
  name = '📈 Moliya';
  
  async onCommand(ctx: Context) {
    await ctx.reply('Moliya funksiyasi ishga tushirildi...');
  }
}
