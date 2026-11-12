import React, { useState } from 'react';
import { Phone, MessageSquare, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <Phone className="w-3.5 h-3.5" />
          <span>Support &amp; Verification Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Contact <span className="text-neon-gradient">Administrator</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Have an urgent domain transfer query or bank receipt question? Reach out to the administrator directly via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact info cards */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Official Admin WhatsApp</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fastest response channel for bank transfer receipt confirmation and custom domain requests.
            </p>
            <a
              href="https://wa.me/94771234567?text=Hello%20DOMAIN%20SELL%20Admin.%20I%20have%20an%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp (+94 77 123 4567)</span>
            </a>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Mail className="w-4 h-4 text-purple-400" />
              <span>Email Support</span>
            </h3>
            <p className="text-xs text-slate-400">
              For enterprise API contract inquiries and bulk custom domains:
            </p>
            <span className="text-xs font-mono text-purple-300 block">support@domainsell.lk</span>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-purple-900/40 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-pink-400" />
              <span>Office Location</span>
            </h3>
            <p className="text-xs text-slate-400">
              Colombo World Trade Center &bull; Colombo 01 &bull; Sri Lanka
            </p>
          </div>
        </div>

        {/* Message form */}
        <div className="glass-panel rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-bold text-white mb-2">Send an Inquiry</h3>
          <p className="text-xs text-slate-400 mb-6">
            Leave your contact details and message below.
          </p>

          {sent ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Message Dispatched!</h4>
              <p className="text-xs text-slate-300">
                Our administrative staff will get in touch with you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kasun Perera"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase mb-1">WhatsApp or Email</label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="+94 77 123 4567 or email"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase mb-1">Inquiry / Domain Request</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I would like to acquire a custom .lk domain..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-neon-purple hover:opacity-95 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
