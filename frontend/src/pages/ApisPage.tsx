import React, { useState, useEffect } from 'react';
import { Cpu, Search, Terminal, Play, BookOpen, Check, Copy, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface ApisPageProps {
  onSelectProduct: (product: any) => void;
}

export const ApisPage: React.FC<ApisPageProps> = ({ onSelectProduct }) => {
  const [apis, setApis] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocApi, setActiveDocApi] = useState<any>(null);
  const [demoTesting, setDemoTesting] = useState(false);
  const [demoOutput, setDemoOutput] = useState<any>(null);

  const categories = [
    'All',
    'WhatsApp APIs',
    'AI APIs',
    'Movie APIs',
    'Music APIs',
    'Social Media APIs',
    'Image APIs',
    'Video APIs',
    'Custom APIs'
  ];

  const fetchAPIs = async () => {
    try {
      const url = `/api/apis?category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.apis) {
        setApis(data.apis);
      }
    } catch (err) {
      setApis([
        {
          _id: 'api-1',
          name: 'WhatsApp Cloud Gateway API',
          category: 'WhatsApp APIs',
          price: 6500,
          originalPrice: 8500,
          description: 'Official Meta cloud API bridge with webhook dispatcher, template triggers & zero ban risk.',
          features: ['Meta Official Protocol', 'Webhook Dispatcher', 'Template Message Trigger', 'Auto Reconnection'],
          documentation: {
            endpoint: '/api/v1/whatsapp/send',
            method: 'POST',
            sampleRequest: '{\n  "recipient": "+94771234567",\n  "template": "payment_approved",\n  "params": { "orderId": "DS-9281" }\n}',
            sampleResponse: '{\n  "status": "queued",\n  "messageId": "wamid.HBgL..."\n}'
          }
        },
        {
          _id: 'api-2',
          name: 'Multimodal Neural AI API',
          category: 'AI APIs',
          price: 5200,
          originalPrice: 7000,
          description: 'Ultra low-latency text, voice and computer-vision intelligence backend with structured JSON output.',
          features: ['Gemini/Claude Bridge', 'Sinhala/English Multilingual', 'Image & OCR Extraction', 'JSON Schemas'],
          documentation: {
            endpoint: '/api/v1/ai/generate',
            method: 'POST',
            sampleRequest: '{\n  "prompt": "Analyze this bank slip image",\n  "image_url": "https://..."\n}',
            sampleResponse: '{\n  "transfer_verified": true,\n  "amount": 4200,\n  "sender": "Silva"\n}'
          }
        },
        {
          _id: 'api-3',
          name: 'Global Movie & Cinema Stream API',
          category: 'Movie APIs',
          price: 3800,
          originalPrice: 4900,
          description: 'Direct streaming link resolver, high-res posters, subtitles, and IMDb/Rotten metadata.',
          features: ['4K/1080p Stream Links', 'Sinhala Subtitles Engine', 'IMDb & TMDB Synced', 'Actor Filmographies']
        },
        {
          _id: 'api-4',
          name: 'High-Fidelity Music Indexer API',
          category: 'Music APIs',
          price: 3200,
          originalPrice: 4500,
          description: 'Lossless audio metadata, synchronized lyrics provider, and multi-platform ID converter.',
          features: ['Synced LRC Lyrics', 'Spotify/Apple ID Resolver', 'Lossless Cover Art', 'Artist Discographies']
        },
        {
          _id: 'api-5',
          name: 'Unified Social Media Scraper API',
          category: 'Social Media APIs',
          price: 4900,
          originalPrice: 6200,
          description: 'Extract trending hashtags, video metrics, follower analytics from Instagram, TikTok & YouTube.',
          features: ['TikTok Trends', 'Instagram Post Metrics', 'YouTube Transcript API', 'No Auth Token Needed']
        },
        {
          _id: 'api-6',
          name: 'Generative Image Studio API',
          category: 'Image APIs',
          price: 4200,
          originalPrice: 5800,
          description: 'Real-time background removal, upscaling, neural face enhancement, and photorealistic generation.',
          features: ['AI Background Removal', '4x Resolution Upscaler', 'Face Restore Algorithm', 'Fast WebP Delivery']
        },
        {
          _id: 'api-7',
          name: 'HLS Video Transcoder & CDN API',
          category: 'Video APIs',
          price: 5800,
          originalPrice: 7900,
          description: 'Convert MP4 to multi-bitrate HLS (.m3u8), auto-generate thumbnails, and stream at blazing speeds.',
          features: ['Multi-bitrate HLS (.m3u8)', 'Automated Thumbnails', 'Global Edge CDN', 'Signed Token URLs']
        },
        {
          _id: 'api-8',
          name: 'Custom Enterprise Webhook Gateway',
          category: 'Custom APIs',
          price: 7500,
          originalPrice: 9900,
          description: 'Tailor-made private API endpoint built to your exact payload specs with SLA support.',
          features: ['Custom Schema Engine', 'Webhook Retries', 'End-to-End Encryption', 'Dedicated IP Proxy']
        }
      ]);
    }
  };

  useEffect(() => {
    fetchAPIs();
  }, [selectedCategory]);

  const handleRunDemo = async (api: any) => {
    setDemoTesting(true);
    setDemoOutput(null);
    try {
      const res = await fetch('/api/apis/demo-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: api.category, payload: { test: true } })
      });
      const data = await res.json();
      setDemoOutput(data.result);
    } catch (e) {
      setDemoOutput({
        status: 'simulated_success',
        latency: '28ms',
        channel: 'official_mock_sandbox',
        payload: { sample: 'Verified API response' }
      });
    } finally {
      setDemoTesting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>High-Speed Microservice APIs</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
          API <span className="text-neon-gradient">Marketplace</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Supercharge your software with robust REST endpoints. Credentials delivered to your account upon verified bank transfer.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-purple-900/40">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-neon-purple'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-purple-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchAPIs()}
            placeholder="Search APIs..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-purple-900/50 text-white text-xs focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* APIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apis.map((api) => (
          <div
            key={api._id || api.name}
            className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                  {api.category}
                </span>
                <span className="text-[11px] text-purple-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                  <span>Admin Delivery</span>
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white mb-2">{api.name}</h3>
              <p className="text-xs text-slate-400 mb-4 line-clamp-2">{api.description}</p>

              {/* Feature pills */}
              {api.features && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {api.features.slice(0, 3).map((feat: string, i: number) => (
                    <span
                      key={i}
                      className="text-[10px] bg-black/40 text-slate-300 px-2 py-0.5 rounded border border-purple-950"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-purple-900/40">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-xs text-slate-400 block">Access Price</span>
                  <span className="text-lg font-extrabold text-neon-gradient">
                    Rs. {Number(api.price).toLocaleString()}
                  </span>
                </div>
                {api.originalPrice > api.price && (
                  <span className="text-xs text-slate-500 line-through">
                    Rs. {Number(api.originalPrice).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setActiveDocApi(api)}
                  className="py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1 border border-white/10"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Docs &amp; Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectProduct({
                    id: api._id || api.name,
                    type: 'api',
                    name: api.name,
                    price: api.price,
                    description: api.description
                  })}
                  className="py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-neon-purple transition-all flex items-center justify-center space-x-1"
                >
                  <span>Buy API</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API Documentation & Live Demo Modal */}
      {activeDocApi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#120A24] border border-purple-500/40 rounded-2xl shadow-glass overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-purple-900/40 flex items-center justify-between bg-[#180D33]/60">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  {activeDocApi.category}
                </span>
                <h3 className="text-base font-bold text-white">{activeDocApi.name}</h3>
              </div>
              <button
                onClick={() => {
                  setActiveDocApi(null);
                  setDemoOutput(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              <p className="text-slate-300 leading-relaxed">{activeDocApi.description}</p>

              {/* Endpoint banner */}
              <div className="p-3 rounded-xl bg-black/60 border border-purple-900/60 font-mono flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  POST
                </span>
                <span className="text-purple-300">
                  https://api.domainsell.net{activeDocApi.documentation?.endpoint || '/api/v1/resource'}
                </span>
              </div>

              {/* Sample Request Payload */}
              <div>
                <span className="block font-bold uppercase tracking-wider text-purple-400 mb-1">
                  Sample Request Payload
                </span>
                <pre className="p-3 rounded-xl bg-black/70 border border-purple-950 font-mono text-[11px] text-slate-300 overflow-x-auto">
                  {activeDocApi.documentation?.sampleRequest || '{\n  "query": "hello world"\n}'}
                </pre>
              </div>

              {/* Interactive Demo Test */}
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <Terminal className="w-4 h-4 text-pink-400" />
                    <span>Live Interactive Sandbox Tester</span>
                  </span>
                  <button
                    onClick={() => handleRunDemo(activeDocApi)}
                    disabled={demoTesting}
                    className="px-3.5 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs flex items-center space-x-1 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{demoTesting ? 'Executing...' : 'Run Test Query'}</span>
                  </button>
                </div>

                {demoOutput && (
                  <pre className="p-3 rounded-xl bg-black font-mono text-[11px] text-emerald-400 border border-emerald-500/30 overflow-x-auto">
                    {JSON.stringify(demoOutput, null, 2)}
                  </pre>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-purple-900/40 flex justify-between items-center bg-[#180D33]/40">
              <span className="text-neon-gradient text-sm font-bold">
                Rs. {Number(activeDocApi.price).toLocaleString()}
              </span>
              <button
                onClick={() => {
                  const toBuy = activeDocApi;
                  setActiveDocApi(null);
                  onSelectProduct({
                    id: toBuy._id || toBuy.name,
                    type: 'api',
                    name: toBuy.name,
                    price: toBuy.price,
                    description: toBuy.description
                  });
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
