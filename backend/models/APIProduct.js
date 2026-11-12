const mongoose = require('mongoose');

const apiProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'WhatsApp APIs',
        'AI APIs',
        'Movie APIs',
        'Music APIs',
        'Social Media APIs',
        'Image APIs',
        'Video APIs',
        'Custom APIs'
      ]
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
    description: {
      type: String,
      required: true
    },
    documentation: {
      overview: { type: String, default: '' },
      endpoint: { type: String, default: '/api/v1/resource' },
      method: { type: String, default: 'POST' },
      headers: { type: mongoose.Schema.Types.Mixed, default: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <YOUR_ADMIN_UNLOCKED_API_KEY>' } },
      sampleRequest: { type: String, default: '{}' },
      sampleResponse: { type: String, default: '{}' },
      rateLimit: { type: String, default: '120 req / min' }
    },
    demoUrl: {
      type: String,
      default: ''
    },
    features: [
      {
        type: String
      }
    ],
    // Admin only - delivered to customer upon payment unlock
    deliveryTemplate: {
      type: String,
      default: 'API key will be generated and dispatched with full access documentation.'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('APIProduct', apiProductSchema);
