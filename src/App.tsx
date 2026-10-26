import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Temple, Offering, Order } from './types';
import { getTemples, getOfferings, createOrder } from './api';
import { Navbar } from './components/Navbar';
import { TempleSelector } from './components/TempleSelector';
import { OfferingsList } from './components/OfferingsList';
import { Cart } from './components/Cart';
import { OrderForm, OrderFormData } from './components/OrderForm';
import { OrderConfirmation } from './components/OrderConfirmation';
import { OrdersList } from './components/OrdersList';
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

  // Order placement state & double-click prevention
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const isSubmittingRef = useRef<boolean>(false);

  const handleFormFieldChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (submitError) setSubmitError(null);
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
        // Fallback
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

  // Order placement with double-click prevention and failure retention
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent concurrent/double submission
    if (isSubmittingRef.current || isSubmitting) {
      return;
    }
    if (cartItems.length === 0) {
      setSubmitError('Cart is empty. Please select at least one offering.');
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const newOrder = await createOrder({
        templeId: selectedTempleId,
        devoteeName: formData.devoteeName,
        phoneNumber: formData.phoneNumber,
        nakshatra: formData.nakshatra,
        offeringDate: formData.offeringDate,
        items: cartItems.map((item) => ({
          offeringId: item.offering.id,
          quantity: item.quantity,
        })),
      });

      // On success: empty cart, show confirmation screen, and scroll to top
      clearCart();
      setConfirmedOrder(newOrder);
      if (typeof window !== 'undefined' && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // Reset form data for subsequent bookings
      setFormData({
        devoteeName: '',
        phoneNumber: '',
        nakshatra: '',
        offeringDate: '',
      });
    } catch (err: unknown) {
      // On failure: cart and form values are preserved!
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Failed to place offering order. Please retry.';
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleResetAfterConfirmation = () => {
    setConfirmedOrder(null);
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-slate-50 to-slate-100 flex flex-col font-sans text-slate-900">
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'booking' && confirmedOrder) {
            setConfirmedOrder(null);
          }
        }}
        cartCount={totalCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {activeTab === 'booking' ? (
          confirmedOrder ? (
            /* P3 Confirmation Screen on Order Placement Success */
            <OrderConfirmation
              order={confirmedOrder}
              onReset={handleResetAfterConfirmation}
            />
          ) : (
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
              <div
                id="booking-form-section"
                className="lg:col-span-5 xl:col-span-4 space-y-6 sticky top-24"
              >
                <Cart
                  items={cartItems}
                  totalAmount={totalAmount}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                  onClearCart={clearCart}
                  isSubmitting={isSubmitting}
                />

                <OrderForm
                  formData={formData}
                  onChange={handleFormFieldChange}
                  onSubmit={handlePlaceOrder}
                  isSubmitting={isSubmitting}
                  submitError={submitError}
                  hasItems={cartItems.length > 0}
                />
              </div>
            </div>

            {/* Mobile Bottom Quick-Action Bar (visible only when cart has items on mobile) */}
            {cartItems.length > 0 && (
              <aside
                aria-label="Mobile Cart Summary"
                className="lg:hidden fixed bottom-4 inset-x-4 z-30"
              >
                <a
                  href="#booking-form-section"
                  className="w-full bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700/60 flex items-center justify-between transition-transform active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                      {totalCount}
                    </span>
                    <span className="text-xs text-slate-300">
                      Total: <strong className="text-white text-sm">₹{totalAmount}</strong>
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-amber-400 underline">
                    Complete Devotee Details ↓
                  </span>
                </a>
              </aside>
            )}
            </>
          )
        ) : (
          /* P4 Temple Staff Orders Management Screen */
          <OrdersList />
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
