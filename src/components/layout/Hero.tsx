'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Zap, Flame, Radio, Volume2, Shield, Crosshair } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[92vh] flex items-center justify-center bg-gt-bg bg-grid overflow-hidden pt-24 pb-16">
      
      {/* Ambient Neon Atmosphere Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-gt-cyan/15 via-gt-purple/10 to-gt-magenta/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gt-cyan/5 rounded-full blur-[90px] pointer-events-none"></div>
      <div className="absolute top-20 right-10 w-96 h-96 bg-gt-magenta/5 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Cyber Laser Scanline Beam */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gt-cyan to-transparent animate-scanline shadow-[0_0_15px_#00F0FF]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        
        {/* Top Tech Pill with Sonar Ping */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gt-bg-card/90 border border-gt-cyan/40 shadow-[0_0_20px_rgba(0,240,255,0.25)] mb-8 animate-float">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gt-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gt-green"></span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-gt-cyan font-bold flex items-center gap-1.5">
            <Flame size={13} className="text-gt-orange animate-bounce" />
            AI MATCHMAKING ENGINE ONLINE // V3.2
          </span>
          <span className="text-gt-border-bright">•</span>
          {/* Audio voice comms wave */}
          <div className="flex items-center gap-1">
            <span className="w-0.5 bg-gt-cyan animate-eq-1 rounded-full"></span>
            <span className="w-0.5 bg-gt-cyan animate-eq-2 rounded-full"></span>
            <span className="w-0.5 bg-gt-cyan animate-eq-3 rounded-full"></span>
          </div>
        </div>

        {/* Cyber Framed Heading with Glowing HUD Accents */}
        <div className="relative p-6 sm:p-10 mb-2 group">
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gt-cyan shadow-[-4px_-4px_10px_rgba(0,240,255,0.4)] transition-all duration-300 group-hover:scale-110"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gt-cyan shadow-[4px_-4px_10px_rgba(0,240,255,0.4)] transition-all duration-300 group-hover:scale-110"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gt-cyan shadow-[-4px_4px_10px_rgba(0,240,255,0.4)] transition-all duration-300 group-hover:scale-110"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gt-cyan shadow-[4px_4px_10px_rgba(0,240,255,0.4)] transition-all duration-300 group-hover:scale-110"></div>

          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 bg-gt-bg font-mono text-[10px] text-gt-cyan/80 tracking-[0.3em] uppercase flex items-center gap-1">
            <Crosshair size={11} className="text-gt-cyan" />
            <span>SYS_ONLINE // REGION_GLOBAL</span>
          </div>

          <h1 className="font-orbitron text-5xl sm:text-7xl lg:text-8xl text-white font-black uppercase tracking-tight leading-none text-glow-cyan">
            FIND YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gt-cyan via-white to-gt-magenta drop-shadow-[0_0_35px_rgba(0,240,255,0.7)]">
              SQUAD
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="font-mono text-gt-cyan text-xs sm:text-sm lg:text-base uppercase tracking-[0.25em] font-semibold mt-4 mb-10 max-w-2xl text-shadow">
          THE PREMIER COMPETITIVE PLAYER MATCHING PLATFORM
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
          <Link
            href="/squad-finder"
            className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-gt-cyan text-gt-bg font-orbitron font-extrabold uppercase tracking-widest text-sm transition-all duration-300 hover:bg-white hover:text-black glow-cyan cyber-cut shimmer-effect flex items-center justify-center gap-2 group active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.8)]"
          >
            <span>Find Your Squad</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/tournament"
            className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-gt-bg-card/80 border-2 border-gt-cyan/80 text-gt-cyan font-orbitron font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:bg-gt-cyan/15 hover:border-gt-cyan cyber-cut flex items-center justify-center gap-2 group active:scale-95 shadow-[0_0_15px_rgba(0,240,255,0.15)] cursor-pointer"
          >
            <Zap size={16} className="text-gt-yellow group-hover:scale-125 transition-transform" />
            <span>Join Tournament</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 sm:gap-16 mt-16 pt-8 border-t border-gt-border/80 w-full max-w-3xl">
          <div className="flex flex-col items-center group cursor-default">
            <span className="font-orbitron text-3xl sm:text-4xl lg:text-5xl text-gt-yellow font-black tracking-tight text-glow-yellow group-hover:scale-110 transition-transform">
              62K+
            </span>
            <span className="font-mono text-[11px] sm:text-xs text-gt-text-dim tracking-[0.2em] uppercase mt-1">
              PLAYERS
            </span>
          </div>

          <div className="flex flex-col items-center group cursor-default border-x border-gt-border/60 px-2 sm:px-6">
            <span className="font-orbitron text-3xl sm:text-4xl lg:text-5xl text-gt-cyan font-black tracking-tight text-glow-cyan group-hover:scale-110 transition-transform">
              1,203
            </span>
            <span className="font-mono text-[11px] sm:text-xs text-gt-text-dim tracking-[0.2em] uppercase mt-1">
              ACTIVE NOW
            </span>
          </div>

          <div className="flex flex-col items-center group cursor-default">
            <span className="font-orbitron text-3xl sm:text-4xl lg:text-5xl text-gt-green font-black tracking-tight text-glow-green group-hover:scale-110 transition-transform">
              9.1
            </span>
            <span className="font-mono text-[11px] sm:text-xs text-gt-text-dim tracking-[0.2em] uppercase mt-1">
              AVG REP
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
