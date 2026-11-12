const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    bankName: {
      type: String,
      default: ''
    },
    accountNumber: {
      type: String,
      default: ''
    },
    transactionReference: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending_review', 'verified', 'rejected'],
      default: 'pending_review'
    },
    reviewedBy: {
      type: String,
      default: null
    },
    reviewNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
