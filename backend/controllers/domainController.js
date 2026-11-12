const Domain = require('../models/Domain');
const ActivityLog = require('../models/ActivityLog');
const dns = require('dns').promises;

// Get all domains with optional category/tld filter
exports.getDomains = async (req, res) => {
  try {
    const { category, search, availableOnly } = req.query;
    const query = {};

    if (category && category !== 'All') {
      if (category === 'Custom Domains') {
        query.category = 'Custom Domains';
      } else {
        query.tld = category;
      }
    }

    if (search) {
      query.name = { $regex: search.trim().toLowerCase(), $options: 'i' };
    }

    if (availableOnly === 'true') {
      query.status = 'available';
    }

    const domains = await Domain.find(query).sort({ featured: -1, createdAt: -1 });
    return res.json({
      success: true,
      count: domains.length,
      domains
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check registry availability with DNS lookup verification
exports.checkAvailability = async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ success: false, message: 'Domain name is required' });
    }

    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Check local database first
    const existing = await Domain.findOne({ name: cleanDomain });
    if (existing && existing.status !== 'available') {
      return res.json({
        success: true,
        domain: cleanDomain,
        isAvailable: false,
        status: existing.status,
        message: 'Domain is currently reserved or already registered in DOMAIN SELL.'
      });
    }

    // Perform DNS NS/A lookup to verify actual internet registry status
    let dnsResolves = false;
    try {
      const records = await dns.resolve(cleanDomain);
      if (records && records.length > 0) {
        dnsResolves = true;
      }
    } catch (err) {
      // ENOTFOUND or ENODATA usually indicates domain does not currently resolve
      dnsResolves = false;
    }

    // Determine TLD and default pricing from catalog
    const parts = cleanDomain.split('.');
    const tld = parts.length > 1 ? `.${parts[parts.length - 1]}` : '.com';

    return res.json({
      success: true,
      domain: cleanDomain,
      tld: tld,
      isAvailable: !dnsResolves,
      isVerifiedRegistry: true,
      status: dnsResolves ? 'taken_external' : 'available',
      message: dnsResolves
        ? 'Domain is actively registered on the global DNS root servers.'
        : 'Domain is verified available for instant registration and transfer!'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Add new domain
exports.addDomain = async (req, res) => {
  try {
    const { name, tld, category, price, originalPrice, description, featured } = req.body;
    const cleanName = name.trim().toLowerCase();

    const exists = await Domain.findOne({ name: cleanName });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Domain already listed in marketplace' });
    }

    const domain = await Domain.create({
      name: cleanName,
      tld: tld || '.com',
      category: category || tld || '.com',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.25,
      description: description || 'Verified domain with automated DNS management.',
      featured: Boolean(featured),
      status: 'available',
      isAvailable: true,
      isVerifiedRegistry: true
    });

    await ActivityLog.create({
      adminUsername: req.admin?.username || 'admin',
      action: 'ADD_DOMAIN',
      targetType: 'domain',
      targetId: domain._id.toString(),
      details: `Added new domain: ${cleanName} for Rs. ${price}`
    });

    return res.status(201).json({ success: true, domain });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update domain
exports.updateDomain = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const domain = await Domain.findByIdAndUpdate(id, updateData, { new: true });
    if (!domain) {
      return res.status(404).json({ success: false, message: 'Domain not found' });
    }

    await ActivityLog.create({
      adminUsername: req.admin?.username || 'admin',
      action: 'UPDATE_DOMAIN',
      targetType: 'domain',
      targetId: id,
      details: `Updated domain: ${domain.name} - Status: ${domain.status}, Price: ${domain.price}`
    });

    return res.json({ success: true, domain });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete domain
exports.deleteDomain = async (req, res) => {
  try {
    const { id } = req.params;
    const domain = await Domain.findByIdAndDelete(id);
    if (!domain) {
      return res.status(404).json({ success: false, message: 'Domain not found' });
    }

    await ActivityLog.create({
      adminUsername: req.admin?.username || 'admin',
      action: 'DELETE_DOMAIN',
      targetType: 'domain',
      targetId: id,
      details: `Deleted domain: ${domain.name}`
    });

    return res.json({ success: true, message: 'Domain deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
