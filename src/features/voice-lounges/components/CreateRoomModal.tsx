'use client';

import React, { useState } from 'react';
import { X, Mic, Users, Shield } from 'lucide-react';
import type { CreateRoomDto, RoomTag, RoomVisibility, VoiceRoom } from '../types/voice.types';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateRoomDto) => Promise<VoiceRoom>;
}

const AVAILABLE_GAMES = [
  { id: 'league-of-legends', name: 'League of Legends' },
  { id: 'free-fire', name: 'Free Fire' },
  { id: 'lien-quan', name: 'Liên Quân' },
  { id: 'valorant', name: 'Valorant' },
];

const AVAILABLE_TAGS: RoomTag[] = [
  'Diamond Rank',
  'Casual',
  'Climbing',
  'Clan Internal',
  'Rank Tryhard',
  'Heroic Ranked',
];

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('league-of-legends');
  const [tag, setTag] = useState<RoomTag>('Diamond Rank');
  const [capacity, setCapacity] = useState(5);
  const [visibility, setVisibility] = useState<RoomVisibility>('Public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        gameId,
        tag,
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
                Setup room parameters and invite operatives
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
              placeholder="e.g. Late night ranked grind 🌙"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#121824] border border-gray-800 focus:border-gt-cyan rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 font-rajdhani font-semibold outline-none transition-colors"
            />
          </div>

          {/* Game Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                Game Discipline
              </label>
              <select
                value={gameId}
                onChange={e => setGameId(e.target.value)}
                className="w-full bg-[#121824] border border-gray-800 focus:border-gt-cyan rounded-lg px-3 py-2.5 text-xs text-white font-mono outline-none"
              >
                {AVAILABLE_GAMES.map(g => (
                  <option key={g.id} value={g.id} className="bg-[#0B0F17]">
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Selection */}
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                Room Tag
              </label>
              <select
                value={tag}
                onChange={e => setTag(e.target.value as RoomTag)}
                className="w-full bg-[#121824] border border-gray-800 focus:border-gt-cyan rounded-lg px-3 py-2.5 text-xs text-white font-mono outline-none"
              >
                {AVAILABLE_TAGS.map(t => (
                  <option key={t} value={t} className="bg-[#0B0F17]">
                    {t}
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
