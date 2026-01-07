import { Context } from 'telegraf';
import { IFeature } from '../manager';

export class SearchPlacesFeature implements IFeature {
  name = 'Places Search';
  key = 'search_places';
  isPaid = false;
  description = '📍 Joylar qidiruvi - restoranlar, kafelar, diqqatga sazovor joylar';

  async onCommand(ctx: Context) {
    const location = (ctx.message as any)?.text?.replace('/places ', '').trim();
    if (!location) {
      await ctx.reply('Joy nomini kiriting: /places <joy>\nMisol: /places Tashkent parklar');
      return;
    }

    await ctx.reply(`📍 "${location}" atrofidagi joylar yuklanmoqda...`);

    try {
      const places = await this.getPlaces(location);
      
      let response = `📍 "${location}" atrofidagi joylar:\n\n`;
      places.forEach((place, i) => {
        response += `${i + 1}. **${place.name}** ⭐ ${place.rating}/5\n`;
        response += `📌 ${place.address}\n`;
        response += `📞 ${place.phone}\n\n`;
      });

      await ctx.reply(response, { parse_mode: 'Markdown' });
    } catch (e) {
      await ctx.reply('❌ Joylar xatosi: ' + (e instanceof Error ? e.message : 'Noma\'lum xatolik'));
    }
  }

  async onButton(ctx: Context, _data: string) {
    await ctx.reply('Shahar yoki joy nomini kiriting:');
  }

  private async getPlaces(location: string) {
    // TODO: Real Places API (Google Maps, Foursquare, etc)
    return [
      { name: location + ' restorani', rating: 4.5, address: 'Shahar markazi', phone: '+998 91 000 00 00' },
      { name: location + ' kafeyi', rating: 4.2, address: 'Markaziy ko\'cha', phone: '+998 91 000 00 01' }
    ];
  }
}
