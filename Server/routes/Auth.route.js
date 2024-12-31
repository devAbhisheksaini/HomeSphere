const express = require('express');
const router = express.Router();
const { singup, login, google, singOUt } = require('../controllers/auth.contoller.js');
const { verifyToken } = require('../utils/verifyUser.js');
router.post('/signup', singup);
router.post('/signin', login);

router.post('/google', google);
router.get('/signOut', singOUt)
module.exports = router