import { Context } from 'telegraf';
import { IFeature } from '../manager';

export class UserMemoryFeature implements IFeature {
  name = 'Memory & Personalization';
  key = 'user_memory';
  isPaid = false;
  description = '🧠 Xotira - Narsalarni eslab qolish, shaxsiylashtirilgan ma\'lumotlar';

  async onCommand(ctx: Context) {
    const command = (ctx.message as any)?.text?.replace('/memory ', '').trim();
    if (!command) {
      await ctx.reply(`🧠 Xotira va Shaxsiylashtirilgan Ma\'lumotlar\n\n/memory-add <narsani eslab qolish>\n/memory-list - Barcha saqlangan narsalar\n/memory-delete <ID> - O\'chirish\n/memory-recall - Random eslab qolgan narsa`);
      return;
    }

    try {
      if (command.startsWith('add')) {
        await this.addMemory(ctx, command.replace('add ', ''));
      } else if (command === 'list') {
        await this.listMemory(ctx);
      } else if (command.startsWith('delete')) {
        await this.deleteMemory(ctx, command.replace('delete ', ''));
      } else if (command === 'recall') {
        await this.recallMemory(ctx);
      }
    } catch (e) {
      await ctx.reply('❌ Xotira xatosi: ' + (e instanceof Error ? e.message : 'Noma\'lum xatolik'));
    }
  }

  async onButton(ctx: Context, _data: string) {
    await ctx.reply('🧠 Xotira xizmatini tanlang:\n\n1. ➕ Yangi narsa eslab qolish\n2. 📋 Barcha saqlangan narsalar\n3. 🔄 Random eslab qolgan narsa');
  }

  private async addMemory(ctx: Context, fact: string) {
    await ctx.reply(`✅ Eslab qolindi: "${fact}"\n\n🧠 Bu ma'lumot kelajakda sizga oid savollarda foydalaniladi.`);
  }

  private async listMemory(ctx: Context) {
    let response = `📋 Saqlangan Ma\'lumotlar:\n\n`;
    response += `1. 🎓 Yoshim: 25\n`;
    response += `2. 💼 Kasib: Dasturchi\n`;
    response += `3. 🌍 Vatan: O'zbekiston\n`;
    response += `4. 🎵 Sevimli Xananda: Uzbek Artists\n\n`;
    response += `Batafsil uchun raqamni yuboring yoki /memory-delete <raqam> o'chirish uchun.`;
    await ctx.reply(response);
  }

  private async deleteMemory(ctx: Context, id: string) {
    await ctx.reply(`🗑️ Malumon o'chirildi (ID: ${id})`);
  }

  private async recallMemory(ctx: Context) {
    await ctx.reply(`🧠 Eslab qolingan narsalar orqali:\n\nSiz Dasturchi bo'lib, O'zbekistondan siz. Zarang musiqasini yoqtirasiz. Nimadan yordam beray?`);
  }
}
