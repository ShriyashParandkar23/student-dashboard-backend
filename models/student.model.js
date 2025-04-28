const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const StudentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  address: {
    type: String,
    required: false
  }
}, { timestamps: true }); // optional but recommended

const Student = model('Student', StudentSchema);

module.exports = Student;
