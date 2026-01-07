import { Context } from 'telegraf';
import { IFeature } from '../manager';

export class PaymentFeature implements IFeature {
  key = 'payment';
  name = '💳 To\'lov';
  
  async onCommand(ctx: Context) {
    await ctx.reply('To\'lov funksiyasi ishga tushirildi...');
  }
}
