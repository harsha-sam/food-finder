import prisma from '@/lib/prisma';

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { custId, custName, restaurantId, description } = req.body;
      const data = await prisma.reviews.create({
        data: {
          custId,
          custName,
          restaurantId,
          description
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
