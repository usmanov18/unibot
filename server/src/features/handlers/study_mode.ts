import { Context } from 'telegraf';
import { IFeature } from '../manager';

export class StudyModeFeature implements IFeature {
  name = 'Study Mode';
  key = 'study_mode';
  isPaid = false;
  description = '📚 O\'quv rejimi - bosqichma-bosqich o\'rganish, savol-javob, misollar';

  async onCommand(ctx: Context) {
    const topic = (ctx.message as any)?.text?.replace('/study ', '').trim();
    if (!topic) {
      await ctx.reply('Mavzuni kiriting: /study <mavzu>\nMisol: /study Fizika Asoslari');
      return;
    }

    await ctx.reply(`📚 "${topic}" o\'rganishni boshlaylik...\n\n1️⃣ Asosiy tushunchalar\n2️⃣ Chuqur o\'rganish\n3️⃣ Misollar\n4️⃣ Test\n\nKeyingi bosqichga o\'tish: /study-next`);

    try {
      const lesson = await this.getLesson(topic);
      
      let response = `📖 **${topic}**\n\n`;
      response += `${lesson.introduction}\n\n`;
      response += `🎯 Asosiy nuqtalar:\n`;
      lesson.points.forEach(point => {
        response += `• ${point}\n`;
      });
      response += `\n📝 Misol:\n${lesson.example}`;

      await ctx.reply(response, { parse_mode: 'Markdown' });
    } catch (e) {
      await ctx.reply('❌ O\'quv xatosi: ' + (e instanceof Error ? e.message : 'Noma\'lum xatolik'));
    }
  }

  async onButton(ctx: Context, _data: string) {
    await ctx.reply('O\'rganish uchun mavzuni kiriting:');
  }

  private async getLesson(topic: string) {
    // TODO: Real Learning Content API
    return {
      introduction: topic + ' bu muhim mavzu bo\'lib, quyidagi tushunchalarni o\'z ichiga oladi.',
      points: [
        'Birinchi tushuncha: ' + topic + ' nima?',
        'Ikkinchi tushuncha: Qanday ishlatiladi?',
        'Uchinchi tushuncha: Haqiqiy dunoda qo\'llanilishi'
      ],
      example: `${topic} ga misol:\n- Tasvir 1\n- Tasvir 2`
    };
  }
}
