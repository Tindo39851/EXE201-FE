'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Sparkles, LogOut } from 'lucide-react';
import { AuthModal } from '@/components/ui/AuthModal';
import { InboxModal } from '@/components/ui/InboxModal';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [inboxOpen, setInboxOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Squad Finder', href: '/squad-finder' },
    { name: 'Tournament', href: '/tournament' },
    { name: 'Clan', href: '/clan' },
    { name: 'Reputation', href: '/reputation' },
    ...(user?.role === 'ADMIN' ? [{ name: '⚡ Admin Console', href: '/admin' }] : []),
  ];

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultMode={authMode}
      />

      <nav className="fixed top-0 left-0 w-full z-50 bg-gt-bg/85 backdrop-blur-xl border-b border-gt-border/80 transition-all duration-300">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gt-cyan to-gt-magenta opacity-80"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-br from-gt-cyan/30 to-gt-magenta/30 border border-gt-cyan/60 cyber-cut-sm shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.8)] group-hover:scale-105 transition-all duration-300">
              <span className="font-orbitron font-black text-xs tracking-wider text-gt-cyan group-hover:text-white transition-colors">
                GT
              </span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gt-magenta rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gt-magenta rounded-full"></div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-orbitron font-extrabold text-lg text-white tracking-widest flex items-center gap-1 group-hover:text-gt-cyan transition-colors">
                GAMETRUST
                <span className="w-1.5 h-1.5 rounded-full bg-gt-cyan animate-pulse"></span>
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] text-gt-text-dim uppercase -mt-1">
                Esports Matchmaking
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 group ${
                    isActive
                      ? 'text-gt-cyan text-glow-cyan'
                      : 'text-gt-text-dim hover:text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.name}
                  </span>
                  
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-gt-cyan to-gt-magenta shadow-[0_0_8px_#00F0FF]"></span>
                  )}
                  
                  <span className="absolute inset-0 bg-gt-cyan/0 group-hover:bg-gt-cyan/5 rounded-sm transition-all duration-300"></span>
                </Link>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-gt-bg-card border border-gt-border rounded-sm font-mono text-[11px] text-gt-cyan">
              <span className="w-2 h-2 rounded-full bg-gt-green animate-pulse"></span>
              <span className="tracking-wider">62.1K LIVE</span>
            </div>

            <button 
              aria-label="Notifications & Invites"
              title="Squad Invites & Alerts"
              onClick={() => setInboxOpen(true)}
              className="relative p-2 text-gt-text-dim hover:text-gt-cyan hover:bg-gt-cyan/10 border border-transparent hover:border-gt-cyan/30 rounded-sm transition-all duration-300 cursor-pointer"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gt-cyan rounded-full shadow-[0_0_8px_#00F0FF] animate-pulse"></span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  title="View Operative Profile"
                  className="flex items-center gap-2 px-3 py-1 bg-gt-bg-card border border-gt-cyan/50 hover:border-gt-cyan rounded-sm cyber-cut-sm shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-sm bg-gt-cyan/20 border border-gt-cyan flex items-center justify-center font-orbitron font-bold text-xs text-gt-cyan">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
                      {user.username}
                    </span>
                    <span className="font-mono text-[9px] text-gt-text-dim leading-none">
                      {user.role} • REP {user.reputationScore ?? 99}
                    </span>
                  </div>
                </Link>

                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    title="Open Supreme Admin Console"
                    className="flex items-center gap-1.5 px-3 py-1 bg-gt-yellow/20 hover:bg-gt-yellow text-gt-yellow hover:text-black border border-gt-yellow font-orbitron text-[11px] font-bold uppercase rounded-sm cyber-cut-sm shadow-[0_0_10px_rgba(255,215,0,0.3)] hover:shadow-[0_0_15px_rgba(255,215,0,0.6)] transition-all cursor-pointer"
                  >
                    <span>⚡</span>
                    <span>ADMIN PANEL</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 border border-gt-border hover:border-gt-red hover:bg-gt-red/10 text-gt-text-dim hover:text-gt-red rounded-sm transition-all duration-200 cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 border border-gt-border-bright text-gt-text hover:text-gt-cyan hover:border-gt-cyan font-orbitron text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_12px_rgba(0,240,255,0.25)] cyber-cut-sm cursor-pointer"
                >
                  Sign In
                </button>

                <button
                  onClick={() => handleOpenAuth('register')}
                  className="relative px-4 sm:px-5 py-2 bg-gradient-to-r from-gt-magenta to-pink-600 hover:from-gt-magenta hover:to-gt-purple text-white font-orbitron text-xs font-bold uppercase tracking-wider transition-all duration-300 glow-magenta cyber-cut shimmer-effect flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Sparkles size={13} className="text-white animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Create Account</span>
                </button>
              </>
            )}
          </div>

        </div>
      </nav>

      <InboxModal
        isOpen={inboxOpen}
        onClose={() => setInboxOpen(false)}
      />
    </>
  );
}
