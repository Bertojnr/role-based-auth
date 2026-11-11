const express = require('express');
const authRouter = express.Router()
const authMiddleware = require('../middleware/authMiddleware');

const {registerUser, loginUser, changePassword} = require('../controllers/authController');

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.post('/change-password', authMiddleware, changePassword);

module.exports = authRouter;