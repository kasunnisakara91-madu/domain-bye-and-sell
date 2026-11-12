const mongoose = require('mongoose');

const botProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'WhatsApp Bots'
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    features: [
      {
        type: String,
        required: true
      }
    ],
    previewImage: {
      type: String,
      default: ''
    },
    demoWhatsappNumber: {
      type: String,
      default: ''
    },
    setupInstructions: {
      type: String,
      default: '1. Scan Meta QR / Provide Phone Number\n2. Configure Webhook & Admin Token\n3. Deploy Cloud Node Container'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BotProduct', botProductSchema);
