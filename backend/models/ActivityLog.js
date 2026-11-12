const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    adminUsername: {
      type: String,
      required: true
    },
    action: {
      type: String,
      enum: [
        'LOGIN',
        'VERIFY_PAYMENT',
        'REJECT_PAYMENT',
        'UNLOCK_PRODUCT',
        'ADD_DOMAIN',
        'UPDATE_DOMAIN',
        'DELETE_DOMAIN',
        'UPDATE_PRICING',
        'UPDATE_BANK_DETAILS',
        'UPDATE_WHATSAPP'
      ],
      required: true
    },
    targetType: {
      type: String,
      enum: ['order', 'domain', 'api', 'bot', 'customer', 'settings', 'auth'],
      required: true
    },
    targetId: {
      type: String,
      default: ''
    },
    customerUsername: {
      type: String,
      default: ''
    },
    details: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
