import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/db';

const verifyToken = async (token, tokenSecret) => {
  return jwt.verify(token, tokenSecret, async (error, payload) => {
    let user = null;
    if (error) {
      throw error;
    } else {
      const client = await clientPromise;
      const db = await client.db();
      user = await db.collection('users').findOne({
        email: payload.email,
      });
      user.id = user._id;
    }
    return user;
  });
};

async function handler(req, res) {
  try {
    const user = await verifyToken(
      req.headers['access-token'],
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!user) throw new Error('Invalid access token');
    if (req.method === 'POST') {
        const { dishId, dish, restaurantId } = req.body;
        const data = await prisma.favourite.create({
          data: {
            custId: user.id.toString(),
            dish,
            dishId,
            restaurantId
          },
        });
        res.json(data);
    }
    else if (req.method === 'GET') {
      try {
        const data = await prisma.favourite.findMany({
          where: {
            custId: user.id.toString(),
          },
          include: {
            restaurant: true
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
  catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
}
export default handler;
