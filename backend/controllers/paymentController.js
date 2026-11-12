const Payment = require('../models/Payment');
const Receipt = require('../models/Receipt');
const Order = require('../models/Order');
const Settings = require('../models/Settings');
const path = require('path');
const fs = require('fs');

// Submit bank transfer receipt
exports.submitReceipt = async (req, res) => {
  try {
    const { orderId, username, whatsappContact, transferAmount, transactionRef } = req.body;

    if (!orderId || !username || !whatsappContact || !transferAmount) {
      return res.status(400).json({ success: false, message: 'OrderId, username, WhatsApp number, and amount are required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a bank transfer receipt file (JPG, PNG, or PDF)' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const order = await Order.findOne({ orderId: orderId.trim() });
    if (!order) {
      return res.status(404).json({ success: false, message: `Order ${orderId} not found` });
    }

    // Create receipt document
    const receipt = await Receipt.create({
      orderId: order.orderId,
      username: cleanUsername,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      whatsappContact: whatsappContact.trim(),
      transferAmount: Number(transferAmount)
    });

    // Create payment review record
    const payment = await Payment.create({
      orderId: order.orderId,
      username: cleanUsername,
      amount: Number(transferAmount),
      transactionReference: transactionRef || '',
      status: 'pending_review'
    });

    // Update order status
    order.status = 'payment_submitted';
    order.receiptId = receipt._id;
    order.receiptFilename = req.file.filename;
    order.whatsappContact = whatsappContact.trim();
    await order.save();

    const settings = await Settings.findOne({ key: 'global_settings' });

    return res.status(201).json({
      success: true,
      message: 'Payment receipt submitted successfully! Admin will verify your bank transfer shortly.',
      orderId: order.orderId,
      receiptId: receipt._id,
      whatsappRedirect: {
        adminNumber: settings?.adminWhatsApp || '94771234567',
        prefilledText: `Hello DOMAIN SELL Admin.\nUsername: ${cleanUsername}\nProduct: ${order.productName}\nDomain: ${order.domainName || 'N/A'}\nAmount: ${transferAmount}\nOrder ID: ${order.orderId}\nI have completed my bank transfer.\nMy payment receipt is attached.`
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get current bank details & WhatsApp settings
exports.getBankDetails = async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = await Settings.create({ key: 'global_settings' });
    }
    return res.json({
      success: true,
      bankDetails: {
        bankName: settings.bankName,
        accountHolder: settings.accountHolder,
        accountNumber: settings.accountNumber,
        branch: settings.branch,
        currency: settings.currency
      },
      whatsapp: {
        adminNumber: settings.adminWhatsApp,
        displayNumber: settings.displayWhatsApp
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Stream/view secure receipt
exports.viewReceiptFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const safeFilename = path.basename(filename);
    const filePath = path.join(__dirname, '../../uploads/receipts', safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Receipt file not found on server' });
    }

    return res.sendFile(filePath);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
