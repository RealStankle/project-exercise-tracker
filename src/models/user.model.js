const { Schema, model } = require('mongoose');

const exerciseSchema = new Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
});

const userSchema = new Schema({
  username: { type: String, required: true },
  count: { type: Number, required: true },
  log: [exerciseSchema],
});

module.exports = model('User', userSchema);
