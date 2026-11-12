const Customer = require('../models/Customer');
const Order = require('../models/Order');

// Customer Login or Register via unique username + recovery security PIN
exports.authCustomer = async (req, res) => {
  try {
    const { username, recoveryPin } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const cleanUsername = username.trim().toLowerCase();
    let customer = await Customer.findOne({ username: cleanUsername });

    if (!customer) {
      // New registration
      const pin = recoveryPin ? String(recoveryPin).trim() : '1234';
      customer = await Customer.create({
        username: cleanUsername,
        recoveryPinHash: pin
      });

      return res.json({
        success: true,
        isNew: true,
        message: `Welcome, ${cleanUsername}! Account created. Your security PIN is ${pin}. Keep it safe to claim this username in the future.`,
        username: customer.username,
        recoveryPin: pin
      });
    }

    // If existing, check PIN if provided
    if (recoveryPin && String(recoveryPin).trim() !== customer.recoveryPinHash) {
      return res.status(401).json({
        success: false,
        message: 'Security PIN mismatch. This username is claimed by another user. Please provide the correct recovery PIN.'
      });
    }

    return res.json({
      success: true,
      isNew: false,
      message: `Welcome back, ${customer.username}!`,
      username: customer.username
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Unlocked Products and order history for customer
exports.getCustomerProfile = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const customer = await Customer.findOne({ username: cleanUsername });
    const orders = await Order.find({ username: cleanUsername }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      username: cleanUsername,
      unlockedItems: customer?.unlockedItems || [],
      orders
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
