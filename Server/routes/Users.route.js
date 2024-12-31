const express = require('express');
const { verifyToken } = require('../utils/verifyUser');
const { updateUserdetials, deleteUser, getUserListings, getUser } = require('../controllers/updateProfile.controller');

const router = express.Router();


router.delete('/delete/:id', verifyToken, deleteUser);
router.post('/updateProfile/:id', verifyToken, updateUserdetials);
router.get("/listings/:id", verifyToken, getUserListings);
router.get(`/:id`, verifyToken, getUser);

module.exports = router