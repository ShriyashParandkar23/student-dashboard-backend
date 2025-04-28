const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MarksSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    Sub1: {
      name: {
        type: String,
        required: true, // Make it required if needed
      },
      marks: {
        type: Number,
        default: 50, // Default value for marks
      },
      updatedBy: {
        type: String,
      },
    },
    Sub2: {
      name: {
        type: String,
        required: true,
      },
      marks: {
        type: Number,
        default: 50,
      },
      updatedBy: {
        type: String,
      },
    },
    Sub3: {
      name: {
        type: String,
        required: true,
      },
      marks: {
        type: Number,
        default: 50,
      },
      updatedBy: {
        type: String,
      },
    },
    Sub4: {
      name: {
        type: String,
        required: true,
      },
      marks: {
        type: Number,
        default: 50,
      },
      updatedBy: {
        type: String,
      },
    },
  },
  { timestamps: true } // optional but recommended
);

const Marks = model('Marks', MarksSchema);

module.exports = Marks;
