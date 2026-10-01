'use client';

import React, { useState } from 'react';
import { X, Shield, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';

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
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [gameRole, setGameRole] = useState('IGL / Duelist');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
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
            {mode === 'login' ? 'ACCESS TERMINAL' : 'INITIALIZE PROFILE'}
          </h2>
          <p className="font-mono text-xs text-gt-text-dim mt-1">
            {mode === 'login' ? '// ENTER YOUR SQUAD CREDENTIALS' : '// JOIN 62,000+ COMPETITIVE PLAYERS'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border border-gt-border mb-6 rounded-sm overflow-hidden p-1 bg-[#080B12]">
          <button
            type="button"
            onClick={() => setMode('login')}
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
            onClick={() => setMode('register')}
            className={`flex-1 py-2 font-mono text-xs uppercase tracking-wider transition-all cyber-cut-sm cursor-pointer ${
              mode === 'register'
                ? 'bg-gt-magenta text-white font-bold shadow-[0_0_10px_rgba(255,0,127,0.4)]'
                : 'text-gt-text-dim hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3 font-mono">
            <div className="w-12 h-12 mx-auto rounded-full bg-gt-green/20 border border-gt-green text-gt-green flex items-center justify-center animate-bounce">
              ✓
            </div>
            <h3 className="font-orbitron text-lg font-bold text-white uppercase text-gt-green">
              AUTHENTICATED
            </h3>
            <p className="text-xs text-gt-text-dim">Synchronizing player profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
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
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gt-text-dim" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@gametrust.gg"
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

            <button
              type="submit"
              className={`w-full py-3.5 mt-2 font-orbitron text-xs font-black uppercase tracking-widest transition-all duration-300 cyber-cut shimmer-effect flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                mode === 'login'
                  ? 'bg-gt-cyan text-black hover:bg-white glow-cyan'
                  : 'bg-gradient-to-r from-gt-magenta to-pink-600 text-white glow-magenta'
              }`}
            >
              <Sparkles size={14} />
              <span>{mode === 'login' ? 'AUTHORIZE ACCESS' : 'CONFIRM & JOIN'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
