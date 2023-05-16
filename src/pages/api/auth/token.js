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
      user.id = user._id
    }
    return user;
  });
};

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const refresh_token = req.headers['refresh-token']
      if (refresh_token) {
        const user = await verifyToken(
          refresh_token,
          process.env.REFRESH_TOKEN_SECRET
        );
        if (!user) throw new Error('Invalid access token');
        const accessToken = jwt.sign(
          user,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        );
        res.status(200).json({
          accessToken
        });
      } else {
        throw new Error('Forbidden: refresh-token is required');
      }
    } catch (err) {
      res.status(403).json({
        error: err.message,
      });
    }
  }
}

export default handler;
