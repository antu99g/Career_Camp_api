const express = require('express');
const router = express.Router();

const userController = require('../controllers/user_controller');


// Rendering login page
router.post('/login', userController.login);

// Adding new user to database
router.post('/signup', userController.signUp);


module.exports = router;