import React, { useState } from 'react';
import { X, User, Mail, Lock, Shield, Check, LogOut, Phone } from 'lucide-react';
import { AppUser } from '../../types';
import { authService } from '../../services/api/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser | null;
  onUserChange: (user: AppUser | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserChange,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      const logged = await authService.login(email, password);
      onUserChange(logged);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setIsLoading(true);
    try {
      const registered = await authService.register(name, email);
      onUserChange(registered);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone && !email) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setIsLoading(true);
    try {
      const logged = await authService.login(phone ? `${phone}@mobile.disha` : email);
      onUserChange(logged);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    onUserChange(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden flex flex-col text-gray-800">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-bold text-gray-900">
                {user ? 'Mobility Account' : 'DISHA Sign In'}
              </div>
              <div className="text-xs text-gray-500 font-normal">
                {user ? user.email : 'Personal mobility profile'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user is already logged in */}
        {user ? (
          <div className="p-5 space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Operator</span>
                <span className="font-bold text-gray-900">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-mono text-gray-700">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Vehicle Type</span>
                <span className="text-blue-700 font-bold">{user.vehicleType}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-gray-600 uppercase tracking-wider text-[10px]">
                Routing Preferences
              </div>
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-800 font-medium">Prioritize Green Wave Bypass</span>
                <input
                  type="checkbox"
                  checked={user.preferences.prioritizeGreen}
                  onChange={(e) => {
                    const updated = authService.updatePreferences({
                      prioritizeGreen: e.target.checked,
                    });
                    onUserChange(updated);
                  }}
                  className="accent-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-gray-800 font-medium">Avoid Severe Spillback Corridors</span>
                <input
                  type="checkbox"
                  checked={user.preferences.avoidHighSpillback}
                  onChange={(e) => {
                    const updated = authService.updatePreferences({
                      avoidHighSpillback: e.target.checked,
                    });
                    onUserChange(updated);
                  }}
                  className="accent-blue-600 rounded"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-gray-100">
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4 text-xs">
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-xl text-[11px]">
              <button
                onClick={() => setTab('login')}
                className={`py-1.5 rounded-lg font-semibold transition-colors ${
                  tab === 'login' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab('register')}
                className={`py-1.5 rounded-lg font-semibold transition-colors ${
                  tab === 'register' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setTab('otp')}
                className={`py-1.5 rounded-lg font-semibold transition-colors ${
                  tab === 'otp' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                OTP Code
              </button>
            </div>

            {/* Email/Password Login */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@disha-mobility.org"
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-xs"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Register */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@transport.org"
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-xs"
                >
                  {isLoading ? 'Creating Account...' : 'Register'}
                </button>
              </form>
            )}

            {/* OTP */}
            {tab === 'otp' && (
              <div className="space-y-3">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">Phone Number or Email</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-xs"
                    >
                      Send Verification Code
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-gray-700 font-medium">Enter 6-Digit Code</label>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        required
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900 font-mono text-center tracking-widest focus:bg-white focus:outline-none focus:border-blue-500 text-base"
                      />
                      <span className="text-[10px] text-gray-400 block text-center">
                        Enter the verification code sent to your device.
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors shadow-xs"
                    >
                      {isLoading ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
