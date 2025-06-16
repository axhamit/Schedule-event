// server/routes/auth.js
const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/signup', [
  check('username').not().isEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('Please enter a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authController.signup);

router.post('/login', [
  check('email').isEmail().withMessage('Please enter a valid email'),
  check('password').exists().withMessage('Password is required')
], authController.login);

module.exports = router;