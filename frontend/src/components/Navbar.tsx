import React, { useState } from 'react';
import { Globe, Cpu, Bot, ShoppingBag, ShieldCheck, CreditCard, Phone, User, Menu, X, LogIn } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  customerUsername: string;
  onSetCustomerUsername: (username: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  customerUsername,
  onSetCustomerUsername
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Globe },
    { id: 'domains', label: 'Domains', icon: Globe },
    { id: 'apis', label: 'APIs', icon: Cpu },
    { id: 'bots', label: 'WhatsApp Bots', icon: Bot },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'products', label: 'My Products', icon: ShieldCheck },
    { id: 'payment', label: 'Bank Payment', icon: CreditCard },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  const handleSaveUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      onSetCustomerUsername(usernameInput.trim().toLowerCase());
      setShowUserModal(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-500 to-pink-500 flex items-center justify-center p-0.5 shadow-neon-purple group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#0B0717] rounded-[10px] flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider text-white">
                DOMAIN<span className="text-neon-gradient">SELL</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-purple-400 font-semibold">
                Official Marketplace
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-75" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTA & User Tag */}
          <div className="hidden sm:flex items-center space-x-3">
            {customerUsername ? (
              <button
                onClick={() => setShowUserModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center space-x-2 hover:border-purple-400 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>@{customerUsername}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowUserModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 border border-white/10 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-purple-400" />
                <span>Set Username</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('admin')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                currentPage === 'admin'
                  ? 'bg-pink-600 text-white shadow-neon-pink'
                  : 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-700/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
              <span>Admin</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0F0A21] border-b border-purple-900/50 px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-3 ${
                  currentPage === item.id
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4 text-purple-400" />
                <span>{item.label}</span>
              </button>
            ))}

            <div className="pt-3 border-t border-purple-900/30 flex justify-between items-center">
              <button
                onClick={() => {
                  setShowUserModal(true);
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-purple-950 border border-purple-500/30 text-purple-300 text-xs font-medium"
              >
                {customerUsername ? `@${customerUsername}` : 'Login / Set Username'}
              </button>
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-pink-600 text-white text-xs font-semibold"
              >
                Admin Panel
              </button>
            </div>
          </div>
        )}
      </header>

      {/* User Switch Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#120A24] border border-purple-500/40 rounded-2xl p-6 shadow-glass relative">
            <button
              onClick={() => setShowUserModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2">Customer Access</h3>
            <p className="text-xs text-slate-300 mb-4">
              Enter your unique username. No password or email needed. Orders and products are securely linked to this name.
            </p>
            <form onSubmit={handleSaveUsername} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-300 uppercase mb-1">
                  Unique Username
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                  placeholder="e.g. kasun_dev"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-purple-500/30 text-white focus:outline-none focus:border-purple-400 text-sm"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 text-sm hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!usernameInput.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:opacity-95 disabled:opacity-50"
                >
                  Save Username
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
