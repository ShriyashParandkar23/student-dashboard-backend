const Student = require("../models/student.model");
const bcrypt = require("bcryptjs");

// Signup student
const signupStudent = async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ message: "Name and password are required." });
        }

        const existingStudent = await Student.findOne({ name });
        if (existingStudent) {
            return res.status(400).json({ message: "Student with this name already exists." });
        }

        const id = Math.floor(1000000 + Math.random() * 9000000);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStudent = new Student({
            name,
            password: hashedPassword,
            isLoggedIn: false,
            user_id: id
        });

        await newStudent.save();

        return res.status(201).json({ message: "Student created successfully", student: { user_id: newStudent.user_id, name: newStudent.name } });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Login student
const loginStudent = async (req, res) => {
    try {
        const { userID, password } = req.body;

        if (!userID || !password) {
            return res.status(400).json({ message: "User ID and password are required." });
        }

        const student = await Student.findOne({ user_id: userID });
        if (!student) {
            return res.status(400).json({ message: "Invalid User ID or password." });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid User ID or password." });
        }

        student.isLoggedIn = true;
        await student.save();

        // Convert to object and remove password before sending
        const studentData = student.toObject();
        delete studentData.password;

        res.json({
            isStudentLoggedIn: true,
            message: "Login successful",
            UserData: studentData
        });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};


// Get all students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select("-password");
        return res.status(200).json({ students });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get student by ID
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findOne({ user_id: req.params.id }).select("-password");
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json({ student });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Delete student by ID
const deleteStudentById = async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({ user_id: req.params.id });
        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

module.exports = {
    signupStudent,
    loginStudent,
    getAllStudents,
    getStudentById,
    deleteStudentById
};
