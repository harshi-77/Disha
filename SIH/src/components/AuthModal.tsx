import React, { useState, useEffect } from 'react';
import { X, ArrowRight, AlertCircle, CheckCircle2, Phone, Mail, KeyRound, Sparkles } from 'lucide-react';
import { IMAGES } from '../constants/images';
import { DEMO_MODE } from '../lib/demo';
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  sendUserPasswordReset,
  loginWithPhoneOTP,
  sendPhoneOTP,
  loginAsDemoUser,
  isFirebaseDomainBlocked,
  firebaseProjectId,
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; name: string; uid?: string }, openPlannerAfter?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  // Navigation tabs: 'email' | 'phone' | 'forgot'
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'forgot'>('email');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  // Email form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');

  // Phone OTP form state
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState<string>('');

  // Status & feedback
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reset states on open/close
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  // Handle Email Sign In or Register
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        const user = await registerWithEmail(email, password, name);
        onLoginSuccess({
          email: user.email || email,
          name: name || user.user_metadata?.display_name || user.user_metadata?.name || 'Urban Pilot',
          uid: user.id,
        }, true);
      } else {
        const user = await loginWithEmail(email, password);
        onLoginSuccess({
          email: user.email || email,
          name: user.user_metadata?.display_name || user.user_metadata?.name || email.split('@')[0] || 'Urban Pilot',
          uid: user.id,
        }, true);
      }
      onClose();
    } catch (err: any) {
      console.error('Email authentication error:', err);
      let message = 'Authentication failed. Please verify credentials.';
      if (isFirebaseDomainBlocked(err)) {
        message = 'Supabase Auth rejected this domain or session. Check the Supabase Auth URL configuration.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/admin-restricted-operation' || err.code === 'auth/operation-not-allowed') {
        message = `Supabase rejected this operation for project ${firebaseProjectId}. Confirm Email authentication is enabled in Supabase Auth.`;
      } else if (err.message) {
        message = err.message;
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google / Gmail Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const user = await loginWithGoogle();
      if (user) {
        onLoginSuccess({
          email: user.email || '',
          name: user.user_metadata?.display_name || user.user_metadata?.name || 'Google Pilot',
          uid: user.id,
        }, true);
        onClose();
      }
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      if (isFirebaseDomainBlocked(err)) {
        const user = await loginAsDemoUser('Harshitha R.');
        if (user) {
          onLoginSuccess({
            email: user.email || 'harshi63633@gmail.com',
            name: 'Harshitha R.',
            uid: user.id,
          }, true);
          onClose();
        }
        return;
      }
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.code === 'supabase/google-provider-disabled'
          ? 'Google sign-in is not enabled in Supabase yet. Enable the Google provider in Authentication → Providers, then try again.'
          : err.code === 'auth/admin-restricted-operation' || err.code === 'auth/operation-not-allowed'
          ? `Supabase rejected Google sign-in. Configure the Google provider and redirect URL in Supabase Auth for project ${firebaseProjectId}.`
          : err.message || 'Google Sign-In failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address to receive reset instructions.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await sendUserPasswordReset(email);
      setSuccessMsg(`Password reset link sent to ${email}. Check your inbox!`);
    } catch (err: any) {
      console.error('Password reset error:', err);
      let message = 'Unable to send reset email. Please verify the address.';
      if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (err.message) {
        message = err.message;
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to Phone
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 8) {
      setErrorMsg('Please enter a valid phone number (including country code, e.g. +91 9876543210).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await sendPhoneOTP(phoneNumber.trim());
      const generated = DEMO_MODE ? Math.floor(100000 + Math.random() * 900000).toString() : '';
      setGeneratedDemoOtp(generated);
      setOtpSent(true);
      setCountdown(30);
      setSuccessMsg(generated ? `Demo OTP: ${generated}` : `OTP verification code sent to ${phoneNumber}.`);
    } catch (err: any) {
      console.error('OTP send error:', err);
      setErrorMsg(err.code === 'supabase/phone-provider-disabled'
        ? 'Phone OTP is not enabled in Supabase yet. Enable Phone provider and an SMS provider in Authentication → Providers.'
        : err.message || 'Unable to send OTP. Check the phone number and SMS provider configuration.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Phone OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // Verify OTP code matches or matches standard 6-digit
      if (generatedDemoOtp && otpCode.trim() !== generatedDemoOtp && otpCode.trim() !== '123456') {
        setErrorMsg('Invalid verification code. Please check and re-enter.');
        setLoading(false);
        return;
      }

      const verifiedUser = await loginWithPhoneOTP(phoneNumber, otpCode);
      onLoginSuccess(verifiedUser, true);
      onClose();
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setErrorMsg(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Access
  const handleQuickDemo = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginAsDemoUser('Harshitha R.');
      if (user) {
        onLoginSuccess({
          email: user.email || 'harshi63633@gmail.com',
          name: 'Harshitha R.',
          uid: user.id,
        }, true);
        onClose();
      }
    } catch (err: any) {
      const fallbackUser = {
        email: 'harshi63633@gmail.com',
        name: 'Harshitha R.',
        uid: 'demo_pilot_session',
      };
      onLoginSuccess(fallbackUser, true);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-md bg-black border border-orange-500/40 rounded-3xl shadow-2xl shadow-orange-950/70 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-950/60 border border-orange-500/40 text-orange-300 font-mono text-[11px] mb-3">
            <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-orange-400">
              <img src={IMAGES.iconQuantumShield} alt="Auth" className="w-full h-full object-cover" />
            </div>
            <span>DISHA MOBILITY AUTHENTICATION</span>
          </div>

          <h2 className="font-display text-2xl font-bold floating-text-primary">
            {authMethod === 'forgot'
              ? 'Reset Password'
              : authMethod === 'phone'
              ? 'Phone OTP Sign-In'
              : isSignUp
              ? 'Create DISHA Account'
              : 'Sign In to DISHA'}
          </h2>
          <p className="text-xs floating-text-sub font-mono mt-1">
            {authMethod === 'forgot'
              ? 'Enter your email to receive recovery instructions.'
              : authMethod === 'phone'
              ? 'Quick mobile verification with instant OTP.'
              : 'Access the Route Planner, cloud telemetry, and vehicle profiles.'}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Method Switcher Tabs (Email/Gmail vs Phone Number with OTP) */}
        {authMethod !== 'forgot' && (
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-stone-950 border border-orange-950 mb-5">
            <button
              type="button"
              onClick={() => { setAuthMethod('email'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-2 px-3 rounded-lg font-mono text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMethod === 'email'
                  ? 'bg-orange-500 text-black font-bold shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Gmail</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('phone'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-2 px-3 rounded-lg font-mono text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMethod === 'phone'
                  ? 'bg-orange-500 text-black font-bold shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone with OTP</span>
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 1: EMAIL / GMAIL AUTHENTICATION                              */}
        {/* ================================================================= */}
        {authMethod === 'email' && (
          <div className="space-y-4">
            
            {/* Google / Gmail Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-stone-900 border border-orange-500/35 hover:border-orange-400 text-stone-200 font-mono text-xs font-semibold flex items-center justify-center gap-3 transition-all hover:bg-stone-850 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span>Continue with Google (Gmail)</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-orange-950"></div>
              <span className="flex-shrink mx-3 text-[10px] font-mono floating-text-muted uppercase">
                Or with Email & Password
              </span>
              <div className="flex-grow border-t border-orange-950"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-mono floating-text-sub mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harshitha R."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-950 border border-orange-950 rounded-xl px-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-orange-400 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-mono floating-text-sub mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-orange-950 rounded-xl px-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-orange-400 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono floating-text-sub">Password</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => { setAuthMethod('forgot'); setErrorMsg(null); setSuccessMsg(null); }}
                      className="text-[11px] font-mono text-orange-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-950 border border-orange-950 rounded-xl px-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-orange-400 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Authenticating...' : isSignUp ? 'Create Cloud Account' : 'Sign In & Start Planning'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs font-mono floating-text-muted">
              {isSignUp ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setErrorMsg(null); }}
                    className="text-orange-400 hover:underline font-bold"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Need an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(true); setErrorMsg(null); }}
                    className="text-orange-400 hover:underline font-bold"
                  >
                    Sign Up
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: PHONE NUMBER WITH OTP                                     */}
        {/* ================================================================= */}
        {authMethod === 'phone' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono floating-text-sub mb-1.5">
                    Phone Number with Country Code
                  </label>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-3.5 rounded-xl bg-stone-950 border border-orange-950 text-xs font-mono text-orange-400 font-bold">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 bg-stone-950 border border-orange-950 rounded-xl px-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-orange-400 font-mono tracking-wider"
                    />
                  </div>
                  <p className="text-[10px] font-mono floating-text-muted mt-1.5">
                    A 6-digit one-time verification password (OTP) will be sent to your number.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-stone-950 border border-orange-950 flex items-center justify-between text-xs font-mono">
                  <span className="floating-text-muted">Target: +91 {phoneNumber}</span>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="text-orange-400 hover:underline text-[11px]"
                  >
                    Change Number
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-mono floating-text-sub mb-1.5">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-[0.5em] text-lg font-bold bg-stone-950 border border-orange-500/50 rounded-xl px-4 py-3 text-orange-300 focus:outline-none focus:border-orange-400 font-mono"
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono mt-2">
                    <span className="floating-text-muted">Didn't receive code?</span>
                    {countdown > 0 ? (
                      <span className="text-stone-500">Resend in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleSendOtp(e as any)}
                        className="text-orange-400 hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Start Planning'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 3: FORGOT PASSWORD RECOVERY                                  */}
        {/* ================================================================= */}
        {authMethod === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-mono floating-text-sub mb-1">
                Account Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-orange-950 rounded-xl px-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-orange-400 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? 'Sending Recovery Link...' : 'Send Password Reset Link'}
              <KeyRound className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setErrorMsg(null); setSuccessMsg(null); }}
                className="text-xs font-mono text-orange-400 hover:underline cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* Quick Demo Pilot Footer */}
        <div className="mt-5 pt-4 border-t border-orange-950/80 flex items-center justify-between">
          <span className="text-[11px] font-mono floating-text-muted">Evaluating the system?</span>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-[11px] font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Instant Demo Pilot</span>
          </button>
        </div>

      </div>
    </div>
  );
};
