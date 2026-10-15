'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Lock,
  Crown,
  ShieldCheck,
  Zap,
  Users,
  Radio,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { apiClient } from '@/services/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { PremiumModal } from '@/components/ui/PremiumModal';

interface AiRecommendation {
  id: string;
  realRoomId?: string;
  roomName: string;
  game: string;
  rankTarget: string;
  fairPlayScore: number;
  completionRate: number;
  retentionScore: number;
  antiFraudVerified: boolean;
  slotsAvailable: string;
  voiceStatus: string;
  aiReason: string;
}

interface AiResponseData {
  isPremium: boolean;
  unlocked: boolean;
  game: string;
  message?: string;
  features?: string[];
  aiEngine?: string;
  analyzedRoomsCount?: number;
  emptyMessage?: string;
  recommendations?: AiRecommendation[];
}

interface AiSquadRecommendationsProps {
  activeGame: string;
}

export const AiSquadRecommendations: React.FC<AiSquadRecommendationsProps> = ({
  activeGame,
}) => {
  const { user } = useAuth();
  const [data, setData] = useState<AiResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [premiumModalOpen, setPremiumModalOpen] = useState<boolean>(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<AiResponseData>(
        `/squads/ai-recommendations?game=${encodeURIComponent(activeGame)}`
      );
      setData(res.data);
    } catch {
      // In case of error or unauthenticated, mock locked state
      setData({
        isPremium: false,
        unlocked: false,
        game: activeGame,
        message: 'Tính năng AI Room Recommendation chỉ dành riêng cho tài khoản GameTrust Premium.',
        features: [
          'Đánh giá chất lượng phòng dựa trên tỉ lệ hoàn thành trận (>98%)',
          'Phát hiện hành vi gian lận (tạo acc ảo, tự vote, vote chéo)',
          'Bộ lọc đồng đội theo phong cách chơi, rank, server, vai trò và ngôn ngữ',
          'Ưu tiên kết nối phòng voice SFU HD với ping thấp nhất',
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGame, user]);

  const isUnlocked = Boolean(data?.unlocked || user?.isPremium);

  return (
    <>
      <PremiumModal
        isOpen={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        onSuccess={() => fetchRecommendations()}
      />

      <div className="w-full relative bg-gradient-to-b from-[#0B0F19] to-[#07090E] border border-gt-border/80 rounded-sm p-5 sm:p-6 mb-8 overflow-hidden cyber-cut">
        {/* Top Gold/Cyan Accent Line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
          isUnlocked
            ? 'from-yellow-400 via-amber-300 to-yellow-500 shadow-[0_0_12px_#FACC15]'
            : 'from-gt-cyan/60 via-yellow-400 to-gt-magenta/60'
        }`}></div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gt-border/60">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-yellow-400 font-bold flex items-center gap-1">
                <Bot size={13} /> AI_NEURAL_ENGINE // ROOM_RECOMMENDATION
              </span>
              <span className="px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-[10px] font-bold">
                {isUnlocked ? 'PREMIUM UNLOCKED' : 'PREMIUM ONLY'}
              </span>
            </div>
            <h3 className="font-orbitron text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>AI SMART SQUAD RECOMMENDATION</span>
              <Sparkles size={18} className="text-yellow-400 animate-pulse" />
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {isUnlocked ? (
              <span className="font-mono text-xs text-yellow-400 flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 border border-yellow-400/40 rounded-sm">
                <Crown size={14} /> TÀI KHOẢN PREMIUM ACTIVE
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setPremiumModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-black font-orbitron font-extrabold text-xs uppercase tracking-wider rounded-sm cyber-cut-sm transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.4)] flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Crown size={14} />
                <span>NÂNG CẤP PREMIUM (49K/THÁNG)</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-yellow-400 flex items-center justify-center gap-2">
            <RefreshCw size={14} className="animate-spin" />
            <span>AI ĐANG QUÉT VÀ ĐÁNH GIÁ CHẤT LƯỢNG CÁC PHÒNG CHƠI...</span>
          </div>
        ) : isUnlocked && data?.recommendations && data.recommendations.length > 0 ? (
          /* PREMIUM UNLOCKED: REAL AI RECOMMENDATIONS */
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-mono text-gt-text-dim">
              <span>ĐÃ PHÂN TÍCH {data.analyzedRoomsCount || 42} PHÒNG HOẠT ĐỘNG • LỌC THEO FAIR-PLAY &amp; CHỐNG TROLL</span>
              <span className="text-yellow-400 flex items-center gap-1">
                <CheckCircle2 size={13} /> {data.aiEngine || 'GameTrust Neural Matcher v2.1'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="relative bg-[#0E1422] border-2 border-yellow-400/60 hover:border-yellow-400 rounded-sm p-4 flex flex-col justify-between gap-3 transition-all duration-300 hover:-translate-y-1 shadow-[0_0_15px_rgba(250,204,21,0.15)] hover:shadow-[0_0_25px_rgba(250,204,21,0.35)] group"
                >
                  <div className="flex flex-col gap-2">
                    {/* Fair Play & Anti-Fraud Badges */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-yellow-400/15 border border-yellow-400/50 text-yellow-300 font-mono text-[10px] font-bold flex items-center gap-1">
                        <Sparkles size={10} /> {rec.fairPlayScore}% FAIR PLAY
                      </span>
                      <span className="font-mono text-[10px] text-gt-cyan flex items-center gap-1 bg-gt-cyan/10 px-2 py-0.5 rounded-full border border-gt-cyan/30">
                        <ShieldCheck size={11} /> ANTI-FRAUD
                      </span>
                    </div>

                    {/* Room Name & Game */}
                    <div className="flex flex-col">
                      <h4 className="font-orbitron text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {rec.roomName}
                      </h4>
                      <span className="font-mono text-[11px] text-gt-text-dim">
                        Mục tiêu: <span className="text-white font-semibold">{rec.rankTarget}</span>
                      </span>
                    </div>

                    {/* AI Reasoning Box */}
                    <div className="p-2.5 bg-[#090D15] border border-yellow-400/20 rounded-sm text-xs font-rajdhani text-yellow-200/90 flex items-start gap-2">
                      <Bot size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{rec.aiReason}</span>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-gt-text-dim pt-1 border-t border-gt-border/40">
                      <div>Hoàn thành: <span className="text-gt-green font-bold">{rec.completionRate}%</span></div>
                      <div>Giữ chân: <span className="text-gt-cyan font-bold">{rec.retentionScore}%</span></div>
                      <div>Chỗ trống: <span className="text-white font-bold">{rec.slotsAvailable}</span></div>
                      <div>Voice: <span className="text-yellow-400 font-bold">{rec.voiceStatus.split(' ')[0]}</span></div>
                    </div>
                  </div>

                  {/* Join Action */}
                  <Link
                    href={`/voice-lounges?joinRoom=${rec.realRoomId || rec.id || 'room-val-1'}`}
                    className="w-full py-2 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-black font-orbitron font-extrabold text-xs uppercase tracking-wider rounded-sm cyber-cut-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Radio size={13} />
                    <span>VÀO PHÒNG VOICE NGAY</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : isUnlocked ? (
          /* PREMIUM UNLOCKED BUT NO ROOMS YET */
          <div className="mt-6 p-8 border border-dashed border-yellow-400/40 rounded-sm bg-[#0E1422] text-center flex flex-col items-center justify-center gap-3">
            <Bot size={36} className="text-yellow-400 animate-pulse" />
            <h4 className="font-orbitron text-sm font-bold text-white uppercase">
              {data?.emptyMessage || `CHƯA CÓ PHÒNG VOICE NÀO CHO GAME ${activeGame}`}
            </h4>
            <p className="text-xs text-white/50 max-w-md">
              AI đã quét {data?.analyzedRoomsCount || 0} phòng. Hãy tạo phòng Voice đầu tiên để hệ thống đánh giá và đề xuất cho cộng đồng!
            </p>
            <Link
              href="/voice-lounges"
              className="mt-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-orbitron font-bold text-xs uppercase tracking-wider rounded-sm cyber-cut-sm shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:scale-105 transition-all"
            >
              TẠO PHÒNG VOICE NGAY
            </Link>
          </div>
        ) : (
          /* FREE USER LOCKED VIEW */
          <div className="mt-6 relative">
            {/* Blurred Mock Cards in background */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 filter blur-[3px] opacity-35 select-none pointer-events-none">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="bg-[#0E1422] border border-gt-border p-4 rounded-sm flex flex-col gap-3">
                  <div className="h-4 bg-yellow-400/20 rounded w-1/2"></div>
                  <div className="h-6 bg-white/20 rounded w-3/4"></div>
                  <div className="h-12 bg-gt-bg-card rounded"></div>
                  <div className="h-8 bg-yellow-400/40 rounded"></div>
                </div>
              ))}
            </div>

            {/* Floating Unlock Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/60 backdrop-blur-sm rounded-sm">
              <div className="p-3 bg-yellow-400/10 border border-yellow-400/40 rounded-full mb-3 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                <Lock size={26} className="text-yellow-400" />
              </div>

              <h4 className="font-orbitron text-lg sm:text-xl font-black text-white uppercase tracking-wider text-glow-yellow mb-1">
                TÍNH NĂNG AI ĐỘC QUYỀN DÀNH CHO HỘI VIÊN PREMIUM
              </h4>

              <p className="font-rajdhani text-xs sm:text-sm text-gt-text-dim max-w-lg mb-4">
                Thuật toán AI tự động phân tích độ uy tín, tỉ lệ hoàn thành trận &gt; 98%, phát hiện gian lận (tạo acc ảo, tự vote, vote chéo) và đề xuất phòng chuẩn Rank, Role &amp; Server.
              </p>

              <button
                type="button"
                onClick={() => setPremiumModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-black font-orbitron font-black text-xs sm:text-sm uppercase tracking-wider rounded-sm cyber-cut transition-all duration-300 shadow-[0_0_25px_rgba(250,204,21,0.5)] hover:shadow-[0_0_35px_rgba(250,204,21,0.8)] flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Crown size={16} />
                <span>NÂNG CẤP PREMIUM (49.000 đ/tháng) ĐỂ MỞ KHÓA</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
