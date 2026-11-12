const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      index: true
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    whatsappContact: {
      type: String,
      required: true
    },
    transferAmount: {
      type: Number,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Receipt', receiptSchema);
