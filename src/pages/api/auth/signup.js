import bcrypt from 'bcrypt';
import clientPromise from '@/lib/db';

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise
      const db = await client.db();
      const { full_name, email, password } = req.body;
      const salt = bcrypt.genSaltSync(12);
      let encryptedPassword = bcrypt.hashSync(password, salt);
      const data = await db.collection('users').insertOne({
        full_name,
        email,
        password: encryptedPassword
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