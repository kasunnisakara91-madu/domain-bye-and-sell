import React, { useState, useEffect } from 'react';
import { CreditCard, Copy, Check, Upload, MessageSquare, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';

interface PaymentInstructionsPageProps {
  onOpenReceiptModal: () => void;
  defaultUsername: string;
}

export const PaymentInstructionsPage: React.FC<PaymentInstructionsPageProps> = ({
  onOpenReceiptModal,
  defaultUsername
}) => {
  const [bankDetails, setBankDetails] = useState({
    bankName: 'Commercial Bank of Ceylon / Bank of Ceylon',
    accountHolder: 'DOMAIN SELL (PVT) LTD',
    accountNumber: '801294819203',
    branch: 'Colombo City Office'
  });
  const [adminWhatsApp, setAdminWhatsApp] = useState('94771234567');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/payments/details')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.bankDetails) setBankDetails(data.bankDetails);
          if (data.whatsapp?.adminNumber) setAdminWhatsApp(data.whatsapp.adminNumber);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Direct Bank Transfer Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Bank Payment <span className="text-neon-gradient">Instructions</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          We strictly do not use automated credit card processors. Pay safely via online banking or branch cash deposit directly to the administrator.
        </p>
      </div>

      {/* Official Bank Account Card */}
      <div className="glass-panel rounded-3xl p-8 border border-purple-500/40 shadow-neon-purple relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-900/40 pb-6 mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 block mb-1">
              Official Administrator Receiving Account
            </span>
            <h2 className="text-2xl font-black text-white">{bankDetails.bankName}</h2>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-700/50 text-xs text-purple-300 font-semibold self-start sm:self-auto flex items-center space-x-1.5">
            <Shield className="w-4 h-4 text-pink-400" />
            <span>Sri Lanka Certified Banking</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 rounded-2xl bg-black/50 border border-purple-950">
            <span className="text-xs text-slate-400 block mb-1">Account Holder Name</span>
            <span className="text-base font-bold text-white">{bankDetails.accountHolder}</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/30 relative">
            <span className="text-xs text-slate-400 block mb-1">Account Number</span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-mono font-bold text-emerald-400">
                {bankDetails.accountNumber}
              </span>
              <button
                onClick={handleCopyAccountNumber}
                className="px-2.5 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs flex items-center space-x-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-purple-950">
            <span className="text-xs text-slate-400 block mb-1">Branch</span>
            <span className="text-base font-bold text-white">{bankDetails.branch}</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-purple-900/40">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Enter your Customer Username as the bank transfer description/remark</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onOpenReceiptModal}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-neon-purple hover:opacity-95 transition-all flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Submit Payment Slip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step by step checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-purple-900/30">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs mb-3">
            01
          </div>
          <h4 className="text-sm font-bold text-white mb-2">Perform Transfer</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Use your preferred bank app (Frimi, BOC B-App, Commercial ComBank Q+, HNB SOLO) to transfer the product amount.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-purple-900/30">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs mb-3">
            02
          </div>
          <h4 className="text-sm font-bold text-white mb-2">Save Receipt / Screenshot</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Save the electronic transaction confirmation or capture a clear photo of the physical bank deposit counter slip.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-purple-900/30">
          <div className="w-8 h-8 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center font-bold text-xs mb-3">
            03
          </div>
          <h4 className="text-sm font-bold text-white mb-2">Manual Unlock</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Admin reviews the deposit, approves the order ID, and unlocks the domain or API token into your account.
          </p>
        </div>
      </div>
    </div>
  );
};
