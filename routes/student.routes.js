const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

router.post("/student-signup", studentController.signupStudent);
router.post("/student-login", studentController.loginStudent);
router.get("/students", studentController.getAllStudents);
router.get("/student/:id", studentController.getStudentById);
router.delete("/student/:id", studentController.deleteStudentById);

module.exports = router;