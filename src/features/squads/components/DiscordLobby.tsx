'use client';

import React, { useState } from 'react';
import { Hash, Mic, ChevronDown, Check, Zap, Radio, Volume2, UserCheck } from 'lucide-react';
import { useSquadMatchmaking } from '../hooks/useSquadMatchmaking';

const MY_ROLES = ['Top', 'Jungle', 'Mid', 'Bot', 'Support', 'Fill'];
const REGIONS = ['NA', 'EUW', 'EUNE', 'KR', 'OCE', 'SEA'];
const SQUAD_ROLES = ['Top', 'Jungle', 'Mid', 'Bot', 'Support', 'Any'];

const GAMES = [
  { id: 'LoL', name: 'League of Legends', count: '1,967 LFG', color: 'border-gt-cyan text-gt-cyan' },
  { id: 'VAL', name: 'VALORANT', count: '2,410 LFG', color: 'border-gt-red text-gt-red' },
  { id: 'LQ', name: 'Liên Quân Mobile', count: '1,890 LFG', color: 'border-gt-blue text-gt-blue' },
  { id: 'FF', name: 'Free Fire', count: '1,540 LFG', color: 'border-gt-orange text-gt-orange' },
];

const GAME_RANKS_MAP: Record<string, string[]> = {
  LoL: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger'],
  VAL: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'],
  LQ: ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Tinh Anh', 'Cao Thủ', 'Đại Cao Thủ', 'Chiến Tướng', 'Chiến Thần', 'Thách Đấu'],
  FF: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Heroic', 'Elite Heroic', 'Master', 'Elite Master', 'Grandmaster'],
};

export const DiscordLobby: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState('LoL');
  const [selectedChannel, setSelectedChannel] = useState('ranked-solo-duo');
  const [selectedRole, setSelectedRole] = useState('Mid');
  const [selectedRank, setSelectedRank] = useState('Diamond');
  const [selectedRegion, setSelectedRegion] = useState('NA');
  const [neededRoles, setNeededRoles] = useState<string[]>(['Jungle', 'Support']);
  const [micRequired, setMicRequired] = useState(true);

  const { isSearching, matchResult, error, startMatchmaking, resetMatchmaking } = useSquadMatchmaking();

  const toggleNeededRole = (role: string) => {
    if (role === 'Any') {
      setNeededRoles(['Any']);
    } else {
      setNeededRoles((prev) => {
        const withoutAny = prev.filter((r) => r !== 'Any');
        return withoutAny.includes(role)
          ? withoutAny.filter((r) => r !== role)
          : [...withoutAny, role];
      });
    }
  };

  const handleMatchmake = () => {
    startMatchmaking({
      gameId: selectedGame,
      primaryRole: selectedRole,
      rank: selectedRank,
      region: selectedRegion,
      neededRoles,
      micRequired,
    });
  };

  return (
    <div className="flex-1 flex overflow-hidden min-h-[calc(100vh-64px)] relative">
      
      {/* Radar Search Overlay Modal when isSearching */}
      {isSearching && (
        <div className="absolute inset-0 z-50 bg-[#07090E]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fadeIn">
          {/* Circular Sonar Radar */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mb-8">
            {/* Concentric expanding ripples */}
            <div className="absolute inset-0 rounded-full border border-gt-cyan/30 animate-sonar"></div>
            <div className="absolute inset-8 rounded-full border border-gt-cyan/20 animate-sonar" style={{ animationDelay: '0.8s' }}></div>
            <div className="absolute inset-16 rounded-full border border-gt-cyan/15 animate-sonar" style={{ animationDelay: '1.6s' }}></div>

            {/* Static Radar rings */}
            <div className="absolute inset-0 rounded-full border border-gt-cyan/20"></div>
            <div className="absolute inset-12 rounded-full border border-gt-border"></div>
            <div className="absolute inset-24 rounded-full border border-gt-border/60"></div>
            
            {/* Radar crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-gt-cyan/20"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-px bg-gt-cyan/20"></div>
            </div>

            {/* Rotating radar sweep beam */}
            <div className="absolute inset-0 rounded-full overflow-hidden animate-radar">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-gt-cyan/40 to-transparent origin-bottom-right"></div>
            </div>

            {/* Ping blips detected */}
            <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-gt-green rounded-full shadow-[0_0_10px_#00FF66] animate-ping"></div>
            <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-gt-green rounded-full shadow-[0_0_10px_#00FF66]"></div>

            <div className="absolute bottom-1/3 left-1/4 w-2.5 h-2.5 bg-gt-cyan rounded-full shadow-[0_0_8px_#00F0FF] animate-pulse"></div>

            {/* Center target core */}
            <div className="relative z-10 w-12 h-12 rounded-full bg-gt-bg border-2 border-gt-cyan flex items-center justify-center shadow-[0_0_20px_#00F0FF]">
              <Radio size={20} className="text-gt-cyan animate-pulse" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-orbitron text-xl sm:text-2xl font-black text-white uppercase tracking-widest text-glow-cyan">
              SCANNING {selectedGame} SQUADS...
            </h3>
            <p className="font-mono text-xs text-gt-cyan tracking-wider">
              MATCHING [{selectedRegion}] • RANK [{selectedRank}] • ROLES [{neededRoles.join(', ')}]
            </p>
          </div>

          {/* Voice waveform animation bars */}
          <div className="flex items-center gap-1.5 mt-6">
            <span className="w-1 bg-gt-cyan animate-eq-1 rounded-full"></span>
            <span className="w-1 bg-gt-cyan animate-eq-2 rounded-full"></span>
            <span className="w-1 bg-gt-cyan animate-eq-3 rounded-full"></span>
            <span className="w-1 bg-gt-cyan animate-eq-2 rounded-full"></span>
            <span className="w-1 bg-gt-cyan animate-eq-1 rounded-full"></span>
            <span className="font-mono text-[11px] text-gt-text-dim ml-2 uppercase">Lobby comms audio sync active</span>
          </div>
        </div>
      )}

      {/* Left Discord Sidebar */}
      <aside className="w-[240px] bg-[#0A0E17] border-r border-gt-border flex flex-col flex-shrink-0 z-20">
        
        {/* Game Badge */}
        <div className="p-4 border-b border-gt-border bg-[#0D131F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm border-2 border-gt-cyan flex items-center justify-center font-orbitron font-black text-gt-cyan text-xs cyber-cut-sm shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              {selectedGame}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-orbitron font-bold text-xs truncate text-white uppercase tracking-wider">
                {GAMES.find((g) => g.id === selectedGame)?.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gt-green animate-pulse shadow-[0_0_6px_#00FF66]"></span>
                <span className="font-mono text-[10px] text-gt-text-dim uppercase tracking-wider">
                  {GAMES.find((g) => g.id === selectedGame)?.count}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Discord Channels */}
        <div className="p-3 overflow-y-auto flex-1 space-y-5">
          <div>
            <div className="px-2 mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-gt-text-dim uppercase tracking-widest font-bold">
                — RANKED
              </span>
              <span className="w-1 h-1 bg-gt-cyan rounded-full"></span>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedChannel('ranked-solo-duo')}
                className={`w-full text-left px-3 py-2 font-mono text-xs flex justify-between items-center transition-all cyber-cut-sm cursor-pointer ${
                  selectedChannel === 'ranked-solo-duo'
                    ? 'bg-gt-cyan/15 border-l-2 border-gt-cyan text-gt-cyan font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-gt-text-dim hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Hash size={13} className="text-gt-cyan/60" />
                  ranked-solo-duo
                </span>
                <span className="text-[10px] opacity-75 font-orbitron">(667)</span>
              </button>

              <button
                onClick={() => setSelectedChannel('flex-queue')}
                className={`w-full text-left px-3 py-2 font-mono text-xs flex justify-between items-center transition-all cyber-cut-sm cursor-pointer ${
                  selectedChannel === 'flex-queue'
                    ? 'bg-gt-cyan/15 border-l-2 border-gt-cyan text-gt-cyan font-bold'
                    : 'text-gt-text-dim hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Hash size={13} className="text-gt-text-dim/60" />
                  flex-queue
                </span>
                <span className="text-[10px] opacity-75 font-orbitron">(222)</span>
              </button>
            </div>
          </div>

          <div>
            <div className="px-2 mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-gt-text-dim uppercase tracking-widest font-bold">
                — CASUAL
              </span>
              <span className="w-1 h-1 bg-gt-yellow rounded-full"></span>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedChannel('aram')}
                className={`w-full text-left px-3 py-2 font-mono text-xs flex justify-between items-center transition-all cyber-cut-sm cursor-pointer ${
                  selectedChannel === 'aram'
                    ? 'bg-gt-yellow/15 border-l-2 border-gt-yellow text-gt-yellow font-bold'
                    : 'text-gt-text-dim hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Hash size={13} className="text-gt-yellow/60" />
                  aram
                </span>
                <span className="text-[10px] opacity-75 font-orbitron">(174)</span>
              </button>

              <button
                onClick={() => setSelectedChannel('normals')}
                className={`w-full text-left px-3 py-2 font-mono text-xs flex justify-between items-center transition-all cyber-cut-sm cursor-pointer ${
                  selectedChannel === 'normals'
                    ? 'bg-gt-yellow/15 border-l-2 border-gt-yellow text-gt-yellow font-bold'
                    : 'text-gt-text-dim hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Hash size={13} className="text-gt-text-dim/60" />
                  normals
                </span>
                <span className="text-[10px] opacity-75 font-orbitron">(40)</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Game Switcher Tabs */}
        <div className="p-3 border-t border-gt-border bg-[#080B12] flex gap-2 overflow-x-auto">
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setSelectedGame(g.id);
                const ranks = GAME_RANKS_MAP[g.id] || GAME_RANKS_MAP.LoL;
                setSelectedRank(ranks[Math.min(5, ranks.length - 1)]);
              }}
              className={`w-9 h-9 rounded-sm border flex items-center justify-center font-orbitron font-extrabold text-[10px] transition-all cyber-cut-sm cursor-pointer ${
                selectedGame === g.id
                  ? `${g.color} bg-white/10 scale-105 shadow-[0_0_10px_rgba(0,240,255,0.4)]`
                  : 'border-gt-border text-gt-text-dim hover:border-gt-text hover:text-white'
              }`}
            >
              {g.id}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-gt-bg overflow-y-auto">
        <header className="h-16 border-b border-gt-border/80 flex items-center justify-between px-6 sm:px-8 flex-shrink-0 bg-[#080D15]/90 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-gt-cyan text-xl font-mono">#</span>
            <h1 className="font-orbitron text-base sm:text-lg uppercase text-white font-extrabold tracking-wider">
              {selectedChannel}
            </h1>
            <div className="h-4 w-px bg-gt-border"></div>
            <span className="text-xs text-gt-text-dim font-mono hidden sm:inline">
              Lobby Matching Engine
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio waveform */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-[#101724] border border-gt-border rounded-sm">
              <Volume2 size={13} className="text-gt-cyan mr-1" />
              <span className="w-1 bg-gt-cyan animate-eq-1 rounded-full"></span>
              <span className="w-1 bg-gt-cyan animate-eq-2 rounded-full"></span>
              <span className="w-1 bg-gt-cyan animate-eq-3 rounded-full"></span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-gt-green/10 border border-gt-green/30 rounded-sm">
              <span className="w-2 h-2 rounded-full bg-gt-green animate-ping shadow-[0_0_6px_#00FF66]"></span>
              <span className="font-mono text-xs text-gt-green font-bold tracking-wider uppercase">147 QUEUED</span>
            </div>
          </div>
        </header>

        {/* Form Body */}
        <div className="flex-1 py-10 px-6 sm:px-12 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            
            {/* Left: MY PROFILE */}
            <div className="space-y-7 bg-[#0D121B] border border-gt-border p-6 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.3)]">
              <div className="border-b border-gt-border pb-3 flex items-center justify-between">
                <h2 className="font-orbitron text-sm text-gt-cyan font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gt-cyan"></span>
                  MY PROFILE
                </h2>
                <span className="font-mono text-[10px] text-gt-text-dim uppercase">STEP 01</span>
              </div>

              {/* I PLAY AS */}
              <div className="space-y-2.5">
                <label className="block font-mono text-xs text-gt-text-dim uppercase tracking-wider font-semibold">
                  I Play As (Primary Role)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {MY_ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`py-2 px-1 font-mono text-xs uppercase transition-all border cyber-cut-sm text-center cursor-pointer ${
                        selectedRole === role
                          ? 'bg-gt-cyan text-black border-gt-cyan font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)] scale-105'
                          : 'bg-[#080B12] text-gt-text-dim border-gt-border hover:border-gt-cyan/50 hover:text-white'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* MY RANK */}
              <div className="space-y-2.5">
                <label className="block font-mono text-xs text-gt-text-dim uppercase tracking-wider font-semibold">
                  My Current Rank
                </label>
                <div className="relative">
                  <select
                    value={selectedRank}
                    onChange={(e) => setSelectedRank(e.target.value)}
                    className="w-full bg-[#080B12] border border-gt-border hover:border-gt-cyan text-white font-orbitron text-xs tracking-wider px-4 py-3 appearance-none focus:outline-none focus:border-gt-cyan transition-colors cyber-cut-sm cursor-pointer"
                  >
                    {(GAME_RANKS_MAP[selectedGame] || GAME_RANKS_MAP.LoL).map((rank) => (
                      <option key={rank} value={rank} className="bg-[#0B0F17]">
                        {rank}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gt-cyan" />
                </div>
              </div>

              {/* REGION */}
              <div className="space-y-2.5">
                <label className="block font-mono text-xs text-gt-text-dim uppercase tracking-wider font-semibold">
                  Server Region
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {REGIONS.map((region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`py-2 px-1 font-mono text-xs uppercase transition-all border cyber-cut-sm text-center cursor-pointer ${
                        selectedRegion === region
                          ? 'bg-gt-cyan text-black border-gt-cyan font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)] scale-105'
                          : 'bg-[#080B12] text-gt-text-dim border-gt-border hover:border-gt-cyan/50 hover:text-white'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: SQUAD REQUIREMENTS */}
            <div className="space-y-7 bg-[#0D121B] border border-gt-border p-6 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.3)]">
              <div className="border-b border-gt-border pb-3 flex items-center justify-between">
                <h2 className="font-orbitron text-sm text-gt-yellow font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gt-yellow"></span>
                  SQUAD REQUIREMENTS
                </h2>
                <span className="font-mono text-[10px] text-gt-text-dim uppercase">STEP 02</span>
              </div>

              {/* ROLES NEEDED */}
              <div className="space-y-2.5">
                <label className="block font-mono text-xs text-gt-text-dim uppercase tracking-wider font-semibold">
                  Roles Needed in Lobby
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {SQUAD_ROLES.map((role) => {
                    const isActive = neededRoles.includes(role);
                    return (
                      <button
                        key={role}
                        onClick={() => toggleNeededRole(role)}
                        className={`py-2 px-1 font-mono text-xs uppercase transition-all border cyber-cut-sm text-center cursor-pointer ${
                          isActive
                            ? 'bg-gt-yellow text-black border-gt-yellow font-bold shadow-[0_0_12px_rgba(255,215,0,0.4)] scale-105'
                            : 'bg-[#080B12] text-gt-text-dim border-gt-border hover:border-gt-yellow/50 hover:text-white'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COMMS */}
              <div className="space-y-2.5">
                <label className="block font-mono text-xs text-gt-text-dim uppercase tracking-wider font-semibold">
                  Voice Communications
                </label>
                <div>
                  <button
                    onClick={() => setMicRequired(!micRequired)}
                    className={`inline-flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase border cyber-cut-sm transition-all cursor-pointer ${
                      micRequired
                        ? 'bg-gt-cyan/20 border-gt-cyan text-gt-cyan font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                        : 'bg-[#080B12] border-gt-border text-gt-text-dim'
                    }`}
                  >
                    <Mic size={14} />
                    <span>MIC REQUIRED</span>
                    {micRequired && <Check size={14} className="text-gt-cyan" />}
                  </button>
                </div>
              </div>

              {/* MATCH CRITERIA PREVIEW */}
              <div className="space-y-2.5 pt-1">
                <label className="block font-mono text-xs text-gt-text-dim uppercase tracking-wider font-semibold">
                  Live Queue Criteria Preview
                </label>
                <div className="bg-[#080C14] border border-gt-border/80 p-4 rounded-sm cyber-cut-sm">
                  <div className="font-orbitron text-xs sm:text-sm text-gt-green font-bold uppercase mb-2 flex items-center gap-2">
                    <Zap size={14} />
                    <span>{selectedRole} → {neededRoles.join(', ')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-gt-text-dim">
                    <span className="px-2 py-0.5 bg-[#121A28] border border-gt-border rounded-sm text-white">
                      {selectedRank}
                    </span>
                    <span className="px-2 py-0.5 bg-[#121A28] border border-gt-border rounded-sm text-gt-yellow">
                      {selectedRegion}
                    </span>
                    <span className="px-2 py-0.5 bg-[#121A28] border border-gt-border rounded-sm text-gt-cyan flex items-center gap-1">
                      MIC {micRequired ? '✓' : 'Optional'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="max-w-md mx-auto text-center space-y-4">
            <button
              onClick={handleMatchmake}
              disabled={isSearching}
              className="w-full bg-gradient-to-r from-gt-cyan to-blue-400 hover:from-white hover:to-gt-cyan text-black font-orbitron text-sm sm:text-base uppercase py-4 px-10 rounded-sm shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_35px_rgba(0,240,255,0.9)] transition-all duration-300 font-black tracking-widest cyber-cut shimmer-effect flex items-center justify-center gap-3 active:scale-95 disabled:opacity-75 cursor-pointer"
            >
              <Zap size={18} className="text-black" />
              <span>FIND SQUAD NOW</span>
            </button>

            {matchResult && (
              <div className="p-5 bg-gradient-to-r from-gt-green/15 to-[#0E1B15] border border-gt-green text-gt-green rounded-sm font-mono text-xs flex flex-col items-center gap-3 animate-fadeIn shadow-[0_0_25px_rgba(0,255,102,0.25)]">
                <div className="flex items-center gap-2 font-bold font-orbitron text-sm text-white">
                  <UserCheck size={18} className="text-gt-green" />
                  <span>SQUAD FOUND! ({matchResult.matchedCount}/{matchResult.maxPlayers} READY)</span>
                </div>
                <p className="text-gt-text-dim text-[11px]">
                  Room [{matchResult.lobbyId}] created. Auto-joining Discord voice channel...
                </p>
                <button
                  onClick={resetMatchmaking}
                  className="px-4 py-1.5 border border-gt-green text-gt-green hover:bg-gt-green hover:text-black font-orbitron text-[10px] uppercase tracking-wider transition-colors"
                >
                  Match Again
                </button>
              </div>
            )}
            {error && (
              <div role="alert" className="p-3 border border-gt-red/60 bg-gt-red/10 text-gt-red font-mono text-xs">
                {error}. Sign in before starting protected matchmaking.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
