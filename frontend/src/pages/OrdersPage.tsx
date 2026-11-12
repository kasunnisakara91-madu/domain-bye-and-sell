import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Clock, CheckCircle2, XCircle, ShieldCheck, ArrowRight, Upload, MessageSquare } from 'lucide-react';

interface OrdersPageProps {
  currentUsername: string;
  onSetUsername: (u: string) => void;
  onOpenReceiptModal: (orderId: string, amount: number, productName: string, domainName: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  currentUsername,
  onSetUsername,
  onOpenReceiptModal
}) => {
  const [usernameInput, setUsernameInput] = useState(currentUsername || '');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchOrders = async (u: string) => {
    if (!u.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders/customer/${encodeURIComponent(u.trim().toLowerCase())}`);
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUsername) {
      setUsernameInput(currentUsername);
      fetchOrders(currentUsername);
    }
  }, [currentUsername]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      onSetUsername(usernameInput.trim().toLowerCase());
      fetchOrders(usernameInput);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unlocked':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Unlocked &amp; Active</span>
          </span>
        );
      case 'verified':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[11px] font-bold flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Payment Verified</span>
          </span>
        );
      case 'payment_submitted':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Receipt In Review</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[11px] font-bold flex items-center space-x-1">
            <XCircle className="w-3 h-3" />
            <span>Payment Rejected</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-bold flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Awaiting Bank Slip</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Customer Order Tracker</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Track Your <span className="text-neon-gradient">Orders</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Enter your unique username below to view order progress, bank transfer status, and upload missing receipts.
        </p>
      </div>

      {/* Username Lookup Bar */}
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
          Look Up
        </button>
      </form>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16 text-purple-300 text-xs">Fetching order history...</div>
      ) : searched && orders.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl">
          <ShoppingBag className="w-10 h-10 text-purple-400 mx-auto mb-3 opacity-50" />
          <h4 className="text-white font-bold text-sm">No orders found for "@{usernameInput}"</h4>
          <p className="text-xs text-slate-400 mt-1">Make sure you typed the exact username chosen at checkout.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId || order._id}
              className="glass-panel rounded-2xl p-6 border border-purple-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    {order.orderId}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <h3 className="text-lg font-bold text-white pt-1">
                  {order.productName}
                  {order.domainName && (
                    <span className="text-purple-400 font-mono text-sm ml-2">({order.domainName})</span>
                  )}
                </h3>

                <p className="text-xs text-slate-400">
                  Customer: <strong className="text-slate-200">@{order.username}</strong> &bull; Amount: <strong className="text-neon-gradient">Rs. {Number(order.amount).toLocaleString()}</strong>
                </p>

                {order.adminNotes && (
                  <div className="text-xs text-purple-300 bg-purple-950/40 p-2 rounded-lg border border-purple-900/30 mt-2">
                    <strong>Admin Notice:</strong> {order.adminNotes}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {order.status === 'pending' && (
                  <button
                    onClick={() => onOpenReceiptModal(
                      order.orderId,
                      order.amount,
                      order.productName,
                      order.domainName || ''
                    )}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-neon-purple transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Slip</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/94771234567?text=${encodeURIComponent(
                    `Hello DOMAIN SELL Admin. Regarding my Order ${order.orderId} for ${order.productName} (Username: ${order.username}). Please check the status.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 border border-white/10 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Inquire</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
