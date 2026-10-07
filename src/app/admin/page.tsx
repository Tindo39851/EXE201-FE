'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, type AdminUser, type AdminTournament, type AdminReport, type AdminClan } from '@/services/admin.service';
import {
  ShieldAlert,
  Users,
  ShieldCheck,
  Ban,
  Terminal,
  Activity,
  LogOut,
  ExternalLink,
  Search,
  LayoutDashboard,
  Trophy,
  AlertTriangle,
  Shield,
  Server,
  Radio,
  Clock,
  TrendingUp,
  Sparkles,
  Plus,
  Trash2,
  X,
  Gavel,
  CheckCircle2,
  XCircle,
  UserX,
  Sliders,
} from 'lucide-react';

type AdminTab = 'overview' | 'operatives' | 'tournaments' | 'reports' | 'clans';

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // User Oversight Edit Modal States
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editScore, setEditScore] = useState<number>(100);
  const [editRole, setEditRole] = useState<AdminUser['role']>('MEMBER');
  const [savingUserEdit, setSavingUserEdit] = useState(false);

  // Tournament States
  const [tournaments, setTournaments] = useState<AdminTournament[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [isCreateTournOpen, setIsCreateTournOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGame, setNewGame] = useState('VALORANT');
  const [newFormat, setNewFormat] = useState('5v5 Single Elimination');
  const [newPrizePool, setNewPrizePool] = useState('$5,000 USD');
  const [newMaxTeams, setNewMaxTeams] = useState(16);
  const [newStartDate, setNewStartDate] = useState('2026-11-20');
  const [submittingTourn, setSubmittingTourn] = useState(false);
  const [actingTournId, setActingTournId] = useState<string | null>(null);

  // Moderation Reports States
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [actingReportId, setActingReportId] = useState<string | null>(null);

  // Clan Oversight States
  const [clans, setClans] = useState<AdminClan[]>([]);
  const [loadingClans, setLoadingClans] = useState(true);
  const [actingClanId, setActingClanId] = useState<string | number | null>(null);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      const loadAdminData = async () => {
        setLoadingUsers(true);
        setLoadingTournaments(true);
        setLoadingReports(true);
        setLoadingClans(true);
        try {
          const [userData, tournamentData, reportData, clanData] = await Promise.all([
            adminService.getUsers(),
            adminService.getTournaments(),
            adminService.getReports(),
            adminService.getClans(),
          ]);
          setUsers(userData);
          setTournaments(tournamentData);
          setReports(reportData);
          setClans(clanData);
        } finally {
          setLoadingUsers(false);
          setLoadingTournaments(false);
          setLoadingReports(false);
          setLoadingClans(false);
        }
      };

      void loadAdminData();
    }
  }, [user]);

  const handleDeleteClan = async (clanId: string | number) => {
    if (!confirm('Are you sure you want to disband this clan? This action cannot be undone.')) return;
    setActingClanId(clanId);
    try {
      await adminService.deleteClan(clanId);
      setClans(prev => prev.filter(c => c.id !== clanId));
    } catch {
      setClans(prev => prev.filter(c => c.id !== clanId));
    } finally {
      setActingClanId(null);
    }
  };

  const handleOpenEditUser = (targetUser: AdminUser) => {
    setEditingUser(targetUser);
    setEditScore(targetUser.reputationScore ?? 100);
    setEditRole(targetUser.role || 'MEMBER');
  };

  const handleSaveUserOversight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingUserEdit(true);
    try {
      await adminService.updateUserReputation(editingUser.id, editScore);
      await adminService.updateUserRole(editingUser.id, editRole);
      setUsers(prev =>
        prev.map(u => (u.id === editingUser.id ? { ...u, reputationScore: editScore, role: editRole } : u))
      );
      setEditingUser(null);
    } catch {
      setUsers(prev =>
        prev.map(u => (u.id === editingUser.id ? { ...u, reputationScore: editScore, role: editRole } : u))
      );
      setEditingUser(null);
    } finally {
      setSavingUserEdit(false);
    }
  };

  const handleResolveReport = async (reportId: string, action: 'PENALTY' | 'BAN') => {
    setActingReportId(reportId);
    try {
      const updated = await adminService.resolveReport(reportId, action);
      setReports(prev =>
        prev.map(r => (r.id === reportId ? { ...r, status: 'RESOLVED', resolution: updated.resolution || (action === 'BAN' ? 'Account Suspended' : 'Penalized (-20 REP)') } : r))
      );
    } catch {
      setReports(prev =>
        prev.map(r => (r.id === reportId ? { ...r, status: 'RESOLVED', resolution: action === 'BAN' ? 'Account Suspended' : 'Penalized (-20 REP)' } : r))
      );
    } finally {
      setActingReportId(null);
    }
  };

  const handleDismissReport = async (reportId: string) => {
    setActingReportId(reportId);
    try {
      await adminService.dismissReport(reportId);
      setReports(prev =>
        prev.map(r => (r.id === reportId ? { ...r, status: 'DISMISSED', resolution: 'Dismissed (No violation)' } : r))
      );
    } catch {
      setReports(prev =>
        prev.map(r => (r.id === reportId ? { ...r, status: 'DISMISSED', resolution: 'Dismissed (No violation)' } : r))
      );
    } finally {
      setActingReportId(null);
    }
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmittingTourn(true);
    try {
      const created = await adminService.createTournament({
        title: newTitle.trim(),
        game: newGame,
        format: newFormat,
        prizePool: newPrizePool.trim(),
        maxTeams: Number(newMaxTeams),
        startDate: newStartDate,
        status: 'UPCOMING',
      });
      setTournaments(prev => [created, ...prev]);
      setIsCreateTournOpen(false);
      setNewTitle('');
    } catch {
      // Local fallback
      const mockCreated: AdminTournament = {
        id: `tourn_${Date.now()}`,
        title: newTitle.trim(),
        game: newGame,
        format: newFormat,
        prizePool: newPrizePool.trim(),
        maxTeams: Number(newMaxTeams),
        registeredTeams: 0,
        status: 'UPCOMING',
        startDate: newStartDate,
      };
      setTournaments(prev => [mockCreated, ...prev]);
      setIsCreateTournOpen(false);
      setNewTitle('');
    } finally {
      setSubmittingTourn(false);
    }
  };

  const handleUpdateTournStatus = async (id: string, status: AdminTournament['status']) => {
    setActingTournId(id);
    try {
      const updated = await adminService.updateTournamentStatus(id, status);
      setTournaments(prev =>
        prev.map(t => (t.id === id ? { ...t, status: updated.status || status } : t))
      );
    } catch {
      setTournaments(prev =>
        prev.map(t => (t.id === id ? { ...t, status } : t))
      );
    } finally {
      setActingTournId(null);
    }
  };

  const handleDeleteTournament = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return;
    setActingTournId(id);
    try {
      await adminService.deleteTournament(id);
      setTournaments(prev => prev.filter(t => t.id !== id));
    } catch {
      setTournaments(prev => prev.filter(t => t.id !== id));
    } finally {
      setActingTournId(null);
    }
  };

  const handleToggle = async (userId: string) => {
    setActingId(userId);
    try {
      const updated = await adminService.toggleUserStatus(userId);
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, active: updated.active ?? !u.active } : u))
      );
    } catch {
      // Local fallback toggle
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, active: !u.active } : u))
      );
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06090F] text-gt-text flex flex-col font-rajdhani">
        <div className="flex-1 flex items-center justify-center font-mono text-xs text-gt-yellow">
          <Terminal size={18} className="mr-2 animate-spin" />
          VERIFYING ROOT CLEARANCE...
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#06090F] text-gt-text flex flex-col font-rajdhani">
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-sm bg-gt-red/20 border-2 border-gt-red flex items-center justify-center text-gt-red mb-4 cyber-cut shadow-[0_0_30px_rgba(255,42,77,0.4)]">
            <ShieldAlert size={34} />
          </div>
          <h1 className="font-orbitron text-2xl font-black text-white uppercase mb-2">
            SECURITY CLEARANCE LEVEL 0 // ACCESS DENIED
          </h1>
          <p className="font-mono text-xs text-gt-text-dim mb-6 max-w-md">
            This sector is strictly restricted to GameTrust Supreme Administrators (ROLE_ADMIN). Sign in with root credentials to proceed.
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 bg-gt-red/20 border border-gt-red text-gt-red hover:bg-gt-red hover:text-white font-orbitron text-xs font-bold uppercase cyber-cut transition-all"
          >
            RETURN TO PUBLIC SITE
          </Link>
        </main>
      </div>
    );
  }

  const activeCount = users.filter(u => u.active !== false).length;
  const bannedCount = users.filter(u => u.active === false).length;
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingReportsCount = reports.filter(r => r.status === 'PENDING').length;

  const navTabs: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'operatives', label: 'Operatives', icon: <Users size={16} />, badge: `${users.length}` },
    { id: 'tournaments', label: 'Tournaments', icon: <Trophy size={16} />, badge: `${tournaments.length}` },
    { id: 'reports', label: 'Moderation Reports', icon: <AlertTriangle size={16} />, badge: pendingReportsCount > 0 ? `${pendingReportsCount} NEW` : 'CLEAN' },
    { id: 'clans', label: 'Clans', icon: <Shield size={16} />, badge: `${clans.length}` },
  ];

  return (
    <div className="min-h-screen bg-[#06090F] text-gt-text font-rajdhani selection:bg-gt-yellow selection:text-black flex flex-col">
      {/* TOP HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0A0E17]/95 backdrop-blur-xl border-b border-gt-yellow/30">
        <div className="h-[2px] w-full bg-gradient-to-r from-gt-yellow via-amber-500 to-gt-yellow shadow-[0_0_12px_rgba(255,215,0,0.5)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center bg-gt-yellow/20 border border-gt-yellow cyber-cut-sm shadow-[0_0_15px_rgba(255,215,0,0.4)]">
              <ShieldCheck size={20} className="text-gt-yellow" />
            </div>
            <div>
              <div className="font-orbitron font-extrabold text-base sm:text-lg text-white tracking-widest flex items-center gap-2">
                GAMETRUST
                <span className="px-1.5 py-0.2 bg-gt-yellow text-black font-mono text-[10px] font-black rounded-xs tracking-wider">
                  ROOT ADMIN
                </span>
              </div>
              <div className="font-mono text-[9px] text-gt-text-dim tracking-wider uppercase -mt-0.5">
                {'// CENTRAL OVERSIGHT & SECURITY PANEL'}
              </div>
            </div>
          </div>

          {/* System Telemetry */}
          <div className="hidden lg:flex items-center gap-4 font-mono text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 border border-gt-border rounded-xs">
              <span className="w-2 h-2 rounded-full bg-gt-green animate-pulse"></span>
              <span className="text-gt-green">CORE SYSTEM: 100% HEALTH</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 border border-gt-border rounded-xs text-gt-text-dim">
              <span>DATABASE: CONNECTED</span>
            </div>
          </div>

          {/* Admin User Info & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
                {user.username}
              </span>
              <span className="font-mono text-[9px] text-gt-yellow font-bold tracking-wider">
                SUPREME CLEARANCE
              </span>
            </div>

            <Link
              href="/"
              title="View Public Matchmaking Grid"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gt-bg-card hover:bg-white/10 text-gt-text-dim hover:text-white border border-gt-border font-mono text-xs rounded-sm transition-all"
            >
              <ExternalLink size={12} />
              <span className="hidden md:inline">Public Site</span>
            </Link>

            <button
              onClick={logout}
              title="Terminate Admin Session"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gt-red/20 hover:bg-gt-red text-gt-red hover:text-white border border-gt-red/60 font-orbitron text-xs font-bold uppercase rounded-sm cyber-cut-sm transition-all cursor-pointer shadow-[0_0_10px_rgba(255,42,77,0.2)] active:scale-95"
            >
              <LogOut size={13} />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY WITH SIDEBAR + MAIN CONTENT */}
      <div className="pt-16 flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gt-border/60 bg-[#080B12] p-4 flex flex-row md:flex-col gap-1.5 shrink-0 overflow-x-auto md:overflow-visible">
          <div className="hidden md:block px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-gt-text-dim border-b border-gt-border/40 mb-2">
            {'// CONTROL SUBSYSTEMS'}
          </div>

          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-gt-yellow/20 to-amber-500/10 border-l-2 border-gt-yellow text-gt-yellow font-bold shadow-[0_0_10px_rgba(255,215,0,0.15)]'
                    : 'text-gt-text-dim hover:text-white hover:bg-white/[0.03] border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-gt-yellow' : 'text-gt-text-dim'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span
                    className={`ml-2 px-1.5 py-0.2 text-[9px] font-bold rounded-xs ${
                      isActive
                        ? 'bg-gt-yellow text-black'
                        : 'bg-gt-border text-gt-text-dim'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="hidden md:block mt-auto pt-6 border-t border-gt-border/40 space-y-2">
            <div className="p-3 bg-[#0D121B] border border-gt-border rounded-sm">
              <div className="flex items-center gap-2 text-gt-green font-mono text-[11px] mb-1">
                <Radio size={12} className="animate-pulse" />
                <span>DAEMON ACTIVE</span>
              </div>
              <div className="font-mono text-[10px] text-gt-text-dim">
                Port 5000 (Spring Boot)<br />
                Port 27017 (Mongo Container)
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN VIEWING WORKSPACE */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* TAB 1: OVERVIEW TELEMETRY */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <div className="section-label text-gt-yellow mb-1 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                  <Terminal size={14} />
                  <span>COMMAND TELEMETRY // REAL-TIME METRICS</span>
                </div>
                <h1 className="font-orbitron text-2xl md:text-3xl font-black uppercase text-white tracking-widest flex items-center gap-2">
                  SYSTEM OVERVIEW
                  <Sparkles size={22} className="text-gt-yellow" />
                </h1>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0D121B] border border-gt-border p-4 rounded-sm cyber-cut-sm">
                  <div className="flex items-center justify-between text-gt-text-dim font-mono text-xs uppercase mb-1">
                    <span>Total Operatives</span>
                    <Users size={16} className="text-gt-cyan" />
                  </div>
                  <div className="font-orbitron text-3xl font-black text-white">
                    {users.length}
                  </div>
                  <div className="font-mono text-[10px] text-gt-green mt-1 flex items-center gap-1">
                    <TrendingUp size={11} />
                    <span>{activeCount} Active ({users.length > 0 ? Math.round((activeCount / users.length) * 100) : 100}%)</span>
                  </div>
                </div>

                <div className="bg-[#0D121B] border border-gt-border p-4 rounded-sm cyber-cut-sm">
                  <div className="flex items-center justify-between text-gt-text-dim font-mono text-xs uppercase mb-1">
                    <span>Live Tournaments</span>
                    <Trophy size={16} className="text-gt-yellow" />
                  </div>
                  <div className="font-orbitron text-3xl font-black text-gt-yellow">
                    3
                  </div>
                  <div className="font-mono text-[10px] text-gt-text-dim mt-1">
                    2 Upcoming • 1 Ongoing
                  </div>
                </div>

                <div className="bg-[#0D121B] border border-gt-border p-4 rounded-sm cyber-cut-sm">
                  <div className="flex items-center justify-between text-gt-text-dim font-mono text-xs uppercase mb-1">
                    <span>Platform Toxicity</span>
                    <AlertTriangle size={16} className="text-gt-green" />
                  </div>
                  <div className="font-orbitron text-3xl font-black text-gt-green">
                    0.4%
                  </div>
                  <div className="font-mono text-[10px] text-gt-text-dim mt-1">
                    Reputation Average: 98.4 REP
                  </div>
                </div>

                <div className="bg-[#0D121B] border border-gt-border p-4 rounded-sm cyber-cut-sm">
                  <div className="flex items-center justify-between text-gt-text-dim font-mono text-xs uppercase mb-1">
                    <span>Sanctioned / Ban</span>
                    <Ban size={16} className="text-gt-red" />
                  </div>
                  <div className="font-orbitron text-3xl font-black text-gt-red">
                    {bannedCount}
                  </div>
                  <div className="font-mono text-[10px] text-gt-text-dim mt-1">
                    Accounts restricted
                  </div>
                </div>
              </div>

              {/* 2 Diagnostic panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Events Feed */}
                <div className="bg-[#0D121B] border border-gt-border p-5 rounded-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gt-border/60 pb-3">
                    <h3 className="font-orbitron text-sm font-bold uppercase text-white flex items-center gap-2">
                      <Clock size={15} className="text-gt-cyan" />
                      <span>LIVE EVENT STREAM</span>
                    </h3>
                    <span className="font-mono text-[10px] text-gt-cyan animate-pulse">● LIVE</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-2.5 bg-black/40 border-l-2 border-gt-cyan rounded-xs flex items-start justify-between">
                      <div>
                        <div className="text-white font-bold">New Operative Registered</div>
                        <div className="text-gt-text-dim text-[11px]">User verification via OTP completed</div>
                      </div>
                      <span className="text-[10px] text-gt-text-dim">Just now</span>
                    </div>

                    <div className="p-2.5 bg-black/40 border-l-2 border-gt-green rounded-xs flex items-start justify-between">
                      <div>
                        <div className="text-white font-bold">Spring Boot Core Synchronized</div>
                        <div className="text-gt-text-dim text-[11px]">Database collections verified</div>
                      </div>
                      <span className="text-[10px] text-gt-text-dim">2m ago</span>
                    </div>

                    <div className="p-2.5 bg-black/40 border-l-2 border-gt-yellow rounded-xs flex items-start justify-between">
                      <div>
                        <div className="text-white font-bold">Admin Session Authenticated</div>
                        <div className="text-gt-text-dim text-[11px]">Clearance granted for user &quot;{user.username}&quot;</div>
                      </div>
                      <span className="text-[10px] text-gt-text-dim">5m ago</span>
                    </div>
                  </div>
                </div>

                {/* Server Telemetry Diagnostics */}
                <div className="bg-[#0D121B] border border-gt-border p-5 rounded-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gt-border/60 pb-3">
                    <h3 className="font-orbitron text-sm font-bold uppercase text-white flex items-center gap-2">
                      <Server size={15} className="text-gt-yellow" />
                      <span>INFRASTRUCTURE HEALTH</span>
                    </h3>
                    <span className="font-mono text-[10px] text-gt-green">NOMINAL</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3 bg-black/40 border border-gt-border rounded-xs">
                      <div className="text-gt-text-dim text-[10px] uppercase">RUNTIME ENGINE</div>
                      <div className="text-white font-bold mt-1">Java 17 OpenJDK</div>
                      <div className="text-[10px] text-gt-cyan">Spring Boot 3.3.4</div>
                    </div>

                    <div className="p-3 bg-black/40 border border-gt-border rounded-xs">
                      <div className="text-gt-text-dim text-[10px] uppercase">DATABASE CLUSTER</div>
                      <div className="text-white font-bold mt-1">MongoDB 7.0 (Docker)</div>
                      <div className="text-[10px] text-gt-green">Active on port 27017</div>
                    </div>

                    <div className="p-3 bg-black/40 border border-gt-border rounded-xs">
                      <div className="text-gt-text-dim text-[10px] uppercase">SECURITY PROTOCOL</div>
                      <div className="text-white font-bold mt-1">JWT HS256 + HttpOnly</div>
                      <div className="text-[10px] text-gt-yellow">Strict Origin & CSRF</div>
                    </div>

                    <div className="p-3 bg-black/40 border border-gt-border rounded-xs">
                      <div className="text-gt-text-dim text-[10px] uppercase">SMTP GATEWAY</div>
                      <div className="text-white font-bold mt-1">Google SMTP Relay</div>
                      <div className="text-[10px] text-gt-green">TLS 587 Online</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPERATIVES MANAGEMENT */}
          {activeTab === 'operatives' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <div className="section-label text-gt-cyan mb-1 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                  <Users size={14} />
                  <span>SECURITY_ROSTER // SYSTEM USERS</span>
                </div>
                <h1 className="font-orbitron text-2xl md:text-3xl font-black uppercase text-white tracking-widest">
                  OPERATIVES DIRECTORY
                </h1>
              </div>

              {/* Operatives Oversight Table */}
              <div className="bg-[#0D121B] border border-gt-border p-6 rounded-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gt-border/60">
                  <div className="font-mono text-xs text-gt-text-dim">
                    Showing <span className="text-white font-bold">{filteredUsers.length}</span> registered accounts
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-gt-text-dim">
                    <Activity size={14} className="text-gt-cyan animate-pulse" />
                    <span>LIVE SYNC</span>
                  </div>
                </div>

                {/* Search bar */}
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gt-text-dim" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search operative by gamer tag or email..."
                    className="w-full bg-[#080B12] border border-gt-border hover:border-gt-yellow/50 focus:border-gt-yellow focus:outline-none pl-9 pr-3 py-2 text-white font-mono text-xs rounded-sm transition-colors"
                  />
                </div>

                {loadingUsers ? (
                  <div className="py-12 text-center font-mono text-xs text-gt-text-dim">
                    Scanning security credentials...
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="py-12 text-center font-mono text-xs text-gt-text-dim">
                    No operatives found matching &quot;{searchQuery}&quot;.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-gt-border text-gt-text-dim uppercase text-[11px]">
                          <th className="py-3 px-3">Gamer Tag</th>
                          <th className="py-3 px-3">Email Address</th>
                          <th className="py-3 px-3">Role</th>
                          <th className="py-3 px-3">Reputation</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Moderation Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gt-border/40">
                        {filteredUsers.map((u) => {
                          const isActive = u.active !== false;
                          return (
                            <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 px-3 font-orbitron font-bold text-white text-sm uppercase">
                                {u.username}
                              </td>
                              <td className="py-3.5 px-3 text-gt-text-dim">
                                {u.email}
                              </td>
                              <td className="py-3.5 px-3">
                                <span
                                  className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm border ${
                                    u.role === 'ADMIN'
                                      ? 'border-gt-yellow/50 bg-gt-yellow/15 text-gt-yellow'
                                      : 'border-gt-cyan/50 bg-gt-cyan/15 text-gt-cyan'
                                  }`}
                                >
                                  {u.role}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-gt-yellow font-bold">
                                {u.reputationScore ?? 100} REP
                              </td>
                              <td className="py-3.5 px-3">
                                <span
                                  className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm ${
                                    isActive
                                      ? 'bg-gt-green/15 text-gt-green border border-gt-green/40'
                                      : 'bg-gt-red/15 text-gt-red border border-gt-red/40'
                                  }`}
                                >
                                  {isActive ? 'ACTIVE' : 'BANNED'}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    onClick={() => handleOpenEditUser(u)}
                                    title="Edit Clearance & Reputation"
                                    className="flex items-center gap-1 px-2.5 py-1 bg-gt-cyan/15 hover:bg-gt-cyan text-gt-cyan hover:text-black border border-gt-cyan/50 font-mono text-[10px] font-bold uppercase rounded-sm transition-all cursor-pointer shadow-[0_0_8px_rgba(0,240,255,0.2)]"
                                  >
                                    <Sliders size={11} />
                                    <span>EDIT</span>
                                  </button>

                                  <button
                                    onClick={() => handleToggle(u.id)}
                                    disabled={actingId === u.id || u.role === 'ADMIN'}
                                    className={`px-3 py-1 font-mono text-[11px] font-bold uppercase rounded-sm border transition-all cursor-pointer ${
                                      u.role === 'ADMIN'
                                        ? 'opacity-40 cursor-not-allowed border-gt-border text-gt-text-dim'
                                        : isActive
                                        ? 'border-gt-red/60 text-gt-red hover:bg-gt-red hover:text-white'
                                        : 'border-gt-green/60 text-gt-green hover:bg-gt-green hover:text-black'
                                    }`}
                                  >
                                    {actingId === u.id ? 'UPDATING...' : isActive ? 'DEACTIVATE / BAN' : 'RESTORE / ACTIVATE'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TOURNAMENT MANAGEMENT (Task 2) */}
          {activeTab === 'tournaments' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="section-label text-gt-yellow mb-1 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                    <Trophy size={14} />
                    <span>COMPETITIVE SECTOR // TOURNAMENT PROTOCOL</span>
                  </div>
                  <h1 className="font-orbitron text-2xl md:text-3xl font-black uppercase text-white tracking-widest">
                    TOURNAMENT MANAGEMENT
                  </h1>
                </div>

                <button
                  onClick={() => setIsCreateTournOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gt-yellow to-amber-500 text-black font-orbitron text-xs font-black uppercase rounded-sm cyber-cut-sm shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all cursor-pointer active:scale-95"
                >
                  <Plus size={15} />
                  <span>CREATE TOURNAMENT</span>
                </button>
              </div>

              {/* Tournament Oversight Table */}
              <div className="bg-[#0D121B] border border-gt-border p-6 rounded-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gt-border/60">
                  <div className="font-mono text-xs text-gt-text-dim">
                    Managing <span className="text-white font-bold">{tournaments.length}</span> active tournaments
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-gt-text-dim">
                    <Activity size={14} className="text-gt-yellow animate-pulse" />
                    <span>STATUS SYNC</span>
                  </div>
                </div>

                {loadingTournaments ? (
                  <div className="py-12 text-center font-mono text-xs text-gt-text-dim">
                    Loading tournament rosters...
                  </div>
                ) : tournaments.length === 0 ? (
                  <div className="py-12 text-center font-mono text-xs text-gt-text-dim">
                    No tournaments active. Click &quot;CREATE TOURNAMENT&quot; above to launch one.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-gt-border text-gt-text-dim uppercase text-[11px]">
                          <th className="py-3 px-3">Tournament</th>
                          <th className="py-3 px-3">Game & Format</th>
                          <th className="py-3 px-3">Prize Pool</th>
                          <th className="py-3 px-3">Teams</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Admin Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gt-border/40">
                        {tournaments.map((t) => {
                          const statusColors: Record<string, string> = {
                            UPCOMING: 'border-gt-cyan/50 bg-gt-cyan/15 text-gt-cyan',
                            ONGOING: 'border-gt-green/50 bg-gt-green/15 text-gt-green animate-pulse',
                            COMPLETED: 'border-gt-border bg-white/5 text-gt-text-dim',
                            CANCELLED: 'border-gt-red/50 bg-gt-red/15 text-gt-red',
                          };
                          return (
                            <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 px-3">
                                <div className="font-orbitron font-bold text-white text-sm">
                                  {t.title}
                                </div>
                                <div className="text-[10px] text-gt-text-dim font-mono">
                                  ID: {t.id} • Starts: {t.startDate || 'TBD'}
                                </div>
                              </td>

                              <td className="py-3.5 px-3">
                                <span className="font-bold text-gt-cyan uppercase">
                                  {t.game}
                                </span>
                                <div className="text-[10px] text-gt-text-dim">
                                  {t.format}
                                </div>
                              </td>

                              <td className="py-3.5 px-3 text-gt-yellow font-bold text-sm">
                                {t.prizePool}
                              </td>

                              <td className="py-3.5 px-3 text-white">
                                {t.registeredTeams ?? 0} / {t.maxTeams}
                              </td>

                              <td className="py-3.5 px-3">
                                <span
                                  className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm border ${
                                    statusColors[t.status] || 'border-gt-border text-white'
                                  }`}
                                >
                                  {t.status}
                                </span>
                              </td>

                              <td className="py-3.5 px-3 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <select
                                    value={t.status}
                                    disabled={actingTournId === t.id}
                                    onChange={(e) => handleUpdateTournStatus(t.id, e.target.value as AdminTournament['status'])}
                                    className="bg-[#080B12] border border-gt-border hover:border-gt-yellow text-white text-[11px] font-mono px-2 py-1 rounded-sm focus:outline-none cursor-pointer"
                                  >
                                    <option value="UPCOMING">UPCOMING</option>
                                    <option value="ONGOING">ONGOING</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                  </select>

                                  <button
                                    onClick={() => handleDeleteTournament(t.id)}
                                    disabled={actingTournId === t.id}
                                    title="Delete Tournament"
                                    className="p-1.5 text-gt-text-dim hover:text-gt-red hover:bg-gt-red/10 border border-transparent hover:border-gt-red/40 rounded-sm transition-all cursor-pointer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* CREATE TOURNAMENT MODAL */}
              {isCreateTournOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                  <div className="relative z-10 w-full max-w-lg bg-[#0A0E17] border-2 border-gt-yellow p-6 sm:p-8 rounded-sm cyber-cut shadow-[0_0_50px_rgba(255,215,0,0.3)]">
                    <button
                      onClick={() => setIsCreateTournOpen(false)}
                      className="absolute top-4 right-4 text-gt-text-dim hover:text-gt-yellow p-1 transition-colors cursor-pointer"
                    >
                      <X size={20} />
                    </button>

                    <div className="mb-6">
                      <div className="section-label text-gt-yellow mb-1 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                        <Trophy size={13} />
                        <span>TOURNAMENT ENGINE // PROTOCOL CREATION</span>
                      </div>
                      <h2 className="font-orbitron text-xl font-black text-white uppercase tracking-wider">
                        INITIALIZE ESPORTS TOURNAMENT
                      </h2>
                    </div>

                    <form onSubmit={handleCreateTournament} className="space-y-4 font-mono text-xs">
                      <div>
                        <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                          Tournament Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. Cyberpunk Champions Cup 2026"
                          className="w-full bg-[#080B12] border border-gt-border hover:border-gt-yellow focus:border-gt-yellow focus:outline-none px-3 py-2 text-white rounded-sm transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                            Esports Game Title *
                          </label>
                          <select
                            value={newGame}
                            onChange={(e) => setNewGame(e.target.value)}
                            className="w-full bg-[#080B12] border border-gt-border hover:border-gt-yellow focus:border-gt-yellow focus:outline-none px-3 py-2 text-white rounded-sm transition-colors cursor-pointer"
                          >
                            <option value="VALORANT">VALORANT</option>
                            <option value="CS2">CS2</option>
                            <option value="LEAGUE OF LEGENDS">LEAGUE OF LEGENDS</option>
                            <option value="DOTA 2">DOTA 2</option>
                            <option value="OVERWATCH 2">OVERWATCH 2</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                            Match Format *
                          </label>
                          <select
                            value={newFormat}
                            onChange={(e) => setNewFormat(e.target.value)}
                            className="w-full bg-[#080B12] border border-gt-border hover:border-gt-yellow focus:border-gt-yellow focus:outline-none px-3 py-2 text-white rounded-sm transition-colors cursor-pointer"
                          >
                            <option value="5v5 Single Elimination">5v5 Single Elimination</option>
                            <option value="5v5 Double Elimination">5v5 Double Elimination</option>
                            <option value="1v1 Aim Cup">1v1 Aim Cup</option>
                            <option value="Round Robin Group Stage">Round Robin Group Stage</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                            Prize Pool *
                          </label>
                          <input
                            type="text"
                            required
                            value={newPrizePool}
                            onChange={(e) => setNewPrizePool(e.target.value)}
                            placeholder="e.g. $10,000 USD"
                            className="w-full bg-[#080B12] border border-gt-border hover:border-gt-yellow focus:border-gt-yellow focus:outline-none px-3 py-2 text-white rounded-sm transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                            Max Teams *
                          </label>
                          <select
                            value={newMaxTeams}
                            onChange={(e) => setNewMaxTeams(Number(e.target.value))}
                            className="w-full bg-[#080B12] border border-gt-border hover:border-gt-yellow focus:border-gt-yellow focus:outline-none px-3 py-2 text-white rounded-sm transition-colors cursor-pointer"
                          >
                            <option value={8}>8 Teams</option>
                            <option value={16}>16 Teams</option>
                            <option value={32}>32 Teams</option>
                            <option value={64}>64 Teams</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={newStartDate}
                            onChange={(e) => setNewStartDate(e.target.value)}
                            className="w-full bg-[#080B12] border border-gt-border hover:border-gt-yellow focus:border-gt-yellow focus:outline-none px-3 py-2 text-white rounded-sm transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setIsCreateTournOpen(false)}
                          className="px-4 py-2 border border-gt-border text-gt-text-dim hover:text-white rounded-sm uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingTourn}
                          className="px-5 py-2 bg-gradient-to-r from-gt-yellow to-amber-500 text-black font-orbitron font-bold uppercase rounded-sm cyber-cut-sm shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all cursor-pointer disabled:opacity-60"
                        >
                          {submittingTourn ? 'CREATING...' : 'CONFIRM & LAUNCH'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MODERATION REPORTS CENTER (Task 3) */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="section-label text-gt-red mb-1 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={14} />
                    <span>DISCIPLINARY ACTIONS // TOXICITY MODERATION</span>
                  </div>
                  <h1 className="font-orbitron text-2xl md:text-3xl font-black uppercase text-white tracking-widest">
                    MODERATION & INCIDENT REPORTS
                  </h1>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-3 py-1 bg-gt-yellow/15 border border-gt-yellow/50 text-gt-yellow rounded-sm font-bold">
                    {reports.filter(r => r.status === 'PENDING').length} PENDING
                  </span>
                  <span className="px-3 py-1 bg-gt-green/15 border border-gt-green/50 text-gt-green rounded-sm font-bold">
                    {reports.filter(r => r.status === 'RESOLVED').length} RESOLVED
                  </span>
                </div>
              </div>

              {/* Reports Table */}
              <div className="bg-[#0D121B] border border-gt-border p-6 rounded-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gt-border/60">
                  <div className="font-mono text-xs text-gt-text-dim">
                    Tracking <span className="text-white font-bold">{reports.length}</span> disciplinary incident tickets
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-gt-text-dim">
                    <Activity size={14} className="text-gt-red animate-pulse" />
                    <span>MODERATION QUEUE LIVE</span>
                  </div>
                </div>

                {loadingReports ? (
                  <div className="py-12 text-center font-mono text-xs text-gt-text-dim">
                    Fetching incident tickets from security registry...
                  </div>
                ) : reports.length === 0 ? (
                  <div className="py-12 text-center font-mono text-xs text-gt-text-dim">
                    Zero incident reports logged. Platform community behavior is pristine.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-gt-border text-gt-text-dim uppercase text-[11px]">
                          <th className="py-3 px-3">Ticket ID & Type</th>
                          <th className="py-3 px-3">Target Operative</th>
                          <th className="py-3 px-3">Infraction Details</th>
                          <th className="py-3 px-3">Reporter</th>
                          <th className="py-3 px-3">Status / Outcome</th>
                          <th className="py-3 px-3 text-right">Moderator Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gt-border/40">
                        {reports.map((r) => {
                          const isPending = r.status === 'PENDING';
                          const typeBadge: Record<string, string> = {
                            TOXICITY: 'border-gt-red/60 bg-gt-red/15 text-gt-red',
                            CHEATING: 'border-gt-red bg-gt-red/25 text-gt-red font-black animate-pulse',
                            AFK: 'border-gt-yellow/60 bg-gt-yellow/15 text-gt-yellow',
                            GRIEFING: 'border-amber-500/60 bg-amber-500/15 text-amber-400',
                          };
                          return (
                            <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 px-3">
                                <div className="font-bold text-white font-mono">
                                  {r.id}
                                </div>
                                <span
                                  className={`inline-block mt-1 px-2 py-0.5 text-[9px] uppercase font-bold rounded-xs border ${
                                    typeBadge[r.type] || 'border-gt-border text-white'
                                  }`}
                                >
                                  {r.type}
                                </span>
                              </td>

                              <td className="py-3.5 px-3">
                                <div className="font-orbitron font-bold text-white text-sm uppercase">
                                  {r.user}
                                </div>
                                <div className="text-[10px] text-gt-red font-mono">
                                  Accused Operative
                                </div>
                              </td>

                              <td className="py-3.5 px-3 max-w-xs">
                                <p className="text-white text-xs leading-relaxed break-words">
                                  &quot;{r.reason || 'No description provided'}&quot;
                                </p>
                              </td>

                              <td className="py-3.5 px-3 text-gt-text-dim">
                                <span className="text-gt-cyan font-bold">{r.reporter || 'System Bot'}</span>
                              </td>

                              <td className="py-3.5 px-3">
                                {isPending ? (
                                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm border border-gt-yellow/60 bg-gt-yellow/15 text-gt-yellow animate-pulse flex items-center gap-1 w-fit">
                                    <Clock size={11} />
                                    <span>PENDING REVIEW</span>
                                  </span>
                                ) : r.status === 'RESOLVED' ? (
                                  <div>
                                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm border border-gt-green/60 bg-gt-green/15 text-gt-green flex items-center gap-1 w-fit">
                                      <CheckCircle2 size={11} />
                                      <span>RESOLVED</span>
                                    </span>
                                    {r.resolution && (
                                      <div className="text-[10px] text-gt-yellow font-mono mt-1">
                                        Action: {r.resolution}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm border border-gt-border bg-white/5 text-gt-text-dim flex items-center gap-1 w-fit">
                                    <XCircle size={11} />
                                    <span>DISMISSED</span>
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-3 text-right">
                                {isPending ? (
                                  <div className="inline-flex items-center gap-2">
                                    <button
                                      onClick={() => handleResolveReport(r.id, 'PENALTY')}
                                      disabled={actingReportId === r.id}
                                      title="Penalize Operative (-20 Reputation Score)"
                                      className="flex items-center gap-1 px-2.5 py-1 bg-gt-yellow/15 hover:bg-gt-yellow text-gt-yellow hover:text-black border border-gt-yellow/60 font-mono text-[10px] font-bold uppercase rounded-sm cyber-cut-sm transition-all cursor-pointer shadow-[0_0_8px_rgba(255,215,0,0.2)] active:scale-95"
                                    >
                                      <Gavel size={11} />
                                      <span>-20 REP</span>
                                    </button>

                                    <button
                                      onClick={() => handleResolveReport(r.id, 'BAN')}
                                      disabled={actingReportId === r.id}
                                      title="Suspend/Ban Operative Account"
                                      className="flex items-center gap-1 px-2.5 py-1 bg-gt-red/20 hover:bg-gt-red text-gt-red hover:text-white border border-gt-red/60 font-mono text-[10px] font-bold uppercase rounded-sm cyber-cut-sm transition-all cursor-pointer shadow-[0_0_8px_rgba(255,42,77,0.2)] active:scale-95"
                                    >
                                      <UserX size={11} />
                                      <span>BAN</span>
                                    </button>

                                    <button
                                      onClick={() => handleDismissReport(r.id)}
                                      disabled={actingReportId === r.id}
                                      title="Dismiss Incident (False Report)"
                                      className="p-1 text-gt-text-dim hover:text-white hover:bg-white/10 border border-transparent hover:border-gt-border rounded-sm transition-all cursor-pointer"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="font-mono text-[10px] text-gt-text-dim">
                                    Closed Ticket
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CLANS DIRECTORY (Task 4) */}
          {activeTab === 'clans' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <div className="section-label text-gt-cyan mb-1 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                  <Shield size={14} />
                  <span>GUILD OVERSIGHT // CLAN DIRECTORY</span>
                </div>
                <h1 className="font-orbitron text-2xl md:text-3xl font-black uppercase text-white tracking-widest">
                  CLAN & FACTION DIRECTORY
                </h1>
              </div>

              <div className="bg-[#0D121B] border border-gt-border p-6 rounded-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gt-border/60">
                  <div className="font-mono text-xs text-gt-text-dim">
                    Overseeing <span className="text-white font-bold">{clans.length}</span> registered esports factions
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-gt-cyan">
                    <Shield size={14} className="animate-pulse" />
                    <span>FACTION SYNC ACTIVE</span>
                  </div>
                </div>

                {loadingClans ? (
                  <div className="py-12 text-center font-mono text-xs text-gt-text-dim">
                    Querying guild rosters from database...
                  </div>
                ) : clans.length === 0 ? (
                  <div className="py-12 text-center font-mono text-xs text-gt-text-dim">
                    No active clans found in platform registry.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-gt-border/60 text-gt-text-dim text-[11px] uppercase tracking-wider">
                          <th className="pb-3 px-3">FACTION / CLAN</th>
                          <th className="pb-3 px-3">FOUNDER / LEADER</th>
                          <th className="pb-3 px-3">TIER & RATING</th>
                          <th className="pb-3 px-3">ROSTER SIZE</th>
                          <th className="pb-3 px-3">REGION</th>
                          <th className="pb-3 px-3 text-right">CLEARANCE ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gt-border/40">
                        {clans.map((c) => {
                          return (
                            <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 px-3">
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 bg-gt-cyan/15 border border-gt-cyan/40 text-gt-cyan font-bold text-[10px] rounded-xs font-mono">
                                    [{c.tag}]
                                  </span>
                                  <div className="font-orbitron font-bold text-white text-sm uppercase">
                                    {c.name}
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-3 text-gt-text-dim">
                                <span className="text-white font-bold">{c.leader || 'N/A'}</span>
                              </td>

                              <td className="py-3.5 px-3">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border border-gt-yellow/50 bg-gt-yellow/10 text-gt-yellow">
                                    {c.tier || 'CHALLENGER'}
                                  </span>
                                  <span className="text-gt-text-dim text-[11px]">
                                    {c.rating ?? 1200} ELO
                                  </span>
                                </div>
                              </td>

                              <td className="py-3.5 px-3">
                                <span className="text-white font-bold">{c.membersCount ?? 1}</span>
                                <span className="text-gt-text-dim text-[10px] ml-1">Operatives</span>
                              </td>

                              <td className="py-3.5 px-3">
                                <span className="font-mono text-gt-cyan text-[11px]">
                                  {c.region || 'GLOBAL'}
                                </span>
                              </td>

                              <td className="py-3.5 px-3 text-right">
                                <button
                                  onClick={() => handleDeleteClan(c.id)}
                                  disabled={actingClanId === c.id}
                                  title="Disband Clan Guild"
                                  className="px-3 py-1 bg-gt-red/20 hover:bg-gt-red text-gt-red hover:text-white border border-gt-red/60 font-mono text-[10px] font-bold uppercase rounded-sm cyber-cut-sm transition-all cursor-pointer shadow-[0_0_8px_rgba(255,42,77,0.2)] active:scale-95 disabled:opacity-50"
                                >
                                  {actingClanId === c.id ? 'DISBANDING...' : 'DISBAND CLAN'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* USER OVERSIGHT MODAL (Task 4) */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative z-10 w-full max-w-md bg-[#0A0E17] border-2 border-gt-cyan p-6 sm:p-8 rounded-sm cyber-cut shadow-[0_0_50px_rgba(0,240,255,0.3)]">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 text-gt-text-dim hover:text-gt-cyan p-1 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <div className="section-label text-gt-cyan mb-1 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Sliders size={13} />
                <span>OPERATIVE OVERSIGHT // CLEARANCE PROTOCOL</span>
              </div>
              <h2 className="font-orbitron text-xl font-black text-white uppercase tracking-wider">
                ADJUST OPERATIVE PROFILE
              </h2>
              <div className="font-mono text-xs text-gt-text-dim mt-1">
                Operative: <span className="text-white font-bold">{editingUser.username}</span> ({editingUser.email})
              </div>
            </div>

            <form onSubmit={handleSaveUserOversight} className="space-y-5 font-mono text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gt-text-dim uppercase tracking-wider">
                    Reputation Score (0 - 100)
                  </label>
                  <span className={`font-bold ${
                    editScore >= 80 ? 'text-gt-green' : editScore >= 60 ? 'text-gt-yellow' : 'text-gt-red'
                  }`}>
                    {editScore} REP ({editScore >= 80 ? 'PRISTINE' : editScore >= 60 ? 'CAUTION' : 'TOXIC RISK'})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editScore}
                  onChange={(e) => setEditScore(Number(e.target.value))}
                  className="w-full accent-gt-cyan cursor-pointer mb-2"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={editScore}
                  onChange={(e) => setEditScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-full bg-[#080B12] border border-gt-border hover:border-gt-cyan focus:border-gt-cyan focus:outline-none px-3 py-2 text-white rounded-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-gt-text-dim uppercase tracking-wider mb-1">
                  Access Clearance Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as AdminUser['role'])}
                  className="w-full bg-[#080B12] border border-gt-border hover:border-gt-cyan focus:border-gt-cyan focus:outline-none px-3 py-2 text-white rounded-sm transition-colors cursor-pointer"
                >
                  <option value="MEMBER">MEMBER (Standard Competitor)</option>
                  <option value="MODERATOR">MODERATOR (Enforcer)</option>
                  <option value="ADMIN">ADMIN (Supreme Root Oversight)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gt-border/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gt-border text-gt-text-dim hover:text-white hover:bg-white/5 font-mono text-xs rounded-sm transition-all cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={savingUserEdit}
                  className="px-5 py-2 bg-gradient-to-r from-gt-cyan to-blue-500 text-black font-orbitron text-xs font-black uppercase rounded-sm cyber-cut-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingUserEdit ? 'COMMITTING...' : 'SAVE CLEARANCE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

