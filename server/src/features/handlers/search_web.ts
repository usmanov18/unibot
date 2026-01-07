import { Context } from 'telegraf';
import { IFeature } from '../manager';

export class SearchWebFeature implements IFeature {
  name = 'Web Search';
  key = 'search_web';
  isPaid = false;
  description = '🔎 Web qidiruv - har qanday fakt, izoh, solishtirish';

  async onCommand(ctx: Context) {
    const query = (ctx.message as any)?.text?.replace('/search ', '').trim();
    if (!query) {
      await ctx.reply('Qidiruv matni kiriting: /search <so\'z>');
      return;
    }

    await ctx.reply(`🔎 Qidiruv: "${query}"\n\nNatijalar yuklanmoqda...`);

    try {
      // Placeholder: Real API integration bo'ladi
      const results = await this.searchWeb(query);
      
      let response = `📌 Qidiruv natijalari: "${query}"\n\n`;
      results.forEach((result, i) => {
        response += `${i + 1}. **${result.title}**\n${result.snippet}\n[Manbai](${result.link})\n\n`;
      });

      if (results.length === 0) {
        response = `Afsuski, "${query}" uchun natija topilmadi.`;
      }

      await ctx.reply(response, { parse_mode: 'Markdown' });
    } catch (e) {
      await ctx.reply('❌ Qidiruv xatosi: ' + (e instanceof Error ? e.message : 'Noma\'lum xatolik'));
    }
  }

  async onButton(ctx: Context, _data: string) {
    await ctx.reply('Qidiruv uchun so\'z kiriting:');
  }

  private async searchWeb(query: string) {
    // TODO: Real search API (Google, DuckDuckGo, etc)
    return [
      { title: query + ' haqida', snippet: 'Bu " + query + " haqida ma\'lumot', link: 'https://example.com' }
    ];
  }
}
