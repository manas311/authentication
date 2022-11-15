const express = require('express');
const router = express.Router();
const controller = require('../controller/userController');
const passport = require('passport');

router.get('/finduser/:email',controller.findMail);
router.post('/register', controller.Register);
router.post('/login', passport.authenticate('login-local'), controller.Login);
router.get('/isauth', controller.isAuth);
router.put('/editprofile/:userid', controller.EditProfile);
router.get('/logout', controller.Logout);
router.post('/resetpassword', controller.Reset);
router.put('/confirmpwreset/:email', controller.ConfReset)


module.exports = router;