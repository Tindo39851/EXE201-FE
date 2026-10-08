'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { tournamentService } from '@/features/tournaments/services/tournament.service';
import { walletService } from '@/features/wallet/services/wallet.service';
import type { TournamentRegistration } from '@/features/tournaments/types/tournament.types';
import {
  ArrowLeft,
  Shield,
  Trophy,
  Mail,
  Award,
  Sparkles,
  CheckCircle,
  Clock,
} from 'lucide-react';

const AVATAR_PRESETS = [
  'bg-gt-cyan/20 border-gt-cyan text-gt-cyan',
  'bg-gt-magenta/20 border-gt-magenta text-gt-magenta',
  'bg-gt-yellow/20 border-gt-yellow text-gt-yellow',
  'bg-gt-green/20 border-gt-green text-gt-green',
  'bg-gt-purple/20 border-gt-purple text-gt-purple',
];

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const [tournaments, setTournaments] = useState<TournamentRegistration[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    walletService.getBalance().then((bal) => setWalletBalance(bal));
    const handleBalanceUpdate = (e: any) => {
      if (typeof e.detail === 'number') setWalletBalance(e.detail);
      else walletService.getBalance().then((bal) => setWalletBalance(bal));
    };
    window.addEventListener('wallet:balance-updated', handleBalanceUpdate);
    return () => window.removeEventListener('wallet:balance-updated', handleBalanceUpdate);
  }, []);

  useEffect(() => {
    const fetchMyTournaments = async () => {
      setLoadingTournaments(true);
      try {
        const data = await tournamentService.getMyTournaments();
        setTournaments(data);
      } finally {
        setLoadingTournaments(false);
      }
    };

    if (user) {
      fetchMyTournaments();
    }
  }, [user]);

  const handleSaveAvatar = async (preset: string) => {
    setSelectedPreset(preset);
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateProfile(preset);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gt-bg text-gt-text flex flex-col font-rajdhani">
        <Navbar />
        <div className="flex-1 flex items-center justify-center font-mono text-sm text-gt-cyan">
          INITIALIZING NEURAL PROFILE...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gt-bg text-gt-text flex flex-col font-rajdhani">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-sm bg-gt-red/20 border border-gt-red flex items-center justify-center text-gt-red mb-4 cyber-cut">
            <Shield size={32} />
          </div>
          <h1 className="font-orbitron text-2xl font-black text-white uppercase mb-2">
            UNAUTHENTICATED OPERATIVE
          </h1>
          <p className="font-mono text-xs text-gt-text-dim mb-6 max-w-sm">
            Please log in through the top navigation bar to access your operative profile and tournament seeds.
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 bg-gt-cyan text-black font-orbitron text-xs font-bold uppercase cyber-cut glow-cyan"
          >
            RETURN TO GRID
          </Link>
        </main>
      </div>
    );
  }

  const activePreset = selectedPreset ?? user.avatarUrl ?? AVATAR_PRESETS[0];

  return (
    <div className="min-h-screen bg-gt-bg text-gt-text font-rajdhani selection:bg-gt-cyan selection:text-black">
      <Navbar />

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto space-y-8">
        {/* Header Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-gt-cyan hover:text-white transition-colors mb-4 group tracking-wider uppercase"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO HOME</span>
          </Link>

          <div className="section-label text-gt-cyan mb-1 font-mono text-xs uppercase tracking-widest">
            OPERATIVE_ID // DATA SHEET
          </div>

          <h1 className="font-orbitron text-3xl md:text-5xl font-black uppercase text-white tracking-widest flex items-center gap-3">
            GAMER PROFILE
            <Sparkles size={28} className="text-gt-cyan" />
          </h1>
        </div>

        {/* Profile Card & Avatar Customizer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main User Card */}
          <div className="lg:col-span-2 bg-[#0D121B] border border-gt-border p-6 sm:p-8 rounded-sm cyber-cut relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-gt-border/60">
              {/* Avatar Box */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-sm border-2 flex items-center justify-center font-orbitron font-extrabold text-3xl sm:text-4xl shadow-[0_0_20px_rgba(0,240,255,0.2)] cyber-cut transition-all ${
                  activePreset
                }`}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>

              {/* User Meta */}
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-white uppercase tracking-wider">
                    {user.username}
                  </h2>
                  <span className="px-2.5 py-0.5 bg-gt-cyan/15 border border-gt-cyan/50 text-gt-cyan font-mono text-xs uppercase font-bold rounded-sm">
                    {user.role}
                  </span>
                </div>

                <div className="font-mono text-xs text-gt-text-dim flex items-center gap-2">
                  <Mail size={13} />
                  <span>{user.email}</span>
                </div>

                <div className="font-mono text-xs text-gt-yellow flex items-center gap-2 pt-1 font-bold">
                  <Award size={14} />
                  <span>REPUTATION SCORE: {user.reputationScore ?? 100} / 100</span>
                </div>

                <div className="pt-2">
                  <Link
                    href="/wallet"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/50 hover:border-yellow-400 text-yellow-400 font-orbitron text-xs font-bold uppercase rounded-sm cyber-cut-sm shadow-[0_0_12px_rgba(234,179,8,0.2)] transition-all"
                  >
                    <span>⚡ NẠP TIỀN / VÍ ({walletBalance !== null ? walletBalance.toLocaleString('vi-VN') : (user.walletBalance ?? 0).toLocaleString('vi-VN')} đ)</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Avatar Theme Picker */}
            <div className="pt-6 space-y-3">
              <div className="font-mono text-xs text-gt-text-dim uppercase tracking-wider flex justify-between items-center">
                <span>SELECT CYBERPUNK BADGE GLOW</span>
                {saveSuccess && (
                  <span className="text-gt-green flex items-center gap-1 font-bold animate-fadeIn">
                    <CheckCircle size={12} /> PROFILE SYNCHRONIZED
                  </span>
                )}
              </div>

              <div className="flex gap-3 flex-wrap">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    disabled={saving}
                    onClick={() => handleSaveAvatar(preset)}
                    className={`w-10 h-10 rounded-sm border-2 transition-all cursor-pointer flex items-center justify-center font-orbitron font-bold text-sm ${preset} ${
                      activePreset === preset ? 'scale-110 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Standing Panel */}
          <div className="bg-[#0D121B] border border-gt-border p-6 rounded-sm space-y-4">
            <div className="section-label text-gt-green text-[10px] font-mono uppercase">
              STATUS // VERIFIED
            </div>
            <h3 className="font-orbitron text-lg font-bold text-white uppercase">
              COMMUNITY TRUST
            </h3>
            <div className="space-y-3 font-mono text-xs text-gt-text-dim">
              <div className="flex justify-between pb-2 border-b border-gt-border/40">
                <span>Account Standing</span>
                <span className="text-gt-green font-bold">PRISTINE</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gt-border/40">
                <span>Disciplinary Strikes</span>
                <span className="text-white font-bold">0 Active</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gt-border/40">
                <span>Match Reliability</span>
                <span className="text-gt-cyan font-bold">99.4%</span>
              </div>
              <div className="flex justify-between">
                <span>Mic Endorsement</span>
                <span className="text-gt-magenta font-bold">COMM-CLEAR</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Registered Tournaments */}
        <div className="bg-[#0D121B] border border-gt-border p-6 sm:p-8 rounded-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gt-border/60">
            <div>
              <div className="section-label text-gt-yellow text-[10px] font-mono uppercase">
                BRACKET_SEEDS // REGISTRATION HISTORY
              </div>
              <h2 className="font-orbitron text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                MY TOURNAMENT REGISTRATIONS
                <Trophy size={18} className="text-gt-yellow" />
              </h2>
            </div>
            <Link
              href="/tournament"
              className="font-mono text-xs text-gt-cyan hover:text-white uppercase tracking-wider"
            >
              BROWSE EVENTS →
            </Link>
          </div>

          {loadingTournaments ? (
            <div className="py-8 text-center font-mono text-xs text-gt-text-dim">
              Loading confirmed seeds...
            </div>
          ) : tournaments.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-gt-text-dim space-y-2">
              <Trophy size={28} className="mx-auto text-gt-text-dim/40" />
              <p>No tournament squads registered under this operative tag.</p>
              <Link
                href="/tournament"
                className="inline-block mt-2 px-4 py-1.5 bg-gt-yellow/20 border border-gt-yellow text-gt-yellow font-orbitron text-xs font-bold uppercase rounded-sm hover:bg-gt-yellow hover:text-black transition-all"
              >
                Register For an Event
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournaments.map((reg, idx) => (
                <div
                  key={reg.id || idx}
                  className="bg-[#080D15] border border-gt-border hover:border-gt-yellow/50 p-4 rounded-sm space-y-2 font-mono text-xs transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-orbitron font-bold text-white text-sm uppercase">
                      {reg.teamName || 'SQUAD SEED'}
                    </span>
                    <span className="px-2 py-0.5 bg-gt-green/15 border border-gt-green/40 text-gt-green text-[10px] uppercase font-bold rounded-sm">
                      {reg.status || 'CONFIRMED'}
                    </span>
                  </div>
                  <div className="text-gt-text-dim text-[11px]">
                    Captain Discord: <span className="text-gt-cyan">{reg.captainDiscord}</span>
                  </div>
                  <div className="text-gt-text-dim text-[10px] flex items-center gap-1 pt-1 border-t border-gt-border/40">
                    <Clock size={11} />
                    <span>Registered for Tournament: {reg.tournamentId || 'ESPORTS OPEN'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
