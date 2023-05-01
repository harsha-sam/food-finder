import prisma from '@/lib/prisma';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await prisma.favourite.findMany({
        where: {
          custId: req.query.id
        },
        include: {
          dish: {
            include: {
              cuisine: {
                include: {
                  restaurant: {
                    include: {
                      campus: true
                    }
                  }
                }
              }
            }
          }
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
