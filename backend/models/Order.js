const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    productType: {
      type: String,
      enum: ['domain', 'api', 'bot'],
      required: true
    },
    productId: {
      type: String,
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    domainName: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    status: {
      type: String,
      enum: ['pending', 'payment_submitted', 'verified', 'rejected', 'unlocked'],
      default: 'pending',
      index: true
    },
    paymentMethod: {
      type: String,
      default: 'Bank Transfer'
    },
    receiptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Receipt',
      default: null
    },
    receiptFilename: {
      type: String,
      default: ''
    },
    whatsappContact: {
      type: String,
      default: ''
    },
    customerNotes: {
      type: String,
      default: ''
    },
    adminNotes: {
      type: String,
      default: ''
    },
    verifiedBy: {
      type: String,
      default: null
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    unlockedAt: {
      type: Date,
      default: null
    },
    deliveryCredentials: {
      apiKey: { type: String, default: '' },
      botToken: { type: String, default: '' },
      dnsNameservers: { type: String, default: '' },
      instructions: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
