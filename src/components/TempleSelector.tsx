import React from 'react';
import { Temple } from '../types';
import { Landmark, MapPin, Sparkles } from 'lucide-react';

interface TempleSelectorProps {
  temples: Temple[];
  selectedTempleId: string;
  onSelectTemple: (templeId: string) => void;
  isLoading?: boolean;
}

export const TempleSelector: React.FC<TempleSelectorProps> = ({
  temples,
  selectedTempleId,
  onSelectTemple,
  isLoading = false,
}) => {
  const selectedTemple = temples.find((t) => t.id === selectedTempleId);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 p-5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <label
            htmlFor="temple-select"
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-temple-800"
          >
            <Landmark className="w-4 h-4 text-amber-600" />
            <span>Select Sacred Temple</span>
          </label>
          <p className="text-xs text-slate-500">
            Choose the shrine where your ritual offering will be conducted
          </p>
        </div>

        <div className="w-full md:w-96">
          <select
            id="temple-select"
            value={selectedTempleId}
            disabled={isLoading || temples.length === 0}
            onChange={(e) => onSelectTemple(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 font-medium text-sm focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {temples.map((temple) => (
              <option key={temple.id} value={temple.id}>
                {temple.name} ({temple.deity})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedTemple && (
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-temple-900 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Presiding Deity: <strong>{selectedTemple.deity}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{selectedTemple.location}</span>
          </div>
        </div>
      )}
    </div>
  );
};
