import { Context } from 'telegraf';

export interface IFeature {
  key: string;
  name: string;
  onCommand?(ctx: Context): Promise<void>;
  onInput?(ctx: Context, text: string): Promise<void>;
  onCallback?(ctx: Context, data: string): Promise<void>;
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
