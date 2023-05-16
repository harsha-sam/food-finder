import prisma from '@/lib/prisma';

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { custId, restaurantId, rating } = req.body;
      await prisma.rating.upsert({
        where: {
          customer_rating: {
            custId,
            restaurantId,
          }
        },
        update: {
          rating
        },
        create: {
          custId,
          restaurantId,
          rating
        },
      });
      const ratings = await prisma.rating.findMany({
        where: {
          restaurantId
        }
      })
      const cumRating = ratings.reduce((acc, element) => { 
        acc += parseInt(element.rating)
        return acc
      }, 0)
      let avgRating = 0;
      if (cumRating > 0) {
        avgRating = cumRating / ratings.length
      }
      await prisma.restaurant.update({
        where: {
          id: restaurantId
        },
        data: {
          avgRating
        }
      })
      res.json({
        restaurantId,
        avgRating
      });
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
}
export default handler;
