const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global_settings'
    },
    bankName: {
      type: String,
      default: 'Commercial Bank of Ceylon / Bank of Ceylon'
    },
    accountHolder: {
      type: String,
      default: 'DOMAIN SELL (PVT) LTD'
    },
    accountNumber: {
      type: String,
      default: '801294819203'
    },
    branch: {
      type: String,
      default: 'Colombo City Super Grade Branch'
    },
    adminWhatsApp: {
      type: String,
      default: '94771234567'
    },
    displayWhatsApp: {
      type: String,
      default: '+94 77 123 4567'
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    supportEmail: {
      type: String,
      default: 'support@domainsell.lk'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
