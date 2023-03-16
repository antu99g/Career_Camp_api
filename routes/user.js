const express = require('express');
const router = express.Router();

const userController = require('../controllers/user_controller');


// Rendering login page
router.post('/login', userController.login);

// Adding new user to database
router.post('/signup', function(req, res, next){
   console.log('ppppp');
   next();
}, userController.signUp);

// Create new session after login
// router.post(
//    '/create-session', 
//    passport.authenticate("local", { failureRedirect: '/user/signup' }),
//    userController.createSession
// );

// Log out
// router.get("/logout", userController.logOut);



module.exports = router;