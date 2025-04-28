const Student = require("../models/student.model");

const signupStudent = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).json({ message: "Name and password are required." });
        }
        
        const id = Math.floor(1000000 + Math.random() * 9000000);

        const newStudent = new Student({
            name,
            password,
            isLoggedIn: true,
            user_id: id
        });

        await newStudent.save();
        return res.status(201).json({ message: "Student created successfully", student: newStudent });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
};

const loginStudent = async (req, res) => {
    try {
        const { userID, password } = req.body;

        if (!userID || !password) {
            return res.status(400).json({ message: "User ID and password are required." });
        }

        const student = await Student.findOne({ user_id: userID, password: password });

        if (student) {
            res.json({ isStudentLoggedIn: true });
        } else {
            res.json({ isStudentLoggedIn: false });
        }
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        return res.status(200).json({ students });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
};

const getStudentById = async (req, res) => {

    try {
        const student = await Student.findOne({user_id:req.params.id});
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json({ student });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
};

const deleteStudentById = async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({user_id:req.params.id});
        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` });
    }
};

module.exports = {deleteStudentById,getAllStudents,getStudentById,loginStudent,signupStudent}