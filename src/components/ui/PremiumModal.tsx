'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Crown, Sparkles, ShieldCheck, Zap, Bot, ArrowRight, Wallet, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient, getApiErrorMessage } from '@/services/api-client';
import { walletService } from '@/features/wallet/services/wallet.service';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timeout = window.setTimeout(() => {
      setIsSuccess(false);
      setErrorMsg(null);
      void walletService.getBalance()
        .then(setWalletBalance)
        .catch((error) => setErrorMsg(getApiErrorMessage(error, 'Không thể tải số dư ví.')));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  if (!isOpen) return null;

  const PRICE_VND = 49000;
  const hasEnoughBalance = walletBalance >= PRICE_VND;

  const handleSubscribe = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await apiClient.post('/payment/subscribe-premium');
      setIsSuccess(true);

      // Trigger global updates
      if (typeof window !== 'undefined') {
        const newBal = walletBalance - PRICE_VND;
        setWalletBalance(newBal);
        window.dispatchEvent(new CustomEvent('wallet:balance-updated', { detail: newBal }));
        window.dispatchEvent(new CustomEvent('user:premium-updated', { detail: res.data }));
      }

      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) onSuccess();
        onClose();
        // Reload to update state smoothly
        window.location.reload();
      }, 1600);
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, 'Nâng cấp gói Premium không thành công. Vui lòng kiểm tra lại số dư ví!'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-lg bg-[#0A0D15] border-2 border-yellow-400 p-6 sm:p-8 rounded-sm cyber-cut shadow-[0_0_50px_rgba(250,204,21,0.35)] flex flex-col gap-6">
        {/* Top Gold Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-500 shadow-[0_0_12px_#FACC15]"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gt-text-dim hover:text-yellow-400 p-1 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 pt-2">
          <div className="relative p-3 rounded-full bg-yellow-400/10 border border-yellow-400/40 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
            <Crown size={32} className="text-yellow-400 animate-pulse" />
            <Sparkles size={16} className="absolute -top-1 -right-1 text-amber-300" />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-yellow-400 font-bold">
            GAMETRUST OPERATIVE MEMBERSHIP
          </span>
          <h2 className="font-orbitron text-2xl sm:text-3xl font-black text-white uppercase tracking-wider text-glow-yellow">
            NÂNG CẤP PREMIUM
          </h2>
          <p className="font-rajdhani text-sm text-gt-text-dim max-w-sm">
            Mở khóa toàn bộ sức mạnh AI Room Recommendation, thuật toán chống toxic và nhận diện Gold VIP độc quyền.
          </p>
        </div>

        {/* Success Banner */}
        {isSuccess ? (
          <div className="p-6 bg-yellow-400/10 border border-yellow-400/80 rounded-sm text-center flex flex-col items-center gap-3 animate-fadeIn">
            <Crown size={40} className="text-yellow-400 animate-bounce" />
            <h3 className="font-orbitron text-lg font-bold text-yellow-400 uppercase tracking-wider">
              CHÚC MỪNG BẠN ĐÃ LÀ HỘI VIÊN PREMIUM!
            </h3>
            <p className="font-mono text-xs text-white">
              Đã mở khóa thành công tính năng AI Room Recommendation. Đang tải lại dữ liệu...
            </p>
          </div>
        ) : (
          <>
            {/* Benefits Checklist */}
            <div className="flex flex-col gap-3 bg-[#0E1420] border border-gt-border/80 p-4 rounded-sm">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-yellow-400/20 text-yellow-400 shrink-0 mt-0.5">
                  <Bot size={15} />
                </div>
                <div className="flex flex-col">
                  <span className="font-orbitron text-xs font-bold text-white uppercase tracking-wide">
                    AI Room Recommendation
                  </span>
                  <span className="font-rajdhani text-xs text-gt-text-dim">
                    AI tự động phân tích & đề xuất phòng có tỉ lệ hoàn thành &gt; 98%, chống nick ảo, tự vote hoặc vote chéo.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-yellow-400/20 text-yellow-400 shrink-0 mt-0.5">
                  <Zap size={15} />
                </div>
                <div className="flex flex-col">
                  <span className="font-orbitron text-xs font-bold text-white uppercase tracking-wide">
                    Priority Radar Matchmaking
                  </span>
                  <span className="font-rajdhani text-xs text-gt-text-dim">
                    Ưu tiên hàng chờ radar số 1, tìm kiếm đồng đội cùng rank dưới 15 giây.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-yellow-400/20 text-yellow-400 shrink-0 mt-0.5">
                  <ShieldCheck size={15} />
                </div>
                <div className="flex flex-col">
                  <span className="font-orbitron text-xs font-bold text-white uppercase tracking-wide">
                    Huy Hiệu 👑 Gold VIP Operative
                  </span>
                  <span className="font-rajdhani text-xs text-gt-text-dim">
                    Viền vàng kim phát sáng nổi bật trên Squad Finder Roster và LiveKit Voice Lounges.
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Wallet Status */}
            <div className="flex items-center justify-between p-4 bg-yellow-400/5 border border-yellow-400/30 rounded-sm">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-yellow-400/80 uppercase tracking-widest">
                  GÓI ĐĂNG KÝ HÀNG THÁNG
                </span>
                <span className="font-orbitron text-xl font-black text-white">
                  49.000 đ <span className="font-mono text-xs text-gt-text-dim font-normal">/ 30 ngày</span>
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-mono text-[10px] text-gt-text-dim uppercase tracking-widest flex items-center gap-1">
                  <Wallet size={11} className="text-yellow-400" /> SỐ DƯ VÍ
                </span>
                <span className={`font-mono text-sm font-bold ${hasEnoughBalance ? 'text-gt-green' : 'text-gt-red'}`}>
                  {walletBalance.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-sm text-red-400 font-mono text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2">
              {hasEnoughBalance ? (
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-black font-orbitron font-extrabold text-sm uppercase tracking-wider rounded-sm cyber-cut transition-all duration-300 shadow-[0_0_25px_rgba(250,204,21,0.5)] hover:shadow-[0_0_35px_rgba(250,204,21,0.8)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-black" />
                      <span>ĐANG KÍCH HOẠT...</span>
                    </>
                  ) : (
                    <>
                      <Crown size={16} />
                      <span>KÍCH HOẠT PREMIUM NGAY (49.000 đ)</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="text-center font-mono text-xs text-yellow-400/90 py-1">
                    Số dư ví của bạn không đủ 49.000 đ. Vui lòng nạp thêm tiền qua PayOS VietQR!
                  </div>
                  <Link
                    href="/wallet"
                    onClick={onClose}
                    className="w-full py-3.5 bg-yellow-500/20 hover:bg-yellow-500 text-yellow-400 hover:text-black border border-yellow-400 font-orbitron font-extrabold text-sm uppercase tracking-wider rounded-sm cyber-cut transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Wallet size={16} />
                    <span>NẠP VÍ QUA PAYOS VIETQR</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
