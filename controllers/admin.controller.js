// controllers/admin.controller.js
const Student = require("../models/student.model");
const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");
// Admin SignUp (Register a new admin)
const signup = async (req, res) => {
  try {
      const { name, userId, password } = req.body;

      if (!name || !userId || !password) {
          return res.status(400).json({ message: "Name, UserID, and password are required." });
      }

      const existingAdmin = await Admin.findOne({ user_id: userId });
      if (existingAdmin) {
          return res.status(400).json({ message: "Admin with this User ID already exists." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newAdmin = new Admin({
          name,
          password: hashedPassword,
          isLoggedIn: false,
          user_id: userId
      });

      await newAdmin.save();

      return res.status(201).json({ message: "Admin created successfully", admin: { user_id: newAdmin.user_id, name: newAdmin.name } });
  } catch (error) {
      return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};


// Admin SignIn (Login to an admin account)
const signin = async (req, res) => {
    try {
        const { userID, password } = req.body;
        console.log(req.body)
        if (!userID || !password) {
            return res.status(400).json({ message: "User ID and password are required." });
        }

        const admin = await Admin.findOne({ user_id: userID });
        if (!admin) {
            return res.status(400).json({ message: "Invalid User ID or password." });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid User ID or password." });
        }

        admin.isLoggedIn = true;
        await admin.save();

        res.json({ isAdminLoggedIn: true, message: "Login successful" });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select("-password");
        return res.status(200).json({ admins });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get admin by ID
const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findOne({ user_id: req.params.id }).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(200).json({ admin });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Delete admin by ID
const deleteAdminById = async (req, res) => {
    try {
        const deletedAdmin = await Admin.findOneAndDelete({ user_id: req.params.id });
        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};


// update Student
// Update student
const updateStudent = async (req, res) => {
    try {
        const { user_id, name, course, email, phoneNumber, division, birthDate, linkedIn, gitHub, overallAttendance, marks } = req.body;

        if (!user_id) {
            return res.status(400).json({ message: "User ID is required to update student." });
        }

        // Find the student by user_id
        const student = await Student.findOne({ user_id });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Update the student's information if provided
        student.name = name || student.name;
        student.course = course || student.course;
        student.email = email || student.email;
        student.phoneNumber = phoneNumber || student.phoneNumber;
        student.division = division || student.division;
        student.birthDate = birthDate || student.birthDate;
        student.linkedIn = linkedIn || student.linkedIn;
        student.gitHub = gitHub || student.gitHub;
        student.overallAttendance = overallAttendance || student.overallAttendance;
        student.marks = marks || student.marks;  // Marks can be updated as well

        // Save the updated student document
        await student.save();

        return res.status(200).json({
            message: "Student updated successfully",
            student: {
                user_id: student.user_id,
                name: student.name,
                course: student.course,
                email: student.email,
                phoneNumber: student.phoneNumber,
                division: student.division,
                birthDate: student.birthDate,
                linkedIn: student.linkedIn,
                gitHub: student.gitHub,
                overallAttendance: student.overallAttendance,
                marks: student.marks
            }
        });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Signup student
const signupStudent = async (req, res) => {
    try {
        const { name, password, user_id, course, email, phoneNumber, division, birthDate, linkedIn, gitHub } = req.body;

        // Check if the required fields are provided
        if (!name || !user_id || !course) {
            return res.status(400).json({ message: "Name, user_id, and course are required." });
        }

        // Check if the student already exists based on user_id
        const existingStudent = await Student.findOne({ user_id });
        if (existingStudent) {
            return res.status(400).json({ message: "Student with this user_id already exists." });
        }

        // Hash the password if provided
        let hashedPassword = '';
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Create a new student document with optional fields
        const newStudent = new Student({
            name,
            user_id,
            course,
            email,
            phoneNumber,
            division,
            birthDate,
            linkedIn,
            gitHub,
            password: hashedPassword || '',
            overallAttendance: "0%",  // Default value
            createdByadmin: req.body.createdByadmin || 'admin',  // Admin who creates the student
            marks: {}  // Initialize marks as an empty object
        });

        // Save the student to the database
        await newStudent.save();

        // Respond with the student data excluding password
        return res.status(201).json({
            message: "Student created successfully",
            student: {
                user_id: newStudent.user_id,
                name: newStudent.name,
                course: newStudent.course,
                email: newStudent.email,
                division: newStudent.division,
                birthDate: newStudent.birthDate,
                linkedIn: newStudent.linkedIn,
                gitHub: newStudent.gitHub
            }
        });
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};


module.exports = { signup, signin, getAllAdmins, getAdminById, deleteAdminById,signupStudent,updateStudent };
