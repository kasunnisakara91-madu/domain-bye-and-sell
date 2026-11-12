const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Domain = require('../models/Domain');
const Settings = require('../models/Settings');

// Generate distinct Order ID e.g. DS-72914
const generateOrderId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `DS-${randomNum}`;
};

// Place a new order
exports.createOrder = async (req, res) => {
  try {
    const { username, recoveryPin, productType, productId, productName, domainName, amount, customerNotes } = req.body;

    if (!username || !productType || !productName || amount === undefined) {
      return res.status(400).json({ success: false, message: 'Username, product details, and amount are required' });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Verify or auto-register customer with recovery pin
    let customer = await Customer.findOne({ username: cleanUsername });
    if (!customer) {
      // Auto-register new customer
      const pinToSave = recoveryPin ? String(recoveryPin) : '1234';
      customer = await Customer.create({
        username: cleanUsername,
        recoveryPinHash: pinToSave
      });
    }

    // If it's a domain, mark as reserved in catalog during pending payment
    if (productType === 'domain' && domainName) {
      await Domain.findOneAndUpdate(
        { name: domainName.toLowerCase() },
        { status: 'reserved' }
      );
    }

    const orderId = generateOrderId();
    const order = await Order.create({
      orderId,
      username: cleanUsername,
      productType,
      productId: productId || 'custom',
      productName,
      domainName: domainName || '',
      amount: Number(amount),
      customerNotes: customerNotes || '',
      status: 'pending'
    });

    const settings = await Settings.findOne({ key: 'global_settings' });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully. Please complete your bank transfer.',
      order,
      bankDetails: {
        bankName: settings?.bankName || 'Commercial Bank / Bank of Ceylon',
        accountHolder: settings?.accountHolder || 'DOMAIN SELL (PVT) LTD',
        accountNumber: settings?.accountNumber || '801294819203',
        branch: settings?.branch || 'Colombo Super Grade Branch'
      },
      adminWhatsApp: settings?.adminWhatsApp || '94771234567'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get orders for a specific customer
exports.getCustomerOrders = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const orders = await Order.find({ username: username.trim().toLowerCase() }).sort({ createdAt: -1 });
    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all orders with filter and search
exports.getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { username: { $regex: search.trim().toLowerCase(), $options: 'i' } },
        { orderId: { $regex: search.trim().toUpperCase(), $options: 'i' } },
        { domainName: { $regex: search.trim().toLowerCase(), $options: 'i' } }
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
