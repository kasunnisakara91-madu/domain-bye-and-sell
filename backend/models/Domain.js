const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Domain name is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    tld: {
      type: String,
      required: true,
      enum: ['.com', '.lk', '.net', '.org', '.site', '.online', '.xyz', 'custom'],
      default: '.com'
    },
    category: {
      type: String,
      required: true,
      default: '.com'
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
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
      default: 'Premium high-authority web domain with verified registry status.'
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isVerifiedRegistry: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold'],
      default: 'available'
    },
    featured: {
      type: Boolean,
      default: false
    },
    ownerUsername: {
      type: String,
      default: null
    },
    nameservers: [
      {
        type: String,
        default: ['ns1.domainsell.net', 'ns2.domainsell.net']
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Domain', domainSchema);
