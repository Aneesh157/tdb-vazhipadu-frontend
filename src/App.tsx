import React, { useState, useEffect, useCallback } from 'react';
import { Temple, Offering } from './types';
import { getTemples, getOfferings } from './api';
import { Navbar } from './components/Navbar';
import { TempleSelector } from './components/TempleSelector';
import { OfferingsList } from './components/OfferingsList';
import { Cart } from './components/Cart';
import { OrderForm, OrderFormData } from './components/OrderForm';
import { useCart } from './hooks/useCart';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'booking' | 'orders'>('booking');

  // Temples state
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTempleId, setSelectedTempleId] = useState<string>('');
  const [isTemplesLoading, setIsTemplesLoading] = useState<boolean>(true);

  // Offerings state
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isOfferingsLoading, setIsOfferingsLoading] = useState<boolean>(false);
  const [offeringsError, setOfferingsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart state via custom hook (persisted in localStorage)
  const {
    items: cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalAmount,
    totalCount,
    cartQuantities,
  } = useCart();

  // Order form state
  const [formData, setFormData] = useState<OrderFormData>({
    devoteeName: '',
    phoneNumber: '',
    nakshatra: '',
    offeringDate: '',
  });

  const handleFormFieldChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch initial temples
  useEffect(() => {
    let isMounted = true;
    const fetchTemples = async () => {
      setIsTemplesLoading(true);
      try {
        const data = await getTemples();
        if (isMounted) {
          setTemples(data);
          if (data.length > 0) {
            setSelectedTempleId(data[0].id);
          }
        }
      } catch {
        // Fallback handled
      } finally {
        if (isMounted) setIsTemplesLoading(false);
      }
    };

    fetchTemples();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch offerings whenever selected temple changes
  const loadOfferings = useCallback(async (templeId: string) => {
    if (!templeId) return;
    setIsOfferingsLoading(true);
    setOfferingsError(null);

    try {
      const data = await getOfferings(templeId);
      setOfferings(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to retrieve temple offerings. Please check your network connection.';
      setOfferingsError(message);
      setOfferings([]);
    } finally {
      setIsOfferingsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTempleId) {
      loadOfferings(selectedTempleId);
    }
  }, [selectedTempleId, loadOfferings]);

  const handleSelectTemple = (templeId: string) => {
    setSelectedTempleId(templeId);
    setSearchQuery('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handled in P3 for mock API placement
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-slate-50 to-slate-100 flex flex-col font-sans text-slate-900">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={totalCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {activeTab === 'booking' ? (
          <>
            {/* Sacred Temple Header & Selector */}
            <TempleSelector
              temples={temples}
              selectedTempleId={selectedTempleId}
              onSelectTemple={handleSelectTemple}
              isLoading={isTemplesLoading}
            />

            {/* Main Booking Section: Offerings List on Left (8 cols), Cart & Form on Right (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Offerings Catalog */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                <OfferingsList
                  offerings={offerings}
                  isLoading={isOfferingsLoading}
                  error={offeringsError}
                  onRetry={() => loadOfferings(selectedTempleId)}
                  onAddToCart={addToCart}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  cartQuantities={cartQuantities}
                />
              </div>

              {/* Right Column: Cart & Devotee Booking Form */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-6 sticky top-24">
                <Cart
                  items={cartItems}
                  totalAmount={totalAmount}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                  onClearCart={clearCart}
                />

                <OrderForm
                  formData={formData}
                  onChange={handleFormFieldChange}
                  onSubmit={handleFormSubmit}
                  hasItems={cartItems.length > 0}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-slate-500">
            Orders portal will be loaded in P4.
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p>© 2026 Travancore Devaswom Board. Vazhipadu Online Booking System.</p>
          <p className="text-slate-500 text-[11px]">Strict Mode React 18+ • TypeScript • Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
