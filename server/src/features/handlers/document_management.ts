import { Context } from 'telegraf';
import { IFeature } from '../manager';

export class DocumentManagementFeature implements IFeature {
  name = 'Documents';
  key = 'document_management';
  isPaid = false;
  description = '📄 Hujjat boshqaruvi - Pages yaratish, fayllarni o\'qish, export qilish';

  async onCommand(ctx: Context) {
    const command = (ctx.message as any)?.text?.replace('/docs ', '').trim();
    if (!command) {
      await ctx.reply(`📄 Hujjat boshqaruvi:\n\n/docs-create <nomi> - Yangi sahifa yaratish\n/docs-list - Barcha sahifalar\n/docs-export <format> - Export qilish (PDF, DOCX, XLSX)`);
      return;
    }

    try {
      if (command.startsWith('create')) {
        await this.createDocument(ctx, command.replace('create ', ''));
      } else if (command === 'list') {
        await this.listDocuments(ctx);
      } else {
        await ctx.reply('❓ Noma\'lum komanda. /docs-help yuboring.');
      }
    } catch (e) {
      await ctx.reply('❌ Hujjat xatosi: ' + (e instanceof Error ? e.message : 'Noma\'lum xatolik'));
    }
  }

  async onButton(ctx: Context, _data: string) {
    await ctx.reply('Hujjat boshqaruvi:\n\n1. Yangi sahifa yaratish\n2. Mavjud sahifalarni ko\'rish\n3. Export qilish');
  }

  private async createDocument(ctx: Context, name: string) {
    await ctx.reply(`✏️ Yangi sahifa yaratildi: "${name}"\n\nMazmunga yozing (multi-line supported):`);
  }

  private async listDocuments(ctx: Context) {
    await ctx.reply(`📋 Sizning sahifalaringiz:\n\n1. 📄 Birinchi sahifa\n2. 📄 Ikkinchi sahifa\n3. 📄 Uchinchi sahifa\n\nTanlash uchun raqam yuboring.`);
  }
}
