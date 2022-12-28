const express = require('express');

const {
  createUser,
  addExercise,
  getUserLogs,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/', createUser);

router.post('/:id/exercises', addExercise);

router.get('/:id/logs', getUserLogs);

module.exports = router;
