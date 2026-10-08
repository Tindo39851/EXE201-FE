'use client';

import React, { useState } from 'react';
import { X, Mic, Users, Shield } from 'lucide-react';
import type { CreateRoomDto, RoomTag, RoomVisibility, VoiceRoom } from '../types/voice.types';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateRoomDto) => Promise<VoiceRoom>;
}

export const AVAILABLE_GAMES = [
  { id: 'league-of-legends', name: 'Liên Minh Huyền Thoại (LoL)' },
  { id: 'valorant', name: 'VALORANT' },
  { id: 'lien-quan', name: 'Liên Quân Mobile' },
  { id: 'free-fire', name: 'Free Fire' },
];

export const GAME_RANK_DATA: Record<string, { ranks: string[]; playstyles: string[] }> = {
  'league-of-legends': {
    ranks: [
      'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger'
    ],
    playstyles: ['Casual', 'Leo Rank (Climbing)', 'Rank Tryhard', 'Clan Internal'],
  },
  'valorant': {
    ranks: [
      'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'
    ],
    playstyles: ['Casual', 'Leo Rank (Climbing)', 'Rank Tryhard', 'Clan Internal'],
  },
  'lien-quan': {
    ranks: [
      'Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Tinh Anh', 'Cao Thủ', 'Đại Cao Thủ', 'Chiến Tướng', 'Chiến Thần', 'Thách Đấu'
    ],
    playstyles: ['Đấu thường', 'Leo Rank', 'Rank Tryhard', 'Clan Internal'],
  },
  'free-fire': {
    ranks: [
      'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Heroic', 'Elite Heroic', 'Master', 'Elite Master', 'Grandmaster'
    ],
    playstyles: ['Đấu thường', 'Tử Chiến (CS)', 'Sinh Tồn (BR)', 'Booyah Tryhard', 'Clan Internal'],
  },
};

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('valorant');
  const [rank, setRank] = useState('Diamond');
  const [playstyle, setPlaystyle] = useState('Leo Rank (Climbing)');
  const [capacity, setCapacity] = useState(5);
  const [visibility, setVisibility] = useState<RoomVisibility>('Public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentRankData = GAME_RANK_DATA[gameId] || GAME_RANK_DATA['valorant'];

  const handleGameChange = (newGameId: string) => {
    setGameId(newGameId);
    const targetData = GAME_RANK_DATA[newGameId] || GAME_RANK_DATA['valorant'];
    // Default to a popular mid-high rank for that game
    setRank(targetData.ranks[5] || targetData.ranks[0]);
    setPlaystyle(targetData.playstyles[1] || targetData.playstyles[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        gameId,
        tag: rank !== 'Tất cả rank' ? rank : playstyle,
        rankRequirement: rank,
        playMode: playstyle,
        capacity,
        visibility,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0B0F17] border border-gt-cyan/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gt-cyan/10 border border-gt-cyan/30 text-gt-cyan">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-lg text-white tracking-wide">
                CREATE VOICE LOUNGE
              </h2>
              <p className="text-xs font-mono text-gray-400">
                Setup room parameters and invite operatives (4 Supported Games)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Room Name */}
          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
              Room Name
            </label>
            <input
              type="text"
              required
              maxLength={50}
              placeholder="e.g. Leo rank tryhard, mic tốt 🎙️"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#121824] border border-gray-800 focus:border-gt-cyan rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 font-rajdhani font-semibold outline-none transition-colors"
            />
          </div>

          {/* Game Selection */}
          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
              Game Discipline
            </label>
            <select
              value={gameId}
              onChange={e => handleGameChange(e.target.value)}
              className="w-full bg-[#121824] border border-gray-800 focus:border-gt-cyan rounded-lg px-3 py-2.5 text-xs text-white font-mono outline-none"
            >
              {AVAILABLE_GAMES.map(g => (
                <option key={g.id} value={g.id} className="bg-[#0B0F17]">
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2 Separate Fields: Bậc Rank & Chế độ / Mục tiêu */}
          <div className="grid grid-cols-2 gap-4">
            {/* Field 1: Bậc Rank */}
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                Bậc Rank (Rank Tier)
              </label>
              <select
                value={rank}
                onChange={e => setRank(e.target.value)}
                className="w-full bg-[#121824] border border-gray-800 focus:border-gt-cyan rounded-lg px-3 py-2.5 text-xs text-white font-mono outline-none"
              >
                <option value="Tất cả rank" className="bg-[#0B0F17]">
                  Tất cả rank (All Ranks)
                </option>
                {currentRankData.ranks.map(r => (
                  <option key={r} value={r} className="bg-[#0B0F17]">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 2: Chế độ & Mục tiêu */}
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                Chế độ & Mục tiêu (Play Mode)
              </label>
              <select
                value={playstyle}
                onChange={e => setPlaystyle(e.target.value)}
                className="w-full bg-[#121824] border border-gray-800 focus:border-gt-cyan rounded-lg px-3 py-2.5 text-xs text-white font-mono outline-none"
              >
                {currentRankData.playstyles.map(p => (
                  <option key={p} value={p} className="bg-[#0B0F17]">
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Capacity Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gt-cyan" />
                <span>Squad Capacity: {capacity} Players</span>
              </label>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              value={capacity}
              onChange={e => setCapacity(Number(e.target.value))}
              className="w-full accent-gt-cyan cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
              <span>Duo (2)</span>
              <span>Squad (5)</span>
              <span>Raid (12)</span>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Visibility Access</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Public', 'Clan Only', 'Rank Tryhard'] as RoomVisibility[]).map(v => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setVisibility(v)}
                  className={`px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border transition-colors ${
                    visibility === v
                      ? 'bg-gt-cyan/15 border-gt-cyan text-gt-cyan font-bold'
                      : 'bg-[#121824] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-mono text-xs text-gray-400 hover:text-white transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gt-cyan text-gt-bg hover:bg-[#33f3ff] px-6 py-2.5 rounded-lg font-orbitron font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] disabled:opacity-50"
            >
              {isSubmitting ? 'CREATING...' : 'LAUNCH ROOM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
