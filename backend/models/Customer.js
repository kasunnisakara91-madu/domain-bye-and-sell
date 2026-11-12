const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-z0-9_.-]+$/, 'Username can only contain alphanumeric characters, underscores, dots, or dashes']
    },
    recoveryPinHash: {
      type: String,
      required: [true, 'Recovery PIN hash is required']
    },
    recoveryPinHint: {
      type: String,
      default: ''
    },
    whatsappNumber: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
    },
    unlockedItems: [
      {
        itemType: {
          type: String,
          enum: ['domain', 'api', 'bot'],
          required: true
        },
        itemName: { type: String, required: true },
        domainName: { type: String, default: '' },
        unlockedAt: { type: Date, default: Date.now },
        orderId: { type: String, required: true },
        credentials: {
          apiKey: { type: String, default: '' },
          botToken: { type: String, default: '' },
          dnsRecords: { type: String, default: '' },
          accessInstructions: { type: String, default: '' }
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
