import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ParticleBackground } from './components/ParticleBackground';
import { OrderModal } from './components/OrderModal';
import { ReceiptModal } from './components/ReceiptModal';

// Pages
import { HomePage } from './pages/HomePage';
import { DomainsPage } from './pages/DomainsPage';
import { ApisPage } from './pages/ApisPage';
import { BotsPage } from './pages/BotsPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductsPage } from './pages/ProductsPage';
import { PaymentInstructionsPage } from './pages/PaymentInstructionsPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [customerUsername, setCustomerUsername] = useState<string>('demo_user');

  // Checkout & Order Modal state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Receipt Modal state
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptModalProps, setReceiptModalProps] = useState<{
    orderId?: string;
    amount?: number;
    productName?: string;
    domainName?: string;
  }>({});

  const handleOpenOrder = (product: any) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleOpenReceiptModal = (
    orderId: string = '',
    amount: number = 0,
    productName: string = '',
    domainName: string = ''
  ) => {
    setReceiptModalProps({ orderId, amount, productName, domainName });
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#080511] text-slate-100 flex flex-col justify-between">
      {/* Animated Glowing Particle & Gradient Canvas */}
      <ParticleBackground />

      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        customerUsername={customerUsername}
        onSetCustomerUsername={setCustomerUsername}
      />

      {/* Main Page View */}
      <main className="relative z-10 flex-grow pb-12">
        {currentPage === 'home' && (
          <HomePage onNavigate={setCurrentPage} onSelectProduct={handleOpenOrder} />
        )}
        {currentPage === 'domains' && (
          <DomainsPage onSelectProduct={handleOpenOrder} />
        )}
        {currentPage === 'apis' && (
          <ApisPage onSelectProduct={handleOpenOrder} />
        )}
        {currentPage === 'bots' && (
          <BotsPage onSelectProduct={handleOpenOrder} />
        )}
        {currentPage === 'orders' && (
          <OrdersPage
            currentUsername={customerUsername}
            onSetUsername={setCustomerUsername}
            onOpenReceiptModal={handleOpenReceiptModal}
          />
        )}
        {currentPage === 'products' && (
          <ProductsPage
            currentUsername={customerUsername}
            onSetUsername={setCustomerUsername}
          />
        )}
        {currentPage === 'payment' && (
          <PaymentInstructionsPage
            onOpenReceiptModal={() => handleOpenReceiptModal()}
            defaultUsername={customerUsername}
          />
        )}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'admin' && <AdminDashboardPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* Checkout / Order Placement Modal */}
      <OrderModal
        product={selectedProduct}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        defaultUsername={customerUsername}
        onOrderSuccess={(order) => {
          setCustomerUsername(order.username);
        }}
        onOpenReceiptModal={(orderId, amount, productName, domainName) => {
          handleOpenReceiptModal(orderId, amount, productName, domainName);
        }}
      />

      {/* Bank Receipt Upload Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        orderId={receiptModalProps.orderId}
        defaultUsername={customerUsername}
        amount={receiptModalProps.amount}
        productName={receiptModalProps.productName}
        domainName={receiptModalProps.domainName}
      />
    </div>
  );
}

export default App;
