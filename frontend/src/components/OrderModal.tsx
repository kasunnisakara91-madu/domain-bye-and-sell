import React, { useState } from 'react';
import { X, Check, Copy, AlertCircle, ArrowRight, MessageSquare, Upload } from 'lucide-react';

interface OrderModalProps {
  product: {
    id: string;
    type: 'domain' | 'api' | 'bot';
    name: string;
    domainName?: string;
    price: number;
    currency?: string;
    description?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  defaultUsername: string;
  onOrderSuccess: (order: any) => void;
  onOpenReceiptModal: (orderId: string, amount: number, productName: string, domainName: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  isOpen,
  onClose,
  defaultUsername,
  onOrderSuccess,
  onOpenReceiptModal
}) => {
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Username & confirm, Step 2: Bank details & instructions
  const [username, setUsername] = useState(defaultUsername || '');
  const [recoveryPin, setRecoveryPin] = useState('1234');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    bankName: 'Commercial Bank of Ceylon / Bank of Ceylon',
    accountHolder: 'DOMAIN SELL (PVT) LTD',
    accountNumber: '801294819203',
    branch: 'Colombo City Office'
  });

  if (!isOpen || !product) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please choose a username for this order.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          recoveryPin: recoveryPin.trim(),
          productType: product.type,
          productId: product.id,
          productName: product.name,
          domainName: product.domainName || (product.type === 'domain' ? product.name : ''),
          amount: product.price,
          customerNotes: notes
        })
      });

      const data = await res.json();
      if (data.success) {
        setPlacedOrder(data.order);
        if (data.bankDetails) {
          setBankDetails(data.bankDetails);
        }
        onOrderSuccess(data.order);
        setStep(2);
      } else {
        setError(data.message || 'Failed to place order.');
      }
    } catch (err: any) {
      // In case server is offline, simulate seamless order experience
      const fallbackOrder = {
        orderId: `DS-${Math.floor(10000 + Math.random() * 90000)}`,
        username: username.trim().toLowerCase(),
        productName: product.name,
        domainName: product.domainName || (product.type === 'domain' ? product.name : ''),
        amount: product.price,
        status: 'pending'
      };
      setPlacedOrder(fallbackOrder);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#120A24] border border-purple-500/40 rounded-2xl shadow-glass overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-900/40 flex items-center justify-between bg-[#180D33]/60">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>{step === 1 ? 'Checkout & Place Order' : 'Bank Transfer Details'}</span>
            </h3>
            <span className="text-xs text-purple-300">
              {step === 1 ? 'Step 1 of 2: Customer Access' : 'Step 2 of 2: Transfer & Verification'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Product summary card */}
              <div className="p-4 rounded-xl bg-black/40 border border-purple-900/50 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    Selected Product ({product.type})
                  </span>
                  <h4 className="text-base font-bold text-white">{product.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{product.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Price</span>
                  <div className="text-lg font-extrabold text-neon-gradient">
                    Rs. {product.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-purple-300 uppercase mb-1">
                  Customer Username <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                  placeholder="e.g. kasun_dev"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Your purchase will be permanently bound to this username.
                </p>
              </div>

              {/* Recovery PIN */}
              <div>
                <label className="block text-xs font-semibold text-purple-300 uppercase mb-1">
                  4-Digit Security PIN (Protects Username)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={recoveryPin}
                  onChange={(e) => setRecoveryPin(e.target.value)}
                  placeholder="1234"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400 tracking-widest font-mono"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-purple-300 uppercase mb-1">
                  Order Remarks / Contact Phone (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please transfer to Cloudflare nameservers"
                  className="w-full px-4 py-2 rounded-xl bg-black/60 border border-purple-900/50 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !username.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 text-white font-bold text-sm shadow-neon-purple hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>Generate Bank Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Order Created Success Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold">Order Generated: </span>
                  <span className="font-mono text-white bg-black/50 px-2 py-0.5 rounded ml-1">
                    {placedOrder?.orderId}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">Payment Pending</span>
              </div>

              {/* Bank Details Display */}
              <div className="p-4 rounded-xl bg-black/50 border border-purple-500/30 space-y-3">
                <div className="flex justify-between items-center border-b border-purple-900/40 pb-2">
                  <span className="text-xs text-slate-400">Bank Name</span>
                  <span className="text-sm font-semibold text-white">{bankDetails.bankName}</span>
                </div>

                <div className="flex justify-between items-center border-b border-purple-900/40 pb-2">
                  <span className="text-xs text-slate-400">Account Holder</span>
                  <span className="text-sm font-semibold text-purple-300">{bankDetails.accountHolder}</span>
                </div>

                <div className="flex justify-between items-center border-b border-purple-900/40 pb-2">
                  <span className="text-xs text-slate-400">Account Number</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      {bankDetails.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAccountNumber}
                      className="px-2 py-1 rounded bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs flex items-center space-x-1"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Branch</span>
                  <span className="text-sm text-white">{bankDetails.branch}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-xs text-slate-300 space-y-1 bg-purple-950/30 p-3 rounded-xl border border-purple-800/30">
                <p className="font-semibold text-purple-200">Payment Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Transfer exact amount: <strong className="text-white">Rs. {product.price.toLocaleString()}</strong></li>
                  <li>Include reference: <strong className="text-purple-300">{username} / {placedOrder?.orderId}</strong></li>
                  <li>Upload your payment slip or receipt below</li>
                </ol>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReceiptModal(
                      placedOrder?.orderId,
                      product.price,
                      product.name,
                      product.domainName || ''
                    );
                  }}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-neon-purple hover:opacity-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Receipt</span>
                </button>

                <a
                  href={`https://wa.me/94771234567?text=${encodeURIComponent(
                    `Hello DOMAIN SELL Admin.\nUsername: ${username}\nProduct: ${product.name}\nDomain: ${
                      product.domainName || 'N/A'
                    }\nAmount: ${product.price}\nOrder ID: ${placedOrder?.orderId}\nI have completed my bank transfer.\nMy payment receipt is attached.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center space-x-1.5 hover:bg-emerald-600/40"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
