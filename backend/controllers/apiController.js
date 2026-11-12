const APIProduct = require('../models/APIProduct');
const ActivityLog = require('../models/ActivityLog');

// Get all API products with optional category filter
exports.getAPIs = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const apis = await APIProduct.find(query).sort({ price: 1 });
    return res.json({ success: true, count: apis.length, apis });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get API documentation & sample request/response
exports.getAPIDocs = async (req, res) => {
  try {
    const { id } = req.params;
    const api = await APIProduct.findById(id);
    if (!api) {
      return res.status(404).json({ success: false, message: 'API not found' });
    }
    return res.json({
      success: true,
      api: {
        id: api._id,
        name: api.name,
        category: api.category,
        price: api.price,
        description: api.description,
        documentation: api.documentation,
        features: api.features
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Demo endpoint simulation (for interactive demo testing without exposing private keys)
exports.testDemoEndpoint = async (req, res) => {
  try {
    const { category, payload } = req.body;
    
    // Simulate real responses based on API category
    let demoResponse = {};
    if (category === 'WhatsApp APIs') {
      demoResponse = {
        status: 'queued',
        messageId: 'wamid.HBgLMjAyNjExMTI1Mjg=' + Math.floor(Math.random() * 10000),
        recipient: payload?.phone || '+94771234567',
        channel: 'whatsapp_cloud_official',
        timestamp: new Date().toISOString()
      };
    } else if (category === 'AI APIs') {
      demoResponse = {
        model: 'neural-violet-v3',
        prompt_tokens: 18,
        completion_tokens: 42,
        output: 'Query analyzed successfully. High semantic similarity detected. Confidence: 0.984.',
        structured_json: { intent: 'domain_lookup', entity: 'market', sentiment: 'positive' }
      };
    } else if (category === 'Movie APIs') {
      demoResponse = {
        title: 'Cyber Inception: Neon Grid',
        year: 2026,
        imdbRating: 8.9,
        streamStreams: [{ quality: '1080p', codec: 'h265', bitrate: '6500k' }],
        subtitles: ['en', 'si', 'ta']
      };
    } else {
      demoResponse = {
        status: 'success',
        processedAt: new Date().toISOString(),
        data: payload || { sample: true },
        latency: '34ms'
      };
    }

    return res.json({ success: true, result: demoResponse });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Add API product
exports.createAPI = async (req, res) => {
  try {
    const api = await APIProduct.create(req.body);
    await ActivityLog.create({
      adminUsername: req.admin?.username || 'admin',
      action: 'UPDATE_PRICING',
      targetType: 'api',
      targetId: api._id.toString(),
      details: `Created API Product: ${api.name}`
    });
    return res.status(201).json({ success: true, api });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update API product
exports.updateAPI = async (req, res) => {
  try {
    const { id } = req.params;
    const api = await APIProduct.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ success: true, api });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete API
exports.deleteAPI = async (req, res) => {
  try {
    const { id } = req.params;
    await APIProduct.findByIdAndDelete(id);
    return res.json({ success: true, message: 'API product removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
