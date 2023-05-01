import prisma from '@/lib/prisma';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      const data = await prisma.restaurant.findUnique({
        where: {
          id
        },
        include: {
          campus: true,
          Cuisine: {
            include: {
              Dish: true
            }
          },
          Reviews: true
        }
      })
      res.json(data);
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
}
export default handler;
