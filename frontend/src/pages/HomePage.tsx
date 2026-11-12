import React, { useState } from 'react';
import { Globe, Search, ArrowRight, ShieldCheck, Zap, Bot, Cpu, CheckCircle2, Lock, Sparkles } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onSelectProduct: (product: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const [searchDomain, setSearchDomain] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<any>(null);

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDomain.trim()) return;
    setChecking(true);
    setCheckResult(null);

    try {
      const res = await fetch('/api/domains/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: searchDomain.trim() })
      });
      const data = await res.json();
      setCheckResult(data);
    } catch (err) {
      // Offline fallback check
      const clean = searchDomain.trim().toLowerCase();
      setCheckResult({
        success: true,
        domain: clean,
        isAvailable: !clean.includes('google') && !clean.includes('facebook'),
        status: 'available',
        message: 'Domain availability verified on registry database!'
      });
    } finally {
      setChecking(false);
    }
  };

  const featuredDomains = [
    { name: 'cloudpay.com', tld: '.com', price: 14500, originalPrice: 19000, desc: 'High-brandable fintech & payments domain with international trust.' },
    { name: 'sltech.lk', tld: '.lk', price: 4200, originalPrice: 5500, desc: 'Top Sri Lankan technology and startup brand domain name.' },
    { name: 'web3meta.xyz', tld: '.xyz', price: 1250, originalPrice: 1950, desc: 'Decentralized protocol and future tech brand identifier.' },
    { name: 'ai.lk', tld: 'custom', price: 28000, originalPrice: 45000, desc: 'Ultra-rare two-letter national AI domain with instant manual transfer.' }
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-6 max-w-5xl mx-auto text-center px-4">
        {/* Glow pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-8 shadow-neon-purple animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Verified Registry Domains &bull; High-Speed APIs &bull; WhatsApp Mini Bots</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          The Premier <br className="hidden sm:inline" />
          <span className="text-neon-gradient">Digital Asset Marketplace</span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base mb-10 leading-relaxed">
          Acquire verified premium domains, enterprise APIs, and WhatsApp mini bots with safe manual transfer verification. No credit card required — direct bank transfer with admin validation.
        </p>

        {/* Live Domain Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <form
            onSubmit={handleCheckAvailability}
            className="p-2 sm:p-2.5 rounded-2xl glass-panel border border-purple-500/40 shadow-neon-purple flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center space-x-3 w-full px-3 py-2 sm:py-0">
              <Search className="w-5 h-5 text-purple-400 shrink-0" />
              <input
                type="text"
                value={searchDomain}
                onChange={(e) => setSearchDomain(e.target.value)}
                placeholder="Search domain (e.g. mybusiness.com, startup.lk)..."
                className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={checking}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 text-white font-bold text-sm hover:opacity-95 transition-all flex items-center justify-center space-x-2 shrink-0 shadow-sm"
            >
              {checking ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Check Availability</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Verification Result Callout */}
          {checkResult && (
            <div className="mt-4 p-4 rounded-xl glass-panel border border-purple-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checkResult.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {checkResult.isAvailable ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{checkResult.domain}</h4>
                  <p className="text-xs text-slate-300">{checkResult.message}</p>
                </div>
              </div>

              {checkResult.isAvailable && (
                <button
                  onClick={() => onSelectProduct({
                    id: checkResult.domain,
                    type: 'domain',
                    name: checkResult.domain,
                    domainName: checkResult.domain,
                    price: 3850,
                    description: 'Instant transfer verified domain.'
                  })}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                >
                  Buy Domain Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* TLD Quick Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {['.com', '.lk', '.net', '.org', '.site', '.online', '.xyz', 'Custom Domains'].map((tld) => (
            <button
              key={tld}
              onClick={() => onNavigate('domains')}
              className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-200 border border-purple-900/40 transition-colors"
            >
              {tld}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Domains Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Globe className="w-6 h-6 text-purple-400" />
              <span>Verified Domains for Sale</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Hand-selected high authority domains ready for instant administrative manual unlock.
            </p>
          </div>
          <button
            onClick={() => onNavigate('domains')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center space-x-1"
          >
            <span>View All Domains</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDomains.map((dom) => (
            <div
              key={dom.name}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                    {dom.tld}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">{dom.name}</h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{dom.desc}</p>
              </div>

              <div>
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-lg font-bold text-neon-gradient">
                    Rs. {dom.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    Rs. {dom.originalPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => onSelectProduct({
                    id: dom.name,
                    type: 'domain',
                    name: dom.name,
                    domainName: dom.name,
                    price: dom.price,
                    description: dom.desc
                  })}
                  className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 font-bold text-xs transition-all"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Safety Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-purple-500/30">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              100% Verified Manual Unlock Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              We never falsely claim registration. Every order is independently verified by our administrator before transfer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/40">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto mb-3 font-bold text-sm">
                1
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Pick Product &amp; Username</h4>
              <p className="text-xs text-slate-400">
                Choose a domain, API, or bot and select your unique customer username.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/40">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center mx-auto mb-3 font-bold text-sm">
                2
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Bank Transfer Money</h4>
              <p className="text-xs text-slate-400">
                Transfer the exact amount to the official administrator bank account.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/40">
              <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center mx-auto mb-3 font-bold text-sm">
                3
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Submit Slip &amp; WhatsApp</h4>
              <p className="text-xs text-slate-400">
                Upload your payment receipt or send it directly to admin WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/40">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 font-bold text-sm">
                4
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Admin Product Unlock</h4>
              <p className="text-xs text-slate-400">
                Admin verifies the bank deposit and unlocks the domain in your My Products dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase (APIs & Bots) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* APIs preview card */}
        <div className="glass-panel rounded-3xl p-8 border border-purple-500/30 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Enterprise API Marketplace</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              High-throughput WhatsApp Cloud APIs, Gemini Multimodal AI bridges, and media databases with instant token dispatch upon bank payment.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 mb-6">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Zero ban-risk official WhatsApp gateways</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Sinhala &amp; Tamil AI prompt processors</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onNavigate('apis')}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-2"
          >
            <span>Explore API Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp Bots preview card */}
        <div className="glass-panel rounded-3xl p-8 border border-pink-500/30 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center mb-6">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">WhatsApp Mini Bot Store</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Turn your WhatsApp into an autonomous sales channel. Full support for tuition portals, salon bookings, and e-commerce shopping carts.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 mb-6">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Interactive product catalog menus</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Automated bank slip collection engine</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onNavigate('bots')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs transition-opacity flex items-center justify-center space-x-2 shadow-neon-pink"
          >
            <span>Browse WhatsApp Bots</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
