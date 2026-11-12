import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Key, Globe, Bot, Copy, Check, ExternalLink, Lock } from 'lucide-react';

interface ProductsPageProps {
  currentUsername: string;
  onSetUsername: (u: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ currentUsername, onSetUsername }) => {
  const [usernameInput, setUsernameInput] = useState(currentUsername || '');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchProfile = async (u: string) => {
    if (!u.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/customers/${encodeURIComponent(u.trim().toLowerCase())}`);
      const data = await res.json();
      if (data.success) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (e) {
      // Demo fallback unlocked item
      setProfile({
        username: u.trim().toLowerCase(),
        unlockedItems: [
          {
            itemType: 'domain',
            itemName: 'sltech.lk',
            domainName: 'sltech.lk',
            orderId: 'DS-28190',
            unlockedAt: new Date().toISOString(),
            credentials: {
              dnsRecords: 'ns1.domainsell.lk, ns2.domainsell.lk',
              accessInstructions: 'Domain registered and delegated to customer nameservers.'
            }
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUsername) {
      setUsernameInput(currentUsername);
      fetchProfile(currentUsername);
    }
  }, [currentUsername]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      onSetUsername(usernameInput.trim().toLowerCase());
      fetchProfile(usernameInput);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const unlockedItems = profile?.unlockedItems || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin-Unlocked Customer Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          My <span className="text-neon-gradient">Products</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Domains, API keys, and Bot access tokens officially unlocked by the administrator for your account.
        </p>
      </div>

      {/* Username Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
            placeholder="Enter customer username..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition-colors"
        >
          Access Portal
        </button>
      </form>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-purple-300 text-xs">Loading unlocked digital assets...</div>
      ) : unlockedItems.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl">
          <Lock className="w-10 h-10 text-purple-400 mx-auto mb-3 opacity-50" />
          <h4 className="text-white font-bold text-sm">No Unlocked Products for "@{usernameInput}" Yet</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Once your bank payment slip is verified by the administrator, your purchased domain or API will be unlocked here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {unlockedItems.map((item: any, idx: number) => {
            const isDomain = item.itemType === 'domain';
            const isApi = item.itemType === 'api';
            const isBot = item.itemType === 'bot';

            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-6 border border-emerald-500/40 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      {isDomain && <Globe className="w-4 h-4" />}
                      {isApi && <Key className="w-4 h-4" />}
                      {isBot && <Bot className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                        Verified {item.itemType}
                      </span>
                      <h3 className="text-base font-bold text-white">{item.itemName}</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-black/50 px-2 py-0.5 rounded">
                    {item.orderId}
                  </span>
                </div>

                {/* Domain details */}
                {isDomain && (
                  <div className="space-y-3 text-xs bg-black/40 p-3.5 rounded-xl border border-purple-900/40 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-sans">Active Nameservers</span>
                      <span className="text-purple-300">{item.credentials?.dnsRecords || 'ns1.domainsell.lk, ns2.domainsell.lk'}</span>
                    </div>
                    <div className="border-t border-purple-950 pt-2 text-[11px] text-slate-400 font-sans">
                      {item.credentials?.accessInstructions || 'Domain locked to your account with DNS delegation active.'}
                    </div>
                  </div>
                )}

                {/* API Key details */}
                {isApi && (
                  <div className="space-y-3 text-xs bg-black/40 p-3.5 rounded-xl border border-purple-900/40">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Secret API Key</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-emerald-400 text-xs">
                          {item.credentials?.apiKey || 'ds_live_928401928401824'}
                        </span>
                        <button
                          onClick={() => handleCopy(item.credentials?.apiKey || 'ds_live_928401928401824', `api-${idx}`)}
                          className="px-2 py-1 rounded bg-purple-950 hover:bg-purple-900 text-purple-200 text-xs flex items-center space-x-1"
                        >
                          {copiedKey === `api-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === `api-${idx}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bot details */}
                {isBot && (
                  <div className="space-y-3 text-xs bg-black/40 p-3.5 rounded-xl border border-purple-900/40">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Webhook Token</span>
                      <span className="font-mono text-purple-300 text-xs block truncate mt-1">
                        {item.credentials?.botToken || 'bot_tok_849201948201'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-purple-950 flex justify-between items-center text-[11px] text-slate-500">
                  <span>Owner: @{profile?.username}</span>
                  <span>Unlocked on {new Date(item.unlockedAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
