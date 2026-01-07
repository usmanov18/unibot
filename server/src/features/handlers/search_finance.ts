import { Context } from 'telegraf';
import { IFeature } from '../manager';

export class SearchFinanceFeature implements IFeature {
  name = 'Finance Search';
  key = 'search_finance';
  isPaid = true;
  description = '📈 Moliyaviy qidiruv - aksiyalar, kriptovalyutalar, valyuta kurslari';

  async onCommand(ctx: Context) {
    const query = (ctx.message as any)?.text?.replace('/finance ', '').trim();
    if (!query) {
      await ctx.reply('Valyuta juftligini kiriting: /finance <pair>\nMisol: /finance USD/UZS');
      return;
    }

    await ctx.reply(`📈 Moliyaviy ma\'lumot yuklanmoqda: ${query}...`);

    try {
      const rates = await this.getFinanceData(query);
      
      let response = `📊 ${query} Kursi\n\n`;
      response += `💱 Kurs: ${rates.rate} UZS\n`;
      response += `📈 O'zgarish: ${rates.change > 0 ? '+' : ''}${rates.change}%\n`;
      response += `🕐 Yangilandi: ${new Date().toLocaleString('uz-UZ')}\n`;

      if (rates.isPremium) {
        response += `\n⭐ **Premium:** Chuqur tahlil bilan`;
      }

      await ctx.reply(response);
    } catch (e) {
      await ctx.reply('❌ Moliyaviy ma\'lumot xatosi: ' + (e instanceof Error ? e.message : 'Noma\'lum xatolik'));
    }
  }

  async onButton(ctx: Context, _data: string) {
    await ctx.reply('Valyuta juftligini kiriting (masol: EUR/USD, BTC/USD):');
  }

  private async getFinanceData(pair: string) {
    // TODO: Real Finance API (Alpha Vantage, CoinGecko, etc)
    const rate = Math.random() * 10000 + 12000;
    return {
      rate: rate.toFixed(2),
      change: (Math.random() - 0.5) * 10,
      isPremium: true
    };
  }
}
