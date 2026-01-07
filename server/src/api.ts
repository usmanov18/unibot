import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all sections
router.get('/sections', async (req, res) => {
  try {
    const sections = await prisma.botSection.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
});

// Update section status (toggle)
router.patch('/sections/:id/toggle', async (req, res) => {
  const { id } = req.params;
  try {
    const section = await prisma.botSection.findUnique({ where: { id } });
    if (!section) return res.status(404).json({ error: 'Section not found' });

    const updated = await prisma.botSection.update({
      where: { id },
      data: { isActive: !section.isActive }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Update sections order
router.post('/sections/reorder', async (req, res) => {
  const { ids } = req.body;
  try {
    await prisma.$transaction(
      ids.map((id: string, index: number) =>
        prisma.botSection.update({
          where: { id },
          data: { order: index }
        })
      )
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Reordering failed' });
  }
});

// Create new section
router.post('/sections', async (req, res) => {
  const { key, title, content, category, isPaid } = req.body;
  try {
    const count = await prisma.botSection.count();
    const section = await prisma.botSection.create({
      data: { key, title, content, category, isPaid, order: count }
    });
    res.json(section);
  } catch (error) {
    res.status(500).json({ error: 'Creation failed' });
  }
});

// Delete section
router.delete('/sections/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.botSection.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Deletion failed' });
  }
});

export { router as apiRouter };
