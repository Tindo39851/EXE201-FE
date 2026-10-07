'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiErrorMessage } from '@/services/api-client';
import { X, Shield, Lock, Mail, User, Sparkles, ArrowRight, ArrowLeft, KeyRound, RotateCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes = 300 seconds
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const { login, sendRegistrationOtp, verifyRegistrationOtp } = useAuth();

  // Reset state when switching modes or closing
  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setStep('form');
    setErrorMsg(null);
    setSuccessNotice(null);
    setOtp('');
  };

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Submit handler for Login and Step 1 of Register
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);

    if (mode === 'login') {
      setSubmitting(true);
      try {
        const loggedUser = await login(email, password);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          if (loggedUser?.role === 'ADMIN') {
            router.push('/admin');
          }
        }, 800);
      } catch (err: unknown) {
        setErrorMsg(getApiErrorMessage(err, 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'));
      } finally {
        setSubmitting(false);
      }
    } else {
      // Register Step 1: Validate & Send OTP
      if (password !== confirmPassword) {
        setErrorMsg('Mật khẩu và xác nhận mật khẩu không khớp nhau!');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự.');
        return;
      }

      setSubmitting(true);
      try {
        await sendRegistrationOtp(username.trim(), email.trim());
        setStep('otp');
        setCountdown(300); // 5 minutes
        setSuccessNotice(`Mã OTP 6 số đã được gửi đến ${email}.`);
      } catch (err: unknown) {
        setErrorMsg(getApiErrorMessage(err, 'Không thể gửi mã xác thực OTP. Vui lòng thử lại.'));
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Submit handler for Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã xác thực OTP.');
      return;
    }

    setSubmitting(true);
    try {
      await verifyRegistrationOtp(username.trim(), email.trim(), password, cleanOtp);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, 'Mã OTP không chính xác hoặc đã hết hạn.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resending || countdown > 240) return; // Cooldown 60s
    setErrorMsg(null);
    setResending(true);
    try {
      await sendRegistrationOtp(username.trim(), email.trim());
      setCountdown(300);
      setSuccessNotice('Mã OTP mới đã được gửi lại thành công!');
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Cyberpunk Modal Box */}
      <div className="relative z-10 w-full max-w-md bg-[#0A0E17] border-2 border-gt-cyan p-6 sm:p-8 rounded-sm cyber-cut shadow-[0_0_50px_rgba(0,240,255,0.4)]">
        
        {/* Corner Decors */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gt-magenta"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gt-magenta"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gt-text-dim hover:text-gt-cyan p-1 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-gradient-to-br from-gt-cyan/20 to-gt-magenta/20 border border-gt-cyan cyber-cut-sm mb-3 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Shield size={24} className="text-gt-cyan animate-pulse" />
          </div>
          <h2 className="font-orbitron text-2xl font-black text-white uppercase tracking-wider text-glow-cyan">
            {mode === 'login'
              ? 'ACCESS TERMINAL'
              : step === 'otp'
              ? 'SECURITY CHECK'
              : 'INITIALIZE PROFILE'}
          </h2>
          <p className="font-mono text-xs text-gt-text-dim mt-1">
            {mode === 'login'
              ? '// ENTER YOUR SQUAD CREDENTIALS'
              : step === 'otp'
              ? '// VERIFY 6-DIGIT SECURITY OTP CODE'
              : '// JOIN 62,000+ COMPETITIVE PLAYERS'}
          </p>
        </div>

        {/* Tab switch (only in form step) */}
        {step === 'form' && (
          <div className="flex border border-gt-border mb-6 rounded-sm overflow-hidden p-1 bg-[#080B12]">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 py-2 font-mono text-xs uppercase tracking-wider transition-all cyber-cut-sm cursor-pointer ${
                mode === 'login'
                  ? 'bg-gt-cyan text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'text-gt-text-dim hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`flex-1 py-2 font-mono text-xs uppercase tracking-wider transition-all cyber-cut-sm cursor-pointer ${
                mode === 'register'
                  ? 'bg-gt-magenta text-white font-bold shadow-[0_0_10px_rgba(255,0,127,0.4)]'
                  : 'text-gt-text-dim hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {isSuccess ? (
          <div className="py-10 text-center space-y-3 font-mono">
            <div className="w-12 h-12 mx-auto rounded-full bg-gt-green/20 border border-gt-green text-gt-green flex items-center justify-center animate-bounce text-xl">
              ✓
            </div>
            <h3 className="font-orbitron text-lg font-bold text-white uppercase text-gt-green">
              {mode === 'login' ? 'AUTHENTICATED' : 'ACCOUNT CREATED'}
            </h3>
            <p className="text-xs text-gt-text-dim">Synchronizing player profile...</p>
          </div>
        ) : step === 'otp' ? (
          /* STEP 2: OTP VERIFICATION */
          <form onSubmit={handleVerifyOtp} className="space-y-4 font-mono text-xs">
            {errorMsg && (
              <div className="p-2.5 bg-gt-red/10 border border-gt-red/40 text-gt-red rounded-sm text-[11px] animate-fadeIn">
                {errorMsg}
              </div>
            )}
            {successNotice && (
              <div className="p-2.5 bg-gt-cyan/10 border border-gt-cyan/40 text-gt-cyan rounded-sm text-[11px] animate-fadeIn">
                {successNotice}
              </div>
            )}

            <div className="bg-[#080B12] border border-gt-border/80 p-3 rounded-sm space-y-1">
              <div className="flex items-center gap-2 text-gt-text-dim">
                <Mail size={14} className="text-gt-cyan" />
                <span>Verification code sent to:</span>
              </div>
              <div className="font-bold text-white tracking-wider break-all text-sm">
                {email}
              </div>
            </div>

            <div>
              <label className="block text-gt-text-dim uppercase tracking-wider mb-2 flex justify-between items-center">
                <span>Enter 6-Digit OTP</span>
                <span className={`font-orbitron text-xs ${countdown < 60 ? 'text-gt-red animate-pulse' : 'text-gt-cyan'}`}>
                  {formatTimer(countdown)}
                </span>
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gt-cyan" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-[#080B12] border-2 border-gt-cyan/60 hover:border-gt-cyan focus:border-gt-cyan focus:outline-none pl-10 pr-3 py-3 text-center text-xl font-orbitron tracking-[0.5em] text-white rounded-sm transition-colors shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                />
              </div>
              <p className="text-[10px] text-gt-text-dim mt-1.5 text-center">
                Check inbox or spam folder. In local dev, code is also outputted to server console.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setErrorMsg(null);
                  setSuccessNotice(null);
                }}
                className="inline-flex items-center gap-1.5 text-gt-text-dim hover:text-white transition-colors cursor-pointer text-xs"
              >
                <ArrowLeft size={14} />
                <span>Edit details</span>
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending || countdown > 240}
                className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer text-xs ${
                  resending || countdown > 240
                    ? 'text-gt-text-dim/50 cursor-not-allowed'
                    : 'text-gt-cyan hover:underline'
                }`}
              >
                <RotateCw size={13} className={resending ? 'animate-spin' : ''} />
                <span>{countdown > 240 ? `Resend (${countdown - 240}s)` : 'Resend OTP'}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting || otp.length !== 6 || countdown === 0}
              className="w-full py-3.5 mt-2 font-orbitron text-xs font-black uppercase tracking-widest transition-all duration-300 cyber-cut shimmer-effect flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-gt-magenta to-pink-600 text-white glow-magenta"
            >
              <Sparkles size={14} />
              <span>{submitting ? 'VERIFYING...' : 'VERIFY & FINISH SIGN UP'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          /* STEP 1: FORM (LOGIN OR REGISTER STEP 1) */
          <form onSubmit={handleSubmitForm} className="space-y-4 font-mono text-xs">
            {errorMsg && (
              <div className="p-2.5 bg-gt-red/10 border border-gt-red/40 text-gt-red rounded-sm text-[11px] animate-fadeIn">
                {errorMsg}
              </div>
            )}
            {mode === 'register' && (
              <div>
                <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                  Gamer Tag / Username
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gt-text-dim" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. PHANTOM_REAPER"
                    className="w-full bg-[#080B12] border border-gt-border hover:border-gt-cyan focus:border-gt-cyan focus:outline-none pl-9 pr-3 py-2.5 text-white rounded-sm transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                {mode === 'login' ? 'Email or Username' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gt-text-dim" />
                <input
                  type={mode === 'login' ? 'text' : 'email'}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === 'login' ? 'admin or player@gametrust.gg' : 'player@gametrust.gg'}
                  className="w-full bg-[#080B12] border border-gt-border hover:border-gt-cyan focus:border-gt-cyan focus:outline-none pl-9 pr-3 py-2.5 text-white rounded-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gt-text-dim" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#080B12] border border-gt-border hover:border-gt-cyan focus:border-gt-cyan focus:outline-none pl-9 pr-3 py-2.5 text-white rounded-sm transition-colors"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gt-text-dim" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full bg-[#080B12] border border-gt-border hover:border-gt-cyan focus:border-gt-cyan focus:outline-none pl-9 pr-3 py-2.5 text-white rounded-sm transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 mt-2 font-orbitron text-xs font-black uppercase tracking-widest transition-all duration-300 cyber-cut shimmer-effect flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 ${
                mode === 'login'
                  ? 'bg-gt-cyan text-black hover:bg-white glow-cyan'
                  : 'bg-gradient-to-r from-gt-magenta to-pink-600 text-white glow-magenta'
              }`}
            >
              <Sparkles size={14} />
              <span>
                {mode === 'login'
                  ? (submitting ? 'AUTHORIZING...' : 'AUTHORIZE ACCESS')
                  : (submitting ? 'SENDING OTP...' : 'CONTINUE TO VERIFY')}
              </span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

