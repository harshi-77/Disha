import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from '../../config/env';
import { AppUser } from '../../types';
import { isLiveMode } from './apiClient';
let client: SupabaseClient | null = null;
const localUser = (email = 'guest@disha.internal', name = 'Guest Navigator'): AppUser => ({ id: `local-${email}`, name, email, vehicleType: 'EV', preferences: { prioritizeGreen: true, avoidHighSpillback: true, voicePrompts: false } });
const supabase = () => { if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'); return client ||= createClient(ENV.supabaseUrl, ENV.supabaseAnonKey); };
const toUser = (u: { id: string; email?: string; user_metadata?: Record<string, unknown> }): AppUser => ({ id:u.id, email:u.email || '', name:String(u.user_metadata?.full_name || u.email?.split('@')[0] || 'DISHA user'), vehicleType:'EV', preferences:{ prioritizeGreen:true, avoidHighSpillback:true, voicePrompts:false } });
export const authService = {
  getCurrentUser(): AppUser | null { try { const raw=localStorage.getItem('disha_user'); return raw ? JSON.parse(raw) : null; } catch { return null; } },
  async restoreSession(): Promise<AppUser | null> { if (!isLiveMode()) return this.getCurrentUser(); const {data,error}=await supabase().auth.getUser(); if(error || !data.user) return null; const user=toUser(data.user); localStorage.setItem('disha_user',JSON.stringify(user)); return user; },
  async login(email:string,password?:string):Promise<AppUser> { if(!isLiveMode()){const user=localUser(email,email.split('@')[0]||'Guest user');localStorage.setItem('disha_user',JSON.stringify(user));return user;} if(!password)throw new Error('Password is required.'); const {data,error}=await supabase().auth.signInWithPassword({email,password});if(error||!data.user)throw new Error(error?.message||'Sign-in failed.');const user=toUser(data.user);localStorage.setItem('disha_user',JSON.stringify(user));return user; },
  async register(name:string,email:string,password=''):Promise<AppUser>{if(!isLiveMode()){const user=localUser(email,name);localStorage.setItem('disha_user',JSON.stringify(user));return user;}if(!password)throw new Error('Password is required.');const {data,error}=await supabase().auth.signUp({email,password,options:{data:{full_name:name}}});if(error||!data.user)throw new Error(error?.message||'Registration failed.');const user=toUser(data.user);localStorage.setItem('disha_user',JSON.stringify(user));return user;},
  async loginWithGoogle():Promise<AppUser>{if(!isLiveMode()){const user=localUser('guest.google@disha.internal','Google user');localStorage.setItem('disha_user',JSON.stringify(user));return user;}const {error}=await supabase().auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin}});if(error)throw new Error(error.message);throw new Error('Redirecting to Google…');},
  async resetPassword(email:string):Promise<void>{const {error}=await supabase().auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});if(error)throw new Error(error.message);},
  async logout():Promise<void>{if(isLiveMode()){const {error}=await supabase().auth.signOut();if(error)throw new Error(error.message);}localStorage.removeItem('disha_user');},
  updatePreferences(preferences:Partial<AppUser['preferences']>):AppUser{const user=this.getCurrentUser()||localUser();const updated={...user,preferences:{...user.preferences,...preferences}};localStorage.setItem('disha_user',JSON.stringify(updated));return updated;},
};
