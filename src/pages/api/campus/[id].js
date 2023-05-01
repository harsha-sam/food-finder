import prisma from '@/lib/prisma';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      const data = await prisma.campus.findUnique({
        where: {
          id
        },
        include: {
          Restaurant: true
        }
      });
      res.json(data);
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
}
export default handler;
