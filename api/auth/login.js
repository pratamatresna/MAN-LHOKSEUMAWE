import connectDB from '../_lib/db.js';
import User from '../_lib/models/User.js';
import jwt from 'jsonwebtoken';
import { setCors } from '../_lib/auth.js';

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { role, password } = req.body;

    const user = await User.findOne({
      role: { $regex: new RegExp('^' + role + '$', 'i') }
    });

    if (user && (await user.comparePassword(password))) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.json({ token, role: user.role, message: 'Login berhasil' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
