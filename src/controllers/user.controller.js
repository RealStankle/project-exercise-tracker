const User = require('../models/user.model');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ username: user.username, _id: user._id });
  } catch (error) {
    res.status(500).json(error);
  }
};

const addExercise = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const dateObj = new Date(req.body.date);

    const logObject = {
      description: req.body.description,
      duration: parseInt(req.body.duration),
      date: dateObj,
    };

    user.log.push(logObject);
    user.count = user.log.length;
    await user.save();

    res.status(201).json({
      username: user.username,
      ...logObject,
      date: dateObj.toDateString(),
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createUser,
  addExercise,
};
