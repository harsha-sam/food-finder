import bcrypt from 'bcrypt';
import clientPromise from '@/lib/db';
import jwt from 'jsonwebtoken';

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = await client.db();
      const { email, password } = req.body;
      const usr = await db.collection('users').findOne({
        email,
      });
      if (bcrypt.compareSync(password, usr.password)) {
        let userInfo = {
          id: usr._id,
          email: usr.email,
          full_name: usr.full_name,
        };
        const accessToken = jwt.sign(
          userInfo,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        );
        const refreshToken = jwt.sign(
          userInfo,
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
        );
        userInfo.accessToken = accessToken;
        userInfo.refreshToken = refreshToken;
        res.json(userInfo);
      } else {
        throw new Error(
          'Wrong Password. Please enter correct password to log in.'
        );
      }
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
}

export default handler;
