import connectDB from '../../_lib/db.js';
import Registration from '../../_lib/models/Registration.js';
import { verifyToken, setCors } from '../../_lib/auth.js';

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { param } = req.query;

  await connectDB();

  if (req.method === 'GET') {
    // Public: check status by regNumber or NISN
    try {
      const registration = await Registration.findOne({
        $or: [
          { regNumber: { $regex: new RegExp('^' + param + '$', 'i') } },
          { nisn: param }
        ]
      });

      if (registration) {
        res.json(registration);
      } else {
        res.status(404).json({ message: 'Registration not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'DELETE') {
    // Protected: Admin only
    const user = verifyToken(req);
    if (!user || user.role !== 'Admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    try {
      const registration = await Registration.findByIdAndDelete(param);

      if (registration) {
        res.json({ message: 'Registration deleted successfully' });
      } else {
        res.status(404).json({ message: 'Registration not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
