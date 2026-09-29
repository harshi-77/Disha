import React, { useState } from 'react';
import { SavedPlace } from '../../types';
import { Bookmark, Plus, MapPin, Trash2, Home, Briefcase, GraduationCap, Star, ArrowLeft, X } from 'lucide-react';

interface SavedRoutesPanelProps {
  savedPlaces: SavedPlace[];
  onSelectPlace: (place: SavedPlace) => void;
  onAddCustomPlace: (label: string, name: string) => void;
  onDeletePlace: (id: string) => void;
  onClose?: () => void;
}

export const SavedRoutesPanel: React.FC<SavedRoutesPanelProps> = ({
  savedPlaces,
  onSelectPlace,
  onAddCustomPlace,
  onDeletePlace,
  onClose,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState('Favorites');
  const [customName, setCustomName] = useState('');

  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'home':
        return <Home className="w-4 h-4 text-blue-600" />;
      case 'work':
        return <Briefcase className="w-4 h-4 text-amber-600" />;
      case 'college':
        return <GraduationCap className="w-4 h-4 text-purple-600" />;
      default:
        return <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onAddCustomPlace(label, customName.trim());
    setCustomName('');
    setShowAddForm(false);
  };

  return (
    <div className="w-[392px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-gray-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left duration-200 z-30 font-sans text-gray-800">
      {/* Header */}
      <div className="p-3.5 border-b border-gray-200 flex items-center justify-between bg-amber-50/40">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200/60"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="text-sm font-bold text-gray-900">Saved Places & Favorites</div>
            <div className="text-[11px] text-gray-500 font-normal">
              Quick origin/destination bookmarks
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowAddForm((p) => !p)}
            className="px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {/* Add Custom Place Form */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2.5 text-xs shadow-2xs"
          >
            <div className="font-bold text-gray-900">Add New Place</div>
            <div className="grid grid-cols-4 gap-1">
              {['Home', 'Work', 'College', 'Favorites'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setLabel(cat)}
                  className={`py-1 px-1.5 rounded-lg text-[11px] font-medium border text-center transition-colors ${
                    label === cat
                      ? 'border-blue-600 bg-white text-blue-700 font-bold shadow-2xs'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Koramangala Hub or Indiranagar"
              className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-2.5 py-1 text-gray-500 hover:text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Places List */}
        <div className="space-y-2">
          {savedPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs flex items-center justify-between cursor-pointer transition-colors group shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-full bg-gray-100 group-hover:bg-blue-50 transition-colors shrink-0">
                  {getIcon(place.label)}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {place.customTitle || place.label}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate">
                    {place.location.name}
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePlace(place.id);
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
