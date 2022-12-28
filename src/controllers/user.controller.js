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

const getUserLogs = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const from = req.query.from ? new Date(req.query.from).getTime() : 0;
    const to = req.query.to ? new Date(req.query.to).getTime() : Infinity;
    const limit = req.query.limit ? parseInt(req.query.limit) : user.log.length;

    const filteredLogs = user.log
      .filter(
        (exercise) =>
          exercise._doc.date.getTime() >= from && exercise.date.getTime() < to
      )
      .map((exercise) => {
        delete exercise._doc._id;
        return { ...exercise._doc, date: exercise.date.toDateString() };
      })
      .slice(0, limit);

    res.status(200).json({
      username: user.username,
      count: filteredLogs.length,
      _id: user.id,
      log: filteredLogs,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createUser,
  addExercise,
  getUserLogs,
};
