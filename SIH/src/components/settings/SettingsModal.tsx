import React, { useEffect, useState } from 'react';
import { X, Check, Settings2, Map } from 'lucide-react';
import { AppSettings } from '../../types';

interface SettingsModalProps { isOpen: boolean; onClose: () => void; settings: AppSettings; onSaveSettings: (settings: AppSettings) => void; }
export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSaveSettings }) => {
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);
  useEffect(() => setFormData(settings), [settings, isOpen]);
  if (!isOpen) return null;
  const chooseMap = (mapProvider: AppSettings['mapProvider']) => setFormData({ ...formData, mapProvider });
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
    <form onSubmit={(event) => { event.preventDefault(); onSaveSettings(formData); setSaved(true); setTimeout(onClose, 450); }} className="bg-white border border-gray-200 rounded-2xl max-w-md w-full shadow-2xl text-gray-800">
      <header className="p-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/70">
        <div className="flex gap-2.5 items-center"><div className="w-8 h-8 rounded-full bg-blue-600 text-white grid place-items-center"><Settings2 className="w-4 h-4" /></div><div><h2 className="text-base font-bold">Map preferences</h2><p className="text-xs text-gray-500">Choose how DISHA looks on this device.</p></div></div>
        <button type="button" onClick={onClose} aria-label="Close settings" className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
      </header>
      <div className="p-5 space-y-5 text-xs">
        <section><h3 className="font-bold uppercase tracking-wider text-[11px] text-gray-700 mb-2">Map style</h3><div className="grid grid-cols-3 gap-2">
          {([['osm','Standard'],['carto','City'],['mapbox','Terrain']] as const).map(([value,label]) => <button key={value} type="button" onClick={() => chooseMap(value)} className={`rounded-xl p-3 border text-left ${formData.mapProvider === value ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-gray-200 hover:border-gray-300'}`}><Map className="w-4 h-4 mb-2"/><b>{label}</b><span className="block text-[10px] text-gray-500 mt-1">Ready to use</span></button>)}
        </div></section>
        <section className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-blue-900"><b>Account and live services</b><p className="mt-1 text-[11px] leading-relaxed">Your secure account and service connections are set up when the app starts. Sensitive connection details are never shown here.</p></section>
      </div>
      <footer className="p-4 border-t border-gray-100 flex justify-end gap-2"><button type="button" onClick={onClose} className="px-3 py-2 text-gray-600">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">{saved ? <Check className="w-4 h-4" /> : 'Save preferences'}</button></footer>
    </form>
  </div>;
};
