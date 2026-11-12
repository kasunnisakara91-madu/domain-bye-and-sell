import React from 'react';
import { Globe, Shield, MessageSquare, CreditCard, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#07040F] border-t border-purple-900/30 text-slate-400 text-sm mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold text-white">
              DOMAIN<span className="text-neon-gradient">SELL</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The premier dark-themed digital marketplace for high-authority domains, enterprise APIs, and automated WhatsApp mini bots.
          </p>
          <div className="flex items-center space-x-2 text-xs text-purple-400">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Guaranteed Manual Transfer Verification</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
            Marketplace
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('domains')} className="hover:text-purple-300 transition-colors">
                Domain Store (.com, .lk, .xyz)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('apis')} className="hover:text-purple-300 transition-colors">
                API Marketplace (WhatsApp &amp; AI)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('bots')} className="hover:text-purple-300 transition-colors">
                WhatsApp Mini Bots
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('products')} className="hover:text-purple-300 transition-colors">
                Unlocked Customer Products
              </button>
            </li>
          </ul>
        </div>

        {/* Bank & Trust */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
            Payments &amp; Policy
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('payment')} className="hover:text-purple-300 transition-colors flex items-center space-x-1.5">
                <CreditCard className="w-3 h-3 text-purple-400" />
                <span>Bank Payment Instructions</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('orders')} className="hover:text-purple-300 transition-colors">
                Track Order &amp; Receipt Status
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-purple-300 transition-colors">
                Domain Transfer Safety Guarantee
              </button>
            </li>
            <li>
              <span className="text-slate-500">No Credit Card Required</span>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
            Admin &amp; WhatsApp
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Have questions about a domain transfer or API setup? Chat directly with the administrator.
          </p>
          <a
            href="https://wa.me/94771234567?text=Hello%20DOMAIN%20SELL%20Admin.%20I%20have%20an%20inquiry%20regarding%20domain%20purchases."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/30 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="border-t border-purple-950/60 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} DOMAIN SELL. Built with Dark Glassmorphism, Node.js &amp; Android Live Wallpaper.</p>
      </div>
    </footer>
  );
};
