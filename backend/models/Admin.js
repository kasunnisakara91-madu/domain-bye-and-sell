const mongoose = require('express'); // to avoid typo, let's require mongoose
const Mongoose = require('mongoose');

const adminSchema = new Mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['superadmin', 'manager'],
      default: 'superadmin'
    },
    adminPin: {
      type: String,
      default: '2026'
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = Mongoose.model('Admin', adminSchema);
