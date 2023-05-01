import prisma from '@/lib/prisma';

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = await prisma.favourite.create({
        data: {
          custId: req.body.custId,
          dishId: req.body.dishId
        },
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
