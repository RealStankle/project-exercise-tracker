const express = require('express');

const { createUser, addExercise } = require('../controllers/user.controller');

const router = express.Router();

router.post('/', createUser);

router.post('/:id/exercises', addExercise);

module.exports = router;
