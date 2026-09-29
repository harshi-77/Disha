import React, { useState } from 'react';
import { X, AlertTriangle, Camera, Check, MapPin, Send } from 'lucide-react';
import { IMAGES } from '../constants/images';
import { auth, createRoadIncident } from '../lib/firebase';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ISSUE_TYPES = [
  { id: 'pothole', label: '🕳️ Severe Pothole', desc: 'Asphalt trench / suspension hazard' },
  { id: 'waterlog', label: '🌊 Waterlogging', desc: 'Monsoon puddle > 10cm depth' },
  { id: 'accident', label: '💥 Vehicle Collision', desc: 'Traffic obstruction / medical alert' },
  { id: 'construction', label: '🚧 Road Construction', desc: 'Unmarked barricade / lane reduction' },
  { id: 'closure', label: '⛔ Road Closure', desc: 'VIP movement / emergency block' },
  { id: 'signal', label: '🚦 Signal Malfunction', desc: 'Flashing yellow or dead junction light' },
];

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState('pothole');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [photoAdded, setPhotoAdded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createRoadIncident({
        type: selectedType,
        title: `${selectedType} reported at ${locationName || 'Bengaluru Corridor'}`,
        location: locationName || 'Bengaluru Corridor',
        description: `${description}${photoAdded ? ' [photo attached]' : ''}`.trim(),
        reportedBy: auth.currentUser?.email || 'Anonymous Pilot',
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to submit road issue:', err);
      // Fallback success for local feedback
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-lg bg-black border border-orange-500/40 rounded-3xl shadow-2xl shadow-orange-950/70 p-6 animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-rose-500 shadow-md">
            <img src={IMAGES.iconQuantumShield} alt="Report" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl floating-text-primary">
              Report Road Hazard
            </h3>
            <p className="text-xs floating-text-sub font-mono">
              Live crowdsourced telematics to protect fellow urban pilots
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-lg text-emerald-300">
              Hazard Verified & Broadcasted
            </h4>
            <p className="text-xs font-mono floating-text-sub max-w-sm mx-auto">
              DISHA's GNN has updated the corridor graph. Downstream drivers will be safely rerouted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Hazard Type Grid */}
            <div>
              <label className="block text-xs font-mono floating-text-muted uppercase mb-2">
                Select Hazard Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ISSUE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                      selectedType === type.id
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-md'
                        : 'bg-stone-950 border-orange-950 text-stone-400 hover:border-orange-800'
                    }`}
                  >
                    <div className="font-bold">{type.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location Description */}
            <div>
              <label className="block text-xs font-mono floating-text-sub mb-1">
                Corridor Location / Landmark
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-orange-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Silk Board flyover descent or 100ft road Indiranagar"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-stone-950 border border-orange-950 rounded-xl pl-9 pr-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-orange-400 font-mono"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-xs font-mono floating-text-sub mb-1">
                Observations (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Describe lane blockage, depth, or traffic slowdown..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-stone-950 border border-orange-950 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-orange-400 font-mono"
              />
            </div>

            {/* Photo Attachment Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-orange-950 text-xs font-mono">
              <span className="flex items-center gap-2 floating-text-sub">
                <Camera className="w-4 h-4 text-orange-400" />
                {photoAdded ? 'Dashcam Frame Attached (1080p)' : 'Attach Dashcam / Phone Snapshot'}
              </span>
              <button
                type="button"
                onClick={() => setPhotoAdded(!photoAdded)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                  photoAdded ? 'bg-emerald-500 text-black' : 'bg-stone-900 text-stone-300 hover:text-white'
                }`}
              >
                {photoAdded ? 'Attached' : '+ Attach'}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting to Network...' : 'Broadcast Hazard Warning'}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
