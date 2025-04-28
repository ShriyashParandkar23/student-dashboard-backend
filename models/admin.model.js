// models/admin.model.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const AdminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'staff'],
    required: true,
    default: 'admin',
  },
  permissions: {
    type: [String],
    enum: ['manage_students', 'manage_marks', 'manage_tests'],
    required: true,
    default: ['manage_students', 'manage_marks', 'manage_tests'],
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: String,
    required: true,
  },
}, { timestamps: true });



const Admin = model('Admin', AdminSchema);

module.exports = Admin;
