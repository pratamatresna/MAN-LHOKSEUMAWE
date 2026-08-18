const User = require('../models/User');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { role, password } = req.body;
    
    // Find user by role (case-insensitive)
    const user = await User.findOne({ role: { $regex: new RegExp('^' + role + '$', 'i') } });

    if (user && (await user.comparePassword(password))) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      res.json({ token, role: user.role, message: 'Login berhasil' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };
