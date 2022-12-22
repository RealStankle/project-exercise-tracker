const User = require('../models/user.model');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ username: user.username, _id: user._id });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createUser,
};
