const express = require('express');

const {
  createUser,
  getUsers,
  addExercise,
  getUserLogs,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/', createUser);

router.get('/', getUsers);

router.post('/:id/exercises', addExercise);

router.get('/:id/logs', getUserLogs);

module.exports = router;
