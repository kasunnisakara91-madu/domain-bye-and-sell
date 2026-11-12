const BotProduct = require('../models/BotProduct');
const Settings = require('../models/Settings');

// Get all WhatsApp mini bots
exports.getBots = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { isActive: true };

    if (search) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const bots = await BotProduct.find(query).sort({ price: 1 });
    const settings = await Settings.findOne({ key: 'global_settings' });

    return res.json({
      success: true,
      count: bots.length,
      adminWhatsApp: settings?.adminWhatsApp || '94771234567',
      bots
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Add Bot
exports.createBot = async (req, res) => {
  try {
    const bot = await BotProduct.create(req.body);
    return res.status(201).json({ success: true, bot });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update Bot
exports.updateBot = async (req, res) => {
  try {
    const { id } = req.params;
    const bot = await BotProduct.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ success: true, bot });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete Bot
exports.deleteBot = async (req, res) => {
  try {
    const { id } = req.params;
    await BotProduct.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Bot deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
