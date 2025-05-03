const Student = require("../models/student.model");
const bcrypt = require("bcryptjs");
const OpenAI = require('openai')

require("dotenv").config();
// ai suggestions
const GenerateSuggestions = async (marks) =>{
    console.log(marks)
    const openai = new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });
    
    const SystemPrompt = `

    You are a helpful AI assistant who provides encouraging, friendly, and constructive guidance to students based on their marks.
    User will give you the marks and according to those marks generate suggestions. 
    and return new suggestions everytime.
    Context = ${JSON.stringify(marks)}
    ✅ Strict Rules:
    - Return ONLY a raw JSON object like below put your suggestions according to marks.
    - Do NOT wrap the JSON in code blocks, markdown, or quotes.
    - I will parse the output — so the JSON format must be strictly correct.

    ✅ JSON Schema:
    {
      "Suggestions": {
        "<subject_name>": "<suggestion_text>",
        ...
      }
    }

    ✅ Example Input:
    {
      "Programming in C": {
        "pt1": 78,
        "pt2": 80,
        "pt3": 82,
        "pt4": 84,
        "attendance": "86%"
      },
      "Computer Networking": {
        "pt1": 75,
        "pt2": 78,
        "pt3": 80,
        "pt4": 82,
        "attendance": "84%"
      },
      "Signals and System": {
        "pt1": 79,
        "pt2": 81,
        "pt3": 83,
        "pt4": 85,
        "attendance": "86%"
      },
      "MicroProcessor": {
        "pt1": 82,
        "pt2": 84,
        "pt3": 86,
        "pt4": 88,
        "attendance": "89%"
      }
    }

    ✅ Example Output:
    {
      "Suggestions": {
        "Programming in C": "You have shown good progress! Keep practicing loops and arrays to strengthen your coding.",
        "Computer Networking": "You’re doing well, but focus on understanding the OSI model and network layers.",
        "Signals and System": "Great effort! Review signal transformations to boost your score further.",
        "MicroProcessor": "Excellent performance! Try reading up on advanced microprocessor concepts."
      }
    }

    ✅ If marks are missing or empty:
    {
      "Suggestions": {
        "Programming in C": "You need to submit marks to get AI suggestions.",
        "Computer Networking": "You need to submit marks to get AI suggestions.",
        "Signals and System": "You need to submit marks to get AI suggestions.",
        "MicroProcessor": "You need to submit marks to get AI suggestions."
      }
    }
    `;
    
    const response = await openai.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            { role: "system", content: SystemPrompt },
            {role:"user", content:JSON.stringify(marks)},
        ],
    });
    
    console.log(response.choices[0].message);
    return response.choices[0].message.content
}



// ======================


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

const aiSuggestionsAPI = async(req,res) =>{
    const {marks} = req.body 
    const aiSuggestions = await GenerateSuggestions(marks);
    const cleanedString = aiSuggestions.replace(/^```json\n/, '').replace(/\n```$/, '');
    // console.log(cleanedString)
    try{
        const response = JSON.parse(cleanedString)
        res.send(response)

    }catch(error){
        res.send({error:'Error while parsing'})
    }

}

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
        studentData.marks = Object.fromEntries(studentData.marks);
        const aiSuggestions = await GenerateSuggestions(studentData.marks);
        const cleanedString = aiSuggestions.replace(/^```json\n/, '').replace(/\n```$/, '');
        // console.log(cleanedString)
        studentData.ai_suggestions = JSON.parse(cleanedString)
        res.json({
            isStudentLoggedIn: true,
            message: "Login successful",
            UserData: studentData,
            marks:studentData.marks,
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
    deleteStudentById,
    aiSuggestionsAPI
};
