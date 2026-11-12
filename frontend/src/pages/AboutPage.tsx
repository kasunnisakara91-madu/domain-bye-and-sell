import React from 'react';
import { ShieldCheck, Globe, Zap, Lock, CheckCircle2, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Security &amp; Registry Verification</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
          About <span className="text-neon-gradient">DOMAIN SELL</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The certified marketplace engineered for reliable domain transfers, high-speed API keys, and autonomous WhatsApp business robots.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-purple-500/30 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Our Zero-Fake-Registration Commitment</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Unlike automated registrars that capture credit cards before querying top-level DNS root servers, DOMAIN SELL enforces two-layer verification:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-black/40 border border-purple-900/40 space-y-2">
            <h4 className="font-bold text-white">DNS Root Server Validation</h4>
            <p className="text-slate-400">
              Live NS queries verify whether a domain is taken externally prior to purchase confirmation.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-purple-900/40 space-y-2">
            <h4 className="font-bold text-white">Manual Administrative Unlock</h4>
            <p className="text-slate-400">
              Every domain transfer is manually authenticated by our certified registrar operations team.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="glass-panel rounded-2xl p-6 border border-purple-900/30">
          <div className="text-2xl font-extrabold text-neon-gradient mb-1">100%</div>
          <h4 className="text-xs font-bold text-white uppercase mb-2">Manual Bank Audits</h4>
          <p className="text-xs text-slate-400">
            No credit card chargebacks or processor holds.
          </p>
        </div>
        <div className="glass-panel rounded-2xl p-6 border border-purple-900/30">
          <div className="text-2xl font-extrabold text-neon-gradient mb-1">&lt; 15 Mins</div>
          <h4 className="text-xs font-bold text-white uppercase mb-2">Average Verification</h4>
          <p className="text-xs text-slate-400">
            Slips reviewed and unlocked directly by admin staff.
          </p>
        </div>
        <div className="glass-panel rounded-2xl p-6 border border-purple-900/30">
          <div className="text-2xl font-extrabold text-neon-gradient mb-1">Official Meta</div>
          <h4 className="text-xs font-bold text-white uppercase mb-2">WhatsApp Webhooks</h4>
          <p className="text-xs text-slate-400">
            Zero unofficial scraping; certified Cloud API architecture.
          </p>
        </div>
      </div>
    </div>
  );
};
