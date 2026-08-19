import connectDB from '../../_lib/db.js';
import Registration from '../../_lib/models/Registration.js';
import { verifyToken, setCors } from '../../_lib/auth.js';

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Protected: Admin only
  const user = verifyToken(req);
  if (!user || user.role !== 'Admin') {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    await connectDB();
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
