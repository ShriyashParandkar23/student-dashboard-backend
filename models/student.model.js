const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MarksSchema = new Schema({
  pt1: Number,
  pt2: Number,
  pt3: Number,
  pt4: Number,
  attendance: String // e.g., "86%"
}, { _id: false });

const StudentSchema = new Schema({
  name: { type: String, required: true },
  user_id: { type: String, required: true, unique: true },
  course: { type: String, required:true },
  email: { type: String,  unique: true },
  phoneNumber: { type: String },
  isLoggedIn: { type: Boolean, default: false },
  division: { type: String },
  attendance: { type: Number }, // overall numeric value without % sign
  birthDate: { type: String },
  linkedIn: { type: String },
  gitHub: { type: String },
  overallAttendance: { type: String }, // e.g., "82%"
  createdByadmin: { type: String },
  password: { type: String, required: true },
  marks: {
    type: Map,
    of: MarksSchema
  }
}, { timestamps: true });

const Student = model('Student', StudentSchema);

module.exports = Student;
