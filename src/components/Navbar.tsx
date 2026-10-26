import React from 'react';
import { Flame, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'booking' | 'orders';
  onTabChange: (tab: 'booking' | 'orders') => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  cartCount = 0,
  onOpenCart,
}) => {
  return (
    <header className="bg-gradient-to-r from-temple-900 via-temple-800 to-temple-900 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-temple-gold/20 border border-temple-gold/40 flex items-center justify-center text-temple-gold shadow-inner">
              <Flame className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase tracking-widest font-semibold text-amber-200/80">
                  Devaswom Board
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Official
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold font-serif-temple tracking-wide text-amber-100">
                Vazhipadu Booking Portal
              </h1>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav aria-label="Main Navigation" className="flex items-center space-x-2 sm:space-x-4">
            <button
              id="nav-book-vazhipadu"
              type="button"
              onClick={() => onTabChange('booking')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'booking'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                  : 'text-amber-100/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              Book Vazhipadu
            </button>

            <button
              id="nav-staff-orders"
              type="button"
              onClick={() => onTabChange('orders')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                  : 'text-amber-100/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Staff Orders</span>
            </button>

            {onOpenCart && (
              <button
                id="header-cart-button"
                type="button"
                onClick={onOpenCart}
                aria-label={`Cart with ${cartCount} items`}
                className="relative lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 transition-colors"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
