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
  isLoggedIn: { 
    type: Boolean, 
    default: false 
  },
  user_id: {
    type: String,  // This can be changed to Number if you want numeric IDs.
    required: true,
  },
  role: {
    type: String,
    default: 'admin'
  }
}, { timestamps: true });

const Admin = model('Admin', AdminSchema);

module.exports = Admin;
