import { Context } from 'telegraf';

export interface IFeature {
  key: string;
  name: string;
  description?: string;
  isPaid?: boolean;
  onCommand?(ctx: Context): Promise<void>;
  onButton?(ctx: Context, data: string): Promise<void>;
  onInput?(ctx: Context, text: string): Promise<void>;
  onCallback?(ctx: Context, data: string): Promise<void>;
  onVoice?(ctx: Context): Promise<void>;
}

export interface SessionData {
  currentFeature?: string;
}

export class FeatureManager {
  private handlers = new Map<string, IFeature>();

  register(handler: IFeature) {
    this.handlers.set(handler.key, handler);
  }

  getHandler(key: string) {
    return this.handlers.get(key);
  }

  getFeature(key: string) {
    return this.handlers.get(key);
  }

  getFeatures() {
    return Array.from(this.handlers.values());
  }

  async handleInput(ctx: Context): Promise<boolean> {
    const session = (ctx as any).session as SessionData | undefined;
    if (!session?.currentFeature) return false;
    const handler = this.getHandler(session.currentFeature);
    if (handler && handler.onInput) {
      const text = (ctx.message && 'text' in ctx.message) ? ctx.message.text : '';
      await handler.onInput(ctx, text);
      return true;
    }
    return false;
  }
}

export const featureManager = new FeatureManager();
