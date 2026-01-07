import { Context } from 'telegraf';
import { IFeature } from '../manager';

export class SearchVideosFeature implements IFeature {
  name = 'Video Search';
  key = 'search_videos';
  isPaid = false;
  description = '🎥 Videolar qidiruvi - YouTube, TikTok, Twitch';

  async onCommand(ctx: Context) {
    const query = (ctx.message as any)?.text?.replace('/video-search ', '').trim();
    if (!query) {
      await ctx.reply('Video uchun so\'z kiriting: /video-search <so\'z>\nMisol: /video-search Uzbek musiqasi');
      return;
    }

    await ctx.reply(`🎥 "${query}" videolarini qidiryapman...`);

    try {
      const videos = await this.searchVideos(query);
      
      let response = `🎬 "${query}" video natijalari (${videos.length} ta):\n\n`;
      videos.forEach((vid, i) => {
        response += `${i + 1}. **${vid.title}**\n`;
        response += `👤 ${vid.channel}\n`;
        response += `⏱️ Davomiyligi: ${vid.duration}\n`;
        response += `🔗 [Ochish](${vid.link})\n\n`;
      });

      await ctx.reply(response, { parse_mode: 'Markdown' });
    } catch (e) {
      await ctx.reply('❌ Video qidiruv xatosi: ' + (e instanceof Error ? e.message : 'Noma\'lum xatolik'));
    }
  }

  async onButton(ctx: Context, _data: string) {
    await ctx.reply('Video uchun so\'z kiriting:');
  }

  private async searchVideos(query: string) {
    // TODO: Real Video API (YouTube Data API, Twitch API, etc)
    return [
      { title: query + ' - Video 1', channel: 'Kanal Nomi', duration: '10:45', link: 'https://youtube.com/watch?v=1' },
      { title: query + ' - Video 2', channel: 'Boshqa Kanal', duration: '8:30', link: 'https://youtube.com/watch?v=2' }
    ];
  }
}
