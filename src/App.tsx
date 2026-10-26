import React, { useState, useEffect, useCallback } from 'react';
import { Temple, Offering } from './types';
import { getTemples, getOfferings } from './api';
import { Navbar } from './components/Navbar';
import { TempleSelector } from './components/TempleSelector';
import { OfferingsList } from './components/OfferingsList';

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
        // Fallback or retry
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-slate-50 to-slate-100 flex flex-col font-sans text-slate-900">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

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

            {/* Offerings Grid with Search & Error Handling */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-12">
                <OfferingsList
                  offerings={offerings}
                  isLoading={isOfferingsLoading}
                  error={offeringsError}
                  onRetry={() => loadOfferings(selectedTempleId)}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
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
