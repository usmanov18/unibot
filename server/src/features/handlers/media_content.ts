import { Context } from 'telegraf';
import { IFeature } from '../manager';

export class MediaContentFeature implements IFeature {
  name = 'Media & Content';
  key = 'media_content';
  isPaid = false;
  description = '🎧 Media va kontent - Podcasts, yangiliklar, shaxsiylashtirilgan kontentlar';

  async onCommand(ctx: Context) {
    const query = (ctx.message as any)?.text?.replace('/media ', '').trim();
    
    let response = `🎧 Media va Kontent\n\n`;
    response += `1️⃣ 📻 Podkastlar - Eng yangi episodlar\n`;
    response += `2️⃣ 📰 Yangiliklar - Bugungi top xabarlar\n`;
    response += `3️⃣ 🎵 Musiqalar - Shaxsiylashtirilgan pleylist\n`;
    response += `4️⃣ 📺 Tavsiyalar - Sizga yoqishi mumkin bo'lgan kontentlar\n\n`;
    response += `Tanlang: /media podcasts, /media news, vb.`;

    try {
      if (query.includes('podcast')) {
        await this.getPodcasts(ctx);
      } else if (query.includes('news')) {
        await this.getNews(ctx);
      } else {
        await ctx.reply(response);
      }
    } catch (e) {
      await ctx.reply('❌ Media xatosi: ' + (e instanceof Error ? e.message : 'Noma\'lum xatolik'));
    }
  }

  async onButton(ctx: Context, _data: string) {
    let response = `🎧 Media Tanlang:\n\n`;
    response += `📻 Podkastlar\n`;
    response += `📰 Yangiliklar\n`;
    response += `🎵 Musiqalar\n`;
    await ctx.reply(response);
  }

  private async getPodcasts(ctx: Context) {
    let response = `🎙️ Eng yangi Podkastlar:\n\n`;
    response += `1. 📻 Texnologiya Podcast\n   Episode: ChatGPT va Kelajak\n   Mudda: 45 min\n\n`;
    response += `2. 📻 O'zbekiston Sohatalari\n   Episode: Zamonaviy Ta'lim\n   Mudda: 52 min\n\n`;
    response += `3. 📻 Biznesi Hikoyalari\n   Episode: Startap Yo'llanmasi\n   Mudda: 38 min`;
    await ctx.reply(response);
  }

  private async getNews(ctx: Context) {
    let response = `📰 Bugungi Top Yangiliklar:\n\n`;
    response += `1. 🌐 Dunyoda Nima Sodir Bo'lmaqda?\n   \`2 soat oldin\`\n\n`;
    response += `2. 🏢 Biznes Dunyosidan\n   \`3 soat oldin\`\n\n`;
    response += `3. 🎓 Ta'lim va Fan\n   \`4 soat oldin\``;
    await ctx.reply(response);
  }
}
