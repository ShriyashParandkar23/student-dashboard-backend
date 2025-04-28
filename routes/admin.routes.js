// routes/admin.route.js
const express = require('express');
const router = express.Router();
const { signup, signin,getAllAdmins } = require('../controllers/admin.controller');

// Admin SignUp (Register a new admin)
router.post('/signup', signup);

// Admin SignIn (Login to an admin account)
router.post('/signin', signin);
router.get('/admins', getAllAdmins);


module.exports = router;
