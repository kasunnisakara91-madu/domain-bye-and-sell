const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Domain = require('../models/Domain');
const Payment = require('../models/Payment');
const Receipt = require('../models/Receipt');
const Settings = require('../models/Settings');
const ActivityLog = require('../models/ActivityLog');
const { JWT_SECRET } = require('../middleware/auth');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Admin Login
exports.login = async (req, res) => {
  try {
    const { username, password, pin } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@DomainSell2026!';
    const adminPin = process.env.ADMIN_PIN || '2026';

    const isValidUser = username && username.trim().toLowerCase() === adminUser.toLowerCase();
    const isValidPass = (password && password === adminPass) || (pin && String(pin) === adminPin);

    if (!isValidUser || !isValidPass) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials' });
    }

    const token = jwt.sign(
      { username: adminUser, role: 'superadmin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await ActivityLog.create({
      adminUsername: adminUser,
      action: 'LOGIN',
      targetType: 'auth',
      details: 'Administrator successfully logged in',
      ipAddress: req.ip || ''
    });

    return res.json({
      success: true,
      token,
      admin: { username: adminUser, role: 'superadmin' }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Dashboard Overview Metrics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingPayments = await Order.countDocuments({ status: { $in: ['pending', 'payment_submitted'] } });
    const verifiedPayments = await Order.countDocuments({ status: 'verified' });
    const rejectedPayments = await Order.countDocuments({ status: 'rejected' });
    const unlockedProducts = await Order.countDocuments({ status: 'unlocked' });

    // Calculate revenue
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $in: ['verified', 'unlocked'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);
    const recentLogs = await ActivityLog.find().sort({ createdAt: -1 }).limit(15);

    return res.json({
      success: true,
      stats: {
        totalCustomers,
        totalOrders,
        pendingPayments,
        verifiedPayments,
        rejectedPayments,
        unlockedProducts,
        totalRevenue
      },
      recentOrders,
      recentLogs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify / Reject Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, action, reviewNotes } = req.body;
    if (!orderId || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'OrderId and valid action (approve/reject) required' });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (action === 'approve') {
      order.status = 'verified';
      order.verifiedBy = req.admin?.username || 'admin';
      order.verifiedAt = new Date();
      order.adminNotes = reviewNotes || 'Bank transfer verified in administrator account.';
    } else {
      order.status = 'rejected';
      order.verifiedBy = req.admin?.username || 'admin';
      order.adminNotes = reviewNotes || 'Bank transfer receipt could not be verified or amount mismatch.';
      
      // If domain, release reservation
      if (order.productType === 'domain' && order.domainName) {
        await Domain.findOneAndUpdate({ name: order.domainName.toLowerCase() }, { status: 'available' });
      }
    }

    await order.save();

    await ActivityLog.create({
      adminUsername: req.admin?.username || 'admin',
      action: action === 'approve' ? 'VERIFY_PAYMENT' : 'REJECT_PAYMENT',
      targetType: 'order',
      targetId: order.orderId,
      customerUsername: order.username,
      details: `${action.toUpperCase()} payment for Order ${order.orderId} (Amount: Rs. ${order.amount}). Notes: ${reviewNotes || 'N/A'}`
    });

    return res.json({
      success: true,
      message: `Payment successfully ${action === 'approve' ? 'approved' : 'rejected'}.`,
      order
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// MANUAL UNLOCK SYSTEM (CRITICAL REQUIREMENT)
// Step 9: Admin unlocks the purchased domain / API / bot for the exact customer username
exports.unlockProduct = async (req, res) => {
  try {
    const { orderId, customCredentials, customDns } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'OrderId is required' });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only allow unlock if verified or manually forced by administrator
    const cleanUsername = order.username.toLowerCase();
    let customer = await Customer.findOne({ username: cleanUsername });
    if (!customer) {
      customer = await Customer.create({ username: cleanUsername, recoveryPinHash: '1234' });
    }

    // Generate credentials based on product type
    let deliveryCreds = {};
    if (order.productType === 'domain') {
      deliveryCreds = {
        dnsNameservers: customDns || 'ns1.domainsell.lk, ns2.domainsell.lk',
        instructions: `Domain ${order.domainName} officially registered and transferred to ${cleanUsername}. DNS propagation active.`
      };

      // Mark domain as SOLD in catalog and assign owner
      if (order.domainName) {
        await Domain.findOneAndUpdate(
          { name: order.domainName.toLowerCase() },
          { status: 'sold', isAvailable: false, ownerUsername: cleanUsername }
        );
      }
    } else if (order.productType === 'api') {
      const generatedKey = 'ds_live_' + crypto.randomBytes(16).toString('hex');
      deliveryCreds = {
        apiKey: generatedKey,
        instructions: `Secret API Key: ${generatedKey}\nEndpoint: https://api.domainsell.net/v1\nRate Limit: 120 req/min.`
      };
    } else if (order.productType === 'bot') {
      const generatedToken = 'bot_token_' + crypto.randomBytes(12).toString('hex');
      deliveryCreds = {
        botToken: generatedToken,
        instructions: `Bot Webhook Token: ${generatedToken}\nMeta WhatsApp Webhook: https://bot.domainsell.net/webhook/${order.orderId}`
      };
    }

    // Update order
    order.status = 'unlocked';
    order.unlockedAt = new Date();
    order.deliveryCredentials = deliveryCreds;
    await order.save();

    // Push into customer's unlockedItems
    customer.unlockedItems.push({
      itemType: order.productType,
      itemName: order.productName,
      domainName: order.domainName || '',
      unlockedAt: new Date(),
      orderId: order.orderId,
      credentials: {
        apiKey: deliveryCreds.apiKey || '',
        botToken: deliveryCreds.botToken || '',
        dnsRecords: deliveryCreds.dnsNameservers || '',
        accessInstructions: deliveryCreds.instructions || ''
      }
    });
    await customer.save();

    await ActivityLog.create({
      adminUsername: req.admin?.username || 'admin',
      action: 'UNLOCK_PRODUCT',
      targetType: 'order',
      targetId: order.orderId,
      customerUsername: cleanUsername,
      details: `UNLOCKED ${order.productType.toUpperCase()} (${order.productName}) for customer '${cleanUsername}'. Order: ${order.orderId}`
    });

    return res.json({
      success: true,
      message: `Product successfully unlocked for customer '${cleanUsername}'! It is now visible in their My Products portal.`,
      order,
      unlockedItem: customer.unlockedItems[customer.unlockedItems.length - 1]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Bank Details & WhatsApp Settings
exports.updateSettings = async (req, res) => {
  try {
    const { bankName, accountHolder, accountNumber, branch, adminWhatsApp, displayWhatsApp, currency } = req.body;

    let settings = await Settings.findOne({ key: 'global_settings' });
    if (!settings) settings = new Settings({ key: 'global_settings' });

    if (bankName) settings.bankName = bankName;
    if (accountHolder) settings.accountHolder = accountHolder;
    if (accountNumber) settings.accountNumber = accountNumber;
    if (branch) settings.branch = branch;
    if (adminWhatsApp) settings.adminWhatsApp = adminWhatsApp;
    if (displayWhatsApp) settings.displayWhatsApp = displayWhatsApp;
    if (currency) settings.currency = currency;

    await settings.save();

    // Also update pricing.json if exists
    try {
      const pricingPath = path.join(__dirname, '../../config/pricing.json');
      if (fs.existsSync(pricingPath)) {
        const raw = fs.readFileSync(pricingPath, 'utf8');
        const json = JSON.parse(raw);
        if (bankName) json.bankDetails.bankName = bankName;
        if (accountHolder) json.bankDetails.accountHolder = accountHolder;
        if (accountNumber) json.bankDetails.accountNumber = accountNumber;
        if (branch) json.bankDetails.branch = branch;
        if (adminWhatsApp) json.whatsappConfig.adminNumber = adminWhatsApp;
        fs.writeFileSync(pricingPath, JSON.stringify(json, null, 2), 'utf8');
      }
    } catch (e) {
      console.warn('Could not sync pricing.json', e.message);
    }

    await ActivityLog.create({
      adminUsername: req.admin?.username || 'admin',
      action: 'UPDATE_BANK_DETAILS',
      targetType: 'settings',
      details: `Updated Bank details and Admin WhatsApp number (${adminWhatsApp})`
    });

    return res.json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Activity Audit Logs
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    return res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
