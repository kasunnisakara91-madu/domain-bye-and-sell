const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Domain = require('./models/Domain');
const APIProduct = require('./models/APIProduct');
const BotProduct = require('./models/BotProduct');
const Admin = require('./models/Admin');
const Settings = require('./models/Settings');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/domainsell';

async function seedData() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully!');

    // Read pricing.json
    const pricingPath = path.join(__dirname, '../config/pricing.json');
    let pricingData = { domains: [], apis: [], bots: [], bankDetails: {}, whatsappConfig: {} };
    if (fs.existsSync(pricingPath)) {
      pricingData = JSON.parse(fs.readFileSync(pricingPath, 'utf8'));
    }

    // 1. Seed Domains
    const domainCount = await Domain.countDocuments();
    if (domainCount === 0) {
      console.log('Seeding initial domains...');
      const initialDomains = [
        { name: 'cloudpay.com', tld: '.com', category: '.com', price: 14500, originalPrice: 19000, description: 'High-brandable fintech & payments domain with international trust.', isAvailable: true, featured: true },
        { name: 'sltech.lk', tld: '.lk', category: '.lk', price: 4200, originalPrice: 5500, description: 'Top Sri Lankan technology and startup brand domain name.', isAvailable: true, featured: true },
        { name: 'neuronet.net', tld: '.net', category: '.net', price: 3400, originalPrice: 4200, description: 'Cybernetics, telecom & network infrastructure brand.', isAvailable: true },
        { name: 'ceyloncare.org', tld: '.org', category: '.org', price: 3600, originalPrice: 4500, description: 'Foundation, charity and community organization domain.', isAvailable: true },
        { name: 'cyberstudio.site', tld: '.site', category: '.site', price: 1450, originalPrice: 2200, description: 'Creative digital agency and web development showcase.', isAvailable: true },
        { name: 'lankashop.online', tld: '.online', category: '.online', price: 1650, originalPrice: 2400, description: 'Modern 24/7 e-commerce store domain for retail businesses.', isAvailable: true },
        { name: 'web3meta.xyz', tld: '.xyz', category: '.xyz', price: 1250, originalPrice: 1950, description: 'Decentralized protocol and future tech brand identifier.', isAvailable: true, featured: true },
        { name: 'ai.lk', tld: 'custom', category: 'Custom Domains', price: 28000, originalPrice: 45000, description: 'Ultra-rare two-letter national AI domain with instant manual transfer.', isAvailable: true, featured: true }
      ];
      await Domain.insertMany(initialDomains);
      console.log(`Seeded ${initialDomains.length} domains.`);
    }

    // 2. Seed APIs
    const apiCount = await APIProduct.countDocuments();
    if (apiCount === 0) {
      console.log('Seeding API products...');
      const initialAPIs = [
        {
          name: 'WhatsApp Cloud Gateway API',
          category: 'WhatsApp APIs',
          price: 6500,
          originalPrice: 8500,
          description: 'Official Meta cloud API bridge with webhook dispatcher, template triggers & zero ban risk.',
          features: ['Meta Official Protocol', 'Webhook Dispatcher', 'Template Message Trigger', 'Auto Reconnection'],
          documentation: {
            endpoint: '/api/v1/whatsapp/send',
            method: 'POST',
            sampleRequest: JSON.stringify({ recipient: '+94771234567', template: 'order_receipt_verified', params: { orderId: 'DS-9281' } }, null, 2),
            sampleResponse: JSON.stringify({ status: 'sent', id: 'wamid.HBgL...' }, null, 2)
          }
        },
        {
          name: 'Multimodal Neural AI API',
          category: 'AI APIs',
          price: 5200,
          originalPrice: 7000,
          description: 'Ultra low-latency text, voice and computer-vision intelligence backend with structured JSON output.',
          features: ['Gemini/Claude Bridge', 'Sinhala/English Multilingual', 'Image & OCR Extraction', 'JSON Schemas'],
          documentation: {
            endpoint: '/api/v1/ai/generate',
            method: 'POST',
            sampleRequest: JSON.stringify({ prompt: 'Analyze this bank slip image', image_url: 'https://...' }, null, 2),
            sampleResponse: JSON.stringify({ transfer_verified: true, amount: 4200, sender: 'Silva' }, null, 2)
          }
        },
        {
          name: 'Global Movie & Cinema Stream API',
          category: 'Movie APIs',
          price: 3800,
          originalPrice: 4900,
          description: 'Direct streaming link resolver, high-res posters, subtitles, and IMDb/Rotten metadata.',
          features: ['4K/1080p Stream Links', 'Sinhala Subtitles Engine', 'IMDb & TMDB Synced', 'Actor Filmographies']
        },
        {
          name: 'High-Fidelity Music Indexer API',
          category: 'Music APIs',
          price: 3200,
          originalPrice: 4500,
          description: 'Lossless audio metadata, synchronized lyrics provider, and multi-platform ID converter.',
          features: ['Synced LRC Lyrics', 'Spotify/Apple ID Resolver', 'Lossless Cover Art', 'Artist Discographies']
        },
        {
          name: 'Unified Social Media Scraper API',
          category: 'Social Media APIs',
          price: 4900,
          originalPrice: 6200,
          description: 'Extract trending hashtags, video metrics, follower analytics from Instagram, TikTok & YouTube.',
          features: ['TikTok Trends', 'Instagram Post Metrics', 'YouTube Transcript API', 'No Auth Token Needed']
        },
        {
          name: 'Generative Image Studio API',
          category: 'Image APIs',
          price: 4200,
          originalPrice: 5800,
          description: 'Real-time background removal, upscaling, neural face enhancement, and photorealistic generation.',
          features: ['AI Background Removal', '4x Resolution Upscaler', 'Face Restore Algorithm', 'Fast WebP Delivery']
        },
        {
          name: 'HLS Video Transcoder & CDN API',
          category: 'Video APIs',
          price: 5800,
          originalPrice: 7900,
          description: 'Convert MP4 to multi-bitrate HLS (.m3u8), auto-generate thumbnails, and stream at blazing speeds.',
          features: ['Multi-bitrate HLS (.m3u8)', 'Automated Thumbnails', 'Global Edge CDN', 'Signed Token URLs']
        },
        {
          name: 'Custom Enterprise Webhook Gateway',
          category: 'Custom APIs',
          price: 7500,
          originalPrice: 9900,
          description: 'Tailor-made private API endpoint built to your exact payload specs with SLA support.',
          features: ['Custom Schema Engine', 'Webhook Retries', 'End-to-End Encryption', 'Dedicated IP Proxy']
        }
      ];
      await APIProduct.insertMany(initialAPIs);
      console.log(`Seeded ${initialAPIs.length} APIs.`);
    }

    // 3. Seed Bots
    const botCount = await BotProduct.countDocuments();
    if (botCount === 0) {
      console.log('Seeding WhatsApp Mini Bots...');
      const initialBots = [
        {
          name: 'WhatsApp E-Commerce Store Bot',
          price: 8500,
          originalPrice: 12000,
          description: 'Turn your WhatsApp into a 24/7 revenue powerhouse. Handles product browsing, ordering, and receipt collection automatically.',
          features: [
            'Interactive product catalog with image menus',
            'Automated shopping cart & checkout calculator',
            'Bank receipt verification submission link',
            'Order tracking by reference ID',
            'Admin instant dispatch alert'
          ],
          setupInstructions: '1. Connect Meta Cloud Phone ID\n2. Set up Webhook URL: https://bot.domainsell.net/webhook/store\n3. Upload your products Excel/CSV.'
        },
        {
          name: 'AI Smart Customer Support Bot',
          price: 7200,
          originalPrice: 9800,
          description: 'Delight clients with hyper-intelligent instant answers in Sinhala, Tamil, or English with seamless human escalation.',
          features: [
            'Understands Sinhala, Tamil & English prompts',
            'Trained on your business FAQ and price sheet',
            'Human agent handover trigger',
            '24/7 instant replies with zero delay',
            'Lead capture to CSV / Google Sheet'
          ]
        },
        {
          name: 'Salon, Clinic & Service Booking Bot',
          price: 6800,
          originalPrice: 9000,
          description: 'Completely eliminates scheduling phone calls. Book clients directly inside their WhatsApp chat with automated reminders.',
          features: [
            'Real-time calendar slot checking',
            'Appointment confirmation & Google Calendar sync',
            'Automated reminder 2 hours prior to booking',
            'Cancellation and rescheduling self-service',
            'Advance deposit payment verification'
          ]
        },
        {
          name: 'Tuition Class & Student Portal Bot',
          price: 6400,
          originalPrice: 8500,
          description: 'Specially architected for Sri Lankan tuition masters and institutes. Automates class fee verification and lecture link distribution.',
          features: [
            'Student registration by index number',
            'Monthly class fee bank receipt upload',
            'Automated Zoom/YouTube lecture link dispatcher',
            'Exam timetable & marks lookup',
            'Parent SMS/WhatsApp notification'
          ]
        },
        {
          name: 'Real Estate & Auto Dealer Lead Bot',
          price: 7800,
          originalPrice: 10500,
          description: 'Capture high-intent leads from Facebook and Instagram ads directly into WhatsApp and qualify their budget automatically.',
          features: [
            'Interactive questionnaire qualification',
            'Budget & location preference filtering',
            'Instant PDF brochure delivery',
            'Automated WhatsApp notification to sales reps',
            'CRM webhook integration'
          ]
        }
      ];
      await BotProduct.insertMany(initialBots);
      console.log(`Seeded ${initialBots.length} WhatsApp bots.`);
    }

    // 4. Seed Settings
    const settings = await Settings.findOne({ key: 'global_settings' });
    if (!settings) {
      await Settings.create({
        key: 'global_settings',
        bankName: pricingData.bankDetails?.bankName || 'Commercial Bank / Bank of Ceylon',
        accountHolder: pricingData.bankDetails?.accountHolder || 'DOMAIN SELL (PVT) LTD',
        accountNumber: pricingData.bankDetails?.accountNumber || '801294819203',
        branch: pricingData.bankDetails?.branch || 'Colombo City Super Grade Branch',
        adminWhatsApp: pricingData.whatsappConfig?.adminNumber || '94771234567',
        displayWhatsApp: pricingData.whatsappConfig?.displayNumber || '+94 77 123 4567',
        currency: 'LKR'
      });
      console.log('Seeded global bank details and WhatsApp settings.');
    }

    // 5. Seed Admin
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@DomainSell2026!';
    const existingAdmin = await Admin.findOne({ username: adminUser.toLowerCase() });
    if (!existingAdmin) {
      await Admin.create({
        username: adminUser.toLowerCase(),
        passwordHash: adminPass, // In production, use bcrypt hash
        adminPin: '2026',
        role: 'superadmin'
      });
      console.log(`Admin user created: ${adminUser}`);
    }

    console.log('Database seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seed:', error);
    process.exit(1);
  }
}

seedData();
