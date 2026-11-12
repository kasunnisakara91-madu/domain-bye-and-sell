import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Check, ArrowRight, Sparkles, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';

interface BotsPageProps {
  onSelectProduct: (product: any) => void;
}

export const BotsPage: React.FC<BotsPageProps> = ({ onSelectProduct }) => {
  const [bots, setBots] = useState<any[]>([]);
  const [activeSetupBot, setActiveSetupBot] = useState<any>(null);
  const adminWhatsApp = '94771234567';

  useEffect(() => {
    fetch('/api/bots')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.bots) setBots(data.bots);
      })
      .catch(() => {
        setBots([
          {
            _id: 'bot-1',
            name: 'WhatsApp E-Commerce Store Bot',
            price: 8500,
            originalPrice: 12000,
            description: 'Turn your WhatsApp into a 24/7 revenue powerhouse. Handles product browsing, ordering, and receipt collection automatically.',
            features: [
              'Interactive product catalog with image menus',
              'Automated shopping cart & checkout calculator',
              'Bank receipt verification submission link',
              'Order tracking by reference ID',
              'Admin instant dispatch alert'
            ],
            setupInstructions: '1. Connect Meta Cloud Phone ID\n2. Configure Webhook URL in Meta App\n3. Upload your products CSV or sync with MongoDB\n4. Bot automatically takes orders and prompts for bank slips.'
          },
          {
            _id: 'bot-2',
            name: 'AI Smart Customer Support Bot',
            price: 7200,
            originalPrice: 9800,
            description: 'Delight clients with hyper-intelligent instant answers in Sinhala, Tamil, or English with seamless human escalation.',
            features: [
              'Understands Sinhala, Tamil & English prompts',
              'Trained on your business FAQ and price sheet',
              'Human agent handover trigger',
              '24/7 instant replies with zero delay',
              'Lead capture to CSV / Google Sheet'
            ],
            setupInstructions: '1. Provide FAQ documents or website link\n2. Configure business opening hours\n3. Set trigger keywords for human agent escalation.'
          },
          {
            _id: 'bot-3',
            name: 'Salon, Clinic & Service Booking Bot',
            price: 6800,
            originalPrice: 9000,
            description: 'Completely eliminates scheduling phone calls. Book clients directly inside their WhatsApp chat with automated reminders.',
            features: [
              'Real-time calendar slot checking',
              'Appointment confirmation & Google Calendar sync',
              'Automated reminder 2 hours prior to booking',
              'Cancellation and rescheduling self-service',
              'Advance deposit payment verification'
            ],
            setupInstructions: '1. Connect Google Calendar or Outlook\n2. Set service durations and time buffers\n3. Specify bank details for appointment advance deposits.'
          },
          {
            _id: 'bot-4',
            name: 'Tuition Class & Student Portal Bot',
            price: 6400,
            originalPrice: 8500,
            description: 'Specially architected for Sri Lankan tuition masters and institutes. Automates class fee verification and lecture link distribution.',
            features: [
              'Student registration by index number',
              'Monthly class fee bank receipt upload',
              'Automated Zoom/YouTube lecture link dispatcher',
              'Exam timetable & marks lookup',
              'Parent SMS/WhatsApp notification'
            ],
            setupInstructions: '1. Upload student roster or index numbers\n2. Set monthly fee cutoff date\n3. Admin verifies slip in portal to auto-dispatch Zoom link.'
          },
          {
            _id: 'bot-5',
            name: 'Real Estate & Auto Dealer Lead Bot',
            price: 7800,
            originalPrice: 10500,
            description: 'Capture high-intent leads from Facebook and Instagram ads directly into WhatsApp and qualify their budget automatically.',
            features: [
              'Interactive questionnaire qualification',
              'Budget & location preference filtering',
              'Instant PDF brochure delivery',
              'Automated WhatsApp notification to sales reps',
              'CRM webhook integration'
            ],
            setupInstructions: '1. Link WhatsApp number to Meta Ads manager\n2. Customize qualification questionnaire\n3. Assign sales rep phone numbers for lead alerts.'
          }
        ]);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-950/70 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
          <Bot className="w-3.5 h-3.5" />
          <span>Autonomous Business Assistants</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
          WhatsApp Mini Bot <span className="text-neon-gradient">Marketplace</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Ready-to-deploy WhatsApp bots powered by official Meta cloud webhooks. Automate sales, appointments, and tuition fee slip verification.
        </p>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot) => (
          <div
            key={bot._id || bot.name}
            className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 flex items-center space-x-1">
                  <Bot className="w-3 h-3 text-pink-400" />
                  <span>Meta Platform Ready</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">Instant Dispatch</span>
              </div>

              <h3 className="text-xl font-extrabold text-white mb-2">{bot.name}</h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">{bot.description}</p>

              {/* Features List */}
              <div className="space-y-2 mb-6">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 block">
                  Core Bot Capabilities:
                </span>
                {bot.features.map((feat: string, i: number) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-purple-900/40">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-xs text-slate-400 block">One-Time Setup</span>
                  <span className="text-xl font-extrabold text-neon-gradient">
                    Rs. {Number(bot.price).toLocaleString()}
                  </span>
                </div>
                {bot.originalPrice > bot.price && (
                  <span className="text-xs text-slate-500 line-through">
                    Rs. {Number(bot.originalPrice).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setActiveSetupBot(bot)}
                  className="py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1 border border-white/10"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Setup Guide</span>
                </button>

                <a
                  href={`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(
                    `Hello DOMAIN SELL Admin. I am interested in testing the demo for: ${bot.name}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-1 border border-emerald-500/30"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => onSelectProduct({
                  id: bot._id || bot.name,
                  type: 'bot',
                  name: bot.name,
                  price: bot.price,
                  description: bot.description
                })}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-neon-pink transition-opacity flex items-center justify-center space-x-1.5"
              >
                <span>Purchase Bot Package</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Setup Guide Modal */}
      {activeSetupBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#120A24] border border-purple-500/40 rounded-2xl p-6 shadow-glass">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-400">Setup Instructions</span>
                <h3 className="text-base font-bold text-white">{activeSetupBot.name}</h3>
              </div>
              <button onClick={() => setActiveSetupBot(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-black/50 p-4 rounded-xl border border-purple-900/50 mb-5 font-mono">
              {activeSetupBot.setupInstructions || 'Standard official WhatsApp Business setup via Meta Cloud API.'}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setActiveSetupBot(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const toBuy = activeSetupBot;
                  setActiveSetupBot(null);
                  onSelectProduct({
                    id: toBuy._id || toBuy.name,
                    type: 'bot',
                    name: toBuy.name,
                    price: toBuy.price,
                    description: toBuy.description
                  });
                }}
                className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-neon-pink"
              >
                Order This Bot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
