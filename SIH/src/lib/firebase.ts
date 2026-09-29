import { createClient, type Session, type User } from '@supabase/supabase-js';
import { DEMO_MODE, demoUser } from './demo';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'https://qkoitysdbbwzwwokafjo.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('Supabase frontend configuration is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey || 'sb_publishable_KZ_xE9nRiywd4sMzREOaEQ_BgqNXXZ0',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);

export const firebaseProjectId = 'qkoitysdbbwzwwokafjo';

let currentUser: User | null = null;
if (!DEMO_MODE) {
  supabase.auth.getSession().then(({ data }) => { currentUser = data.session?.user ?? null; });
  supabase.auth.onAuthStateChange((_event, session) => { currentUser = session?.user ?? null; });
}

export const auth = {
  get currentUser() { return currentUser; },
};

export type AuthUser = User;

export function onAuthStateChanged(callback: (user: User | null) => void) {
  if (DEMO_MODE) {
    callback(null);
    return () => undefined;
  }
  let active = true;
  supabase.auth.getSession().then(({ data }) => { if (active) callback(data.session?.user ?? null); });
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    if (active) callback(session?.user ?? null);
  });
  return () => { active = false; listener.subscription.unsubscribe(); };
}

const asDemoUser = (email = 'pilot@disha-mobility.ai', name = 'Urban Pilot') => ({
  email,
  name,
  uid: 'demo_pilot_session',
});

export const loginWithEmail = async (email: string, pass: string) => {
  if (DEMO_MODE) return asDemoUser(email, email.split('@')[0] || 'Urban Pilot') as any;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
  if (error) throw error;
  currentUser = data.user;
  return data.user;
};

export const registerWithEmail = async (email: string, pass: string, name?: string) => {
  if (DEMO_MODE) return asDemoUser(email, name || email.split('@')[0] || 'Urban Pilot') as any;
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: { data: { display_name: name || email.split('@')[0] || 'Urban Pilot' } },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Sign-up succeeded but no user session was returned. Check email confirmation settings.');
  currentUser = data.user;
  return data.user;
};

export const loginWithGoogle = async () => {
  if (DEMO_MODE) return asDemoUser('pilot@disha-mobility.ai', 'Urban Pilot') as any;
  const settingsResponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
    headers: { apikey: supabasePublishableKey || 'sb_publishable_KZ_xE9nRiywd4sMzREOaEQ_BgqNXXZ0' },
  });
  if (settingsResponse.ok) {
    const settings = await settingsResponse.json();
    if (settings.external?.google !== true) {
      const error = new Error('Google OAuth is disabled in the connected Supabase project.');
      (error as Error & { code?: string }).code = 'supabase/google-provider-disabled';
      throw error;
    }
  }
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  if (error) throw error;
  return currentUser;
};

export const sendUserPasswordReset = async (email: string) => {
  if (DEMO_MODE) return;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
  if (error) throw error;
};

export const sendPhoneOTP = async (phoneNumber: string) => {
  if (DEMO_MODE) return;
  const settingsResponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
    headers: { apikey: supabasePublishableKey || 'sb_publishable_KZ_xE9nRiywd4sMzREOaEQ_BgqNXXZ0' },
  });
  if (settingsResponse.ok) {
    const settings = await settingsResponse.json();
    if (settings.external?.phone !== true) {
      const error = new Error('Phone OTP is disabled in the connected Supabase project.');
      (error as Error & { code?: string }).code = 'supabase/phone-provider-disabled';
      throw error;
    }
  }
  const { error } = await supabase.auth.signInWithOtp({ phone: phoneNumber, options: { channel: 'sms' } });
  if (error) throw error;
};

export const loginWithPhoneOTP = async (phoneNumber: string, otpCode: string, name?: string) => {
  if (DEMO_MODE) return { ...asDemoUser(`${phoneNumber}@phone.disha`, name || `Pilot (${phoneNumber.slice(-4)})`), phoneNumber } as any;
  const { data, error } = await supabase.auth.verifyOtp({ phone: phoneNumber, token: otpCode, type: 'sms' });
  if (error) throw error;
  if (!data.user) throw new Error('Phone verification did not return a user.');
  currentUser = data.user;
  return { ...data.user, email: data.user.email || `${phoneNumber}@phone.disha`, name: name || `Pilot (${phoneNumber.slice(-4)})`, phoneNumber } as any;
};

export const loginAsDemoUser = async (demoName = 'Harshitha R.') => {
  if (!DEMO_MODE) throw new Error('Demo authentication is disabled. Use email/password authentication.');
  return demoUser(demoName) as any;
};

export const logoutUser = async () => {
  if (DEMO_MODE) {
    currentUser = null;
    return;
  }
  const { error } = await supabase.auth.signOut();
  currentUser = null;
  if (error) throw error;
};

export const isFirebaseDomainBlocked = (error: any) => Boolean(error?.code === 'auth/unauthorized-domain' || error?.code === 'bad_jwt');

export interface FirestoreSavedRoute {
  id?: string;
  userId: string;
  origin: string;
  destination: string;
  routeId: string;
  durationMin: number;
  distanceKm: number;
  savingsMin: number;
  createdAt: string;
}

export const saveRouteToFirestore = async (routeData: Omit<FirestoreSavedRoute, 'userId' | 'createdAt'>) => {
  if (DEMO_MODE) {
    const record = { ...routeData, id: `demo_route_${Date.now()}`, userId: 'demo_pilot_session', createdAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('disha_saved_routes') || '[]');
    localStorage.setItem('disha_saved_routes', JSON.stringify([record, ...existing]));
    return record;
  }
  const user = auth.currentUser;
  if (!user) throw new Error('User must be signed in to save routes');
  const { data, error } = await supabase.from('saved_routes').insert({
    user_id: user.id,
    name: `${routeData.origin} → ${routeData.destination}`,
    origin: { label: routeData.origin },
    destination: { label: routeData.destination },
    route_geometry: {},
    distance_m: Math.round(routeData.distanceKm * 1000),
    duration_s: Math.round(routeData.durationMin * 60),
    route_type: routeData.routeId,
    metadata: { savings_min: routeData.savingsMin },
  }).select('id, origin, destination, route_type, duration_s, distance_m, metadata, created_at').single();
  if (error) throw error;
  return mapSavedRoute(data);
};

const mapSavedRoute = (row: any): FirestoreSavedRoute => ({
  id: row.id,
  userId: row.user_id,
  origin: row.origin?.label || row.origin?.address || 'Origin',
  destination: row.destination?.label || row.destination?.address || 'Destination',
  routeId: row.route_type || 'route',
  durationMin: Math.round((row.duration_s || 0) / 60),
  distanceKm: Number(((row.distance_m || 0) / 1000).toFixed(1)),
  savingsMin: Number(row.metadata?.savings_min || 0),
  createdAt: row.created_at,
});

export const fetchUserSavedRoutes = async (): Promise<FirestoreSavedRoute[]> => {
  if (DEMO_MODE) return JSON.parse(localStorage.getItem('disha_saved_routes') || '[]');
  const user = auth.currentUser;
  if (!user) return [];
  const { data, error } = await supabase.from('saved_routes').select('id, user_id, origin, destination, route_type, duration_s, distance_m, metadata, created_at').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapSavedRoute);
};

export const createRoadIncident = async (payload: { type: string; title: string; description?: string; location: string; reportedBy?: string }) => {
  if (DEMO_MODE) return { id: `demo_incident_${Date.now()}`, ...payload };
  const user = auth.currentUser;
  if (!user) throw new Error('User must be signed in to report a road incident');
  const { data, error } = await supabase.from('road_incidents').insert({
    reported_by: user.id,
    incident_type: payload.type === 'waterlog' ? 'waterlogging' : payload.type === 'closure' || payload.type === 'signal' ? 'other' : payload.type,
    title: payload.title,
    description: payload.description || null,
    location: { label: payload.location },
    metadata: { reported_by_email: payload.reportedBy || user.email },
  }).select().single();
  if (error) throw error;
  return data;
};

export type { Session };
