import { apiRequest, isLiveMode } from './apiClient';
import { SavedPlace } from '../../types';

const STORAGE_KEY = 'disha_saved_places';
const readDemo = (): SavedPlace[] => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } };
export const savedRoutesService = {
  async list(): Promise<SavedPlace[]> { return isLiveMode() ? apiRequest<SavedPlace[]>('/api/saved-routes') : readDemo(); },
  async save(place: SavedPlace): Promise<SavedPlace> {
    if (isLiveMode()) return apiRequest<SavedPlace>('/api/saved-routes', { method: 'POST', body: JSON.stringify(place) });
    localStorage.setItem(STORAGE_KEY, JSON.stringify([place, ...readDemo()])); return place;
  },
  async remove(id: string): Promise<void> {
    if (isLiveMode()) { await apiRequest<void>(`/api/saved-routes/${encodeURIComponent(id)}`, { method: 'DELETE' }); return; }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readDemo().filter((item) => item.id !== id)));
  },
};
