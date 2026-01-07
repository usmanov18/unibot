import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const loggerService = {
  async log(userId: number, username: string | undefined, action: string, input: string) {
    try {
      await prisma.userLog.create({
        data: {
          userId,
          username: username || null,
          action,
          input: input || null
        }
      });
    } catch (error) {
      console.error('Failed to log user action:', error);
    }
  },

  async getUserStats(userId: number) {
    return prisma.userLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10
    });
  }
};
