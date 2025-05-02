// routes/admin.route.js
const express = require('express');
const router = express.Router();
const { signup, signin, getAllAdmins, getAdminById, deleteAdminById,updateStudent ,signupStudent} = require('../controllers/admin.controller');

// Admin SignUp (Register a new admin)
router.post('/signup', signup);
// Admin SignIn (Login to an admin account)
router.post('/signin', signin);
// Get all admins
router.get('/admins', getAllAdmins);
// Get admin by ID
router.get('/:id', getAdminById);
// Delete admin by ID
router.delete('/delete/:id', deleteAdminById);

// create student
router.post('/create-student',signupStudent);
router.put('/update-student',updateStudent);






module.exports = router;
