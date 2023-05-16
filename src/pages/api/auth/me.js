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
        email: payload.email
      });
      user.id = user._id
    }
    return user;
  });
}

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
       const user = await verifyToken(
         req.headers['access-token'],
         process.env.ACCESS_TOKEN_SECRET
       );
      if (!user) throw new Error('Invalid access token');
      res.json(user);
    } catch (err) {
      res.status(401).json({
        error: err.message,
      });
    }
  }
}

export default handler;