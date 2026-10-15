'use client';

import React, { useState, useEffect } from 'react';
import { X, UserCheck, Mic, Shield, Sparkles, Check, Loader2, Gamepad2, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { squadService } from '../services/squad.service';
import type { PlayerProfile } from '../types/squad.types';

interface MySquadProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileSaved?: () => void;
}

const AVAILABLE_GAMES = [
  'Valorant',
  'League of Legends',
  'Liên Quân',
  'Free Fire',
];

const GAME_ROLES: Record<string, string[]> = {
  Valorant: ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'IGL', 'Flex'],
  'League of Legends': ['Top', 'Jungle', 'Mid', 'ADC', 'Support', 'Flex'],
  'Liên Quân': ['Đường Rừng', 'Đường Giữa', 'Xạ Thủ', 'Trợ Thủ', 'Đường Tà Thần', 'Flex'],
  'Free Fire': ['Rusher', 'Sniper', 'Support', 'IGL', 'Flex'],
};

export const MySquadProfileModal: React.FC<MySquadProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileSaved,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [game, setGame] = useState('Valorant');
  const [rank, setRank] = useState('Kim Cương II');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Duelist']);
  const [region, setRegion] = useState('VN');
  const [micAvailable, setMicAvailable] = useState(true);
  const [bio, setBio] = useState('Tìm đồng đội tryhard leo rank, giao tiếp mic văn minh!');
  const [lookingForSquad, setLookingForSquad] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      squadService.getMyProfile()
        .then((profile: PlayerProfile) => {
          if (profile) {
            if (profile.game) setGame(profile.game);
            if (profile.rank) setRank(profile.rank);
            if (profile.roles && profile.roles.length > 0) setSelectedRoles(profile.roles);
            if (profile.timezone) setRegion(profile.timezone);
            if (profile.micAvailable !== undefined) setMicAvailable(profile.micAvailable);
            if (profile.description) setBio(profile.description);
            if (profile.status) setLookingForSquad(profile.status === 'LFG');
          }
        })
        .catch(() => {
          // Default values are already set
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const currentRoleOptions = GAME_ROLES[game] || GAME_ROLES['Valorant'];

  const toggleRole = (r: string) => {
    if (selectedRoles.includes(r)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter((item) => item !== r));
      }
    } else {
      setSelectedRoles([...selectedRoles, r]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Vui lòng đăng nhập để lưu hồ sơ.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await squadService.updateMyProfile({
        game,
        rank,
        roles: selectedRoles,
        region,
        micAvailable,
        bio,
        lookingForSquad,
      });

      setSuccessMsg('Hồ sơ Squad đã được cập nhật thành công!');
      setTimeout(() => {
        if (onProfileSaved) onProfileSaved();
        onClose();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi cập nhật hồ sơ';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-gt-card border border-gt-cyan/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-gt-cyan/20 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gt-cyan/10 border border-gt-cyan/40 flex items-center justify-center text-gt-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2 font-orbitron">
                HỒ SƠ SQUAD CỦA BẠN
                {user?.isPremium && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    👑 VIP
                  </span>
                )}
              </h3>
              <p className="text-xs text-white/50">
                Hiển thị trên Squad Finder để đồng đội tìm thấy và gửi lời mời
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-white/60">
              <Loader2 className="w-8 h-8 animate-spin text-gt-cyan" />
              <p className="text-sm">Đang tải thông tin hồ sơ...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              {/* Game selection */}
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-gt-cyan" /> Tựa Game Chuyên Nghiệp
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVAILABLE_GAMES.map((g) => {
                    const isSelected = game.toLowerCase() === g.toLowerCase();
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setGame(g);
                          const newRoles = GAME_ROLES[g] || ['Flex'];
                          setSelectedRoles([newRoles[0]]);
                        }}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isSelected
                            ? 'bg-gt-cyan/20 border-gt-cyan text-white shadow-[0_0_15px_rgba(0,240,255,0.25)] font-bold'
                            : 'bg-black/30 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rank & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" /> Bậc Xếp Hạng (Rank)
                  </label>
                  <input
                    type="text"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="VD: Kim Cương, Immortal, Thách Đấu..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-gt-cyan transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gt-magenta" /> Khu Vực / Server
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-gt-cyan transition-colors"
                  >
                    <option value="VN">Việt Nam (VN)</option>
                    <option value="SEA">Đông Nam Á (SEA)</option>
                    <option value="APAC">Châu Á Thái Bình Dương (APAC)</option>
                  </select>
                </div>
              </div>

              {/* Roles Chips */}
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
                  Vai Trò Ưa Thích (Chọn 1 hoặc nhiều)
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentRoleOptions.map((r) => {
                    const isSelected = selectedRoles.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => toggleRole(r)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-gt-magenta/20 border-gt-magenta text-gt-magenta font-bold shadow-[0_0_10px_rgba(255,0,128,0.2)]'
                            : 'bg-black/30 border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles: Mic & Looking for Squad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10 cursor-pointer hover:border-white/20 transition-colors">
                  <input
                    type="checkbox"
                    checked={micAvailable}
                    onChange={(e) => setMicAvailable(e.target.checked)}
                    className="rounded text-gt-cyan focus:ring-0 bg-black/40 border-white/20 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Sẵn Sàng Dùng Mic</div>
                      <div className="text-[10px] text-white/50">Giao tiếp voice khi vào trận</div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10 cursor-pointer hover:border-white/20 transition-colors">
                  <input
                    type="checkbox"
                    checked={lookingForSquad}
                    onChange={(e) => setLookingForSquad(e.target.checked)}
                    className="rounded text-gt-cyan focus:ring-0 bg-black/40 border-white/20 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Trạng Thái Tìm Đội (LFG)</div>
                    <div className="text-[10px] text-white/50">Bật để xuất hiện trên Radar tìm đồng đội</div>
                  </div>
                </label>
              </div>

              {/* Bio description */}
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
                  Lời Giới Thiệu / Phong Cách Bắn
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={160}
                  placeholder="Mô tả phong cách chơi, giờ giấc online..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-gt-cyan transition-colors resize-none"
                />
                <div className="text-right text-[10px] text-white/40 mt-1">{bio.length}/160 ký tự</div>
              </div>

              {/* Messages */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" /> {successMsg}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-sm font-semibold transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-gt-cyan to-blue-600 hover:from-gt-cyan/90 hover:to-blue-500 text-black font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-orbitron"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang Lưu...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black" /> LƯU HỒ SƠ SQUAD
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
