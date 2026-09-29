import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, Navigation, X, Mic, ArrowRight, MapPin, Sparkles, Clock, Bookmark } from 'lucide-react';
import { LocationPoint, SavedPlace } from '../../types';
import { searchLocations } from '../../services/maps/geocoding';

interface GoogleMapsSearchBarProps {
  onOpenMenu: () => void;
  onOpenDirections: () => void;
  onSelectLocation: (point: LocationPoint) => void;
  savedPlaces: SavedPlace[];
  onOpenCategory: (cat: string) => void;
  activeCategory: string;
}

export const GoogleMapsSearchBar: React.FC<GoogleMapsSearchBarProps> = ({
  onOpenMenu,
  onOpenDirections,
  onSelectLocation,
  savedPlaces,
  onOpenCategory,
  activeCategory,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationPoint[]>([]);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    if (!isFocused) return;
    setIsSearching(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const results = await searchLocations(query);
      setSuggestions(results);
      setIsSearching(false);
    }, 140);
    return () => clearTimeout(timeoutRef.current);
  }, [query, isFocused]);

  const categoryPills = [
    { id: 'directions', label: 'Directions', icon: 'directions' },
    { id: 'smart_route', label: 'Smart Route', badge: 'AI' },
    { id: 'traffic', label: 'Traffic' },
    { id: 'prediction', label: 'Forecast' },
    { id: 'spillback', label: 'Congestion Impact' },
    { id: 'comparison', label: 'Compare' },
    { id: 'saved', label: 'Saved' },
    { id: 'history', label: 'History' },
  ];

  return (
    <div className="absolute top-3 left-4 z-30 flex flex-col gap-2 max-w-[calc(100vw-32px)]">
      {/* Floating White Google Maps Search Box */}
      <div className="relative w-[392px] max-w-[calc(100vw-32px)] bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0_rgba(0,0,0,0.02)] flex items-center h-12 px-3 gap-2 border border-gray-100">
        {/* Menu Hamburger */}
        <button
          onClick={onOpenMenu}
          aria-label="Side menu"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          title="Open DISHA menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Input */}
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search DISHA Maps"
          className="flex-1 text-sm text-gray-800 placeholder-gray-500 bg-transparent focus:outline-none"
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Magnifying Glass */}
        <button
          onClick={async () => {
            if (query) {
              const res = await searchLocations(query);
              if (res.length > 0) {
                onSelectLocation(res[0]);
                setIsFocused(false);
              }
            }
          }}
          className="p-2 text-gray-500 hover:text-gray-800 rounded-full transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        <div className="w-[1px] h-6 bg-gray-200" />

        {/* Google Maps Blue Circular Directions Button */}
        <button
          onClick={onOpenDirections}
          title="Directions"
          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Navigation className="w-4 h-4 fill-current rotate-45" />
        </button>
      </div>

      {/* Dropdown Suggestions Card */}
      {isFocused && (
        <div className="w-[392px] max-w-[calc(100vw-32px)] bg-white rounded-lg shadow-xl border border-gray-200/80 overflow-hidden animate-in fade-in duration-100 py-1">
          <div className="flex items-center justify-between px-3 py-1.5 text-[11px] text-gray-500 font-medium border-b border-gray-100 bg-gray-50/70">
            <span className="flex items-center gap-1.5">
              {isSearching ? (
                <>
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Searching locations...</span>
                </>
              ) : (
                <span>Suggested places</span>
              )}
            </span>
            <button
              onClick={() => setIsFocused(false)}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              Close
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {!isSearching && suggestions.length === 0 && (
              <div className="p-6 text-center text-gray-400 space-y-1">
                <Search className="w-5 h-5 mx-auto text-gray-300" />
                <div className="text-xs font-medium text-gray-600">No matching places found</div>
                <div className="text-[11px] text-gray-400">
                  Try "Majestic", "Electronic City", "Silk Board", or "Airport"
                </div>
              </div>
            )}

            {suggestions.map((loc, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectLocation(loc);
                  setIsFocused(false);
                  setQuery(loc.name);
                }}
                className="px-3.5 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3 group transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-gray-900 truncate group-hover:text-blue-600">
                    {loc.name}
                  </div>
                  {loc.address && (
                    <div className="text-[11px] text-gray-500 truncate">{loc.address}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Saved places link in suggestion */}
            {savedPlaces.length > 0 && (
              <div className="p-2 bg-gray-50/70">
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider px-2 mb-1">
                  Saved Destinations
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {savedPlaces.map((sp) => (
                    <button
                      key={sp.id}
                      onClick={() => {
                        onSelectLocation(sp.location);
                        setIsFocused(false);
                      }}
                      className="px-2 py-1 bg-white hover:bg-blue-50 border border-gray-200 rounded text-xs text-gray-700 flex items-center gap-1 shadow-2xs"
                    >
                      <Bookmark className="w-3 h-3 text-blue-600" />
                      <span>{sp.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Google Maps Horizontal Scrolling Pills */}
      {!isFocused && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[calc(100vw-32px)] scrollbar-none">
          {categoryPills.map((pill) => {
            const isActive = activeCategory === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => onOpenCategory(pill.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-all flex items-center gap-1.5 border shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200/80 hover:shadow-[0_2px_4px_rgba(0,0,0,0.2)]'
                }`}
              >
                {pill.id === 'directions' && (
                  <Navigation className="w-3.5 h-3.5 fill-current rotate-45" />
                )}
                {pill.id === 'smart_route' && (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
