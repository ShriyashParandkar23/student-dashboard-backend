const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

router.post("/signup", studentController.signupStudent);
router.post("/login", studentController.loginStudent);
router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.delete("/delete/:id", studentController.deleteStudentById);

module.exports = router;