'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import {
  ArrowLeft,
  QrCode,
  CreditCard,
  Copy,
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  Coins,
  CheckCircle2,
  Home,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { walletService } from '@/features/wallet/services/wallet.service';
import type { PaymentMethod, EWalletProvider, WalletTransaction } from '@/features/wallet/types/wallet.types';

interface PresetItem {
  label: string;
  value: number;
  sub: string;
}

const PRESET_AMOUNTS: PresetItem[] = [
  { label: '10k', value: 10000, sub: '10.000 đ' },
  { label: '50k', value: 50000, sub: '50.000 đ' },
  { label: '100k', value: 100000, sub: '100.000 đ' },
  { label: '200k', value: 200000, sub: '200.000 đ' },
  { label: '500k', value: 500000, sub: '500.000 đ' },
];

function WalletContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Query params from PayOS redirect
  const statusParam = searchParams.get('status');
  const orderCodeParam = searchParams.get('orderCode');

  const [balance, setBalance] = useState<number>(150000);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('E_WALLET');
  const [ewalletProvider, setEwalletProvider] = useState<EWalletProvider>('PAYOS');
  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  
  // Timer countdown
  const [timeLeft, setTimeLeft] = useState<number>(899); // 14:59 in seconds
  const [copied, setCopied] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [manualRef, setManualRef] = useState<string>('');

  // Dynamic transfer note and PayOS checkout data
  const [transferNote, setTransferNote] = useState<string>('');
  const [orderCode, setOrderCode] = useState<number | null>(null);
  const [accountNumber, setAccountNumber] = useState<string>('0838939851');
  const [accountName, setAccountName] = useState<string>('DO TRONG TIN');
  const [bankName, setBankName] = useState<string>('MBBank');
  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>(undefined);
  const [qrUrl, setQrUrl] = useState<string>('');

  // Success view state for redirect from PayOS
  const [showSuccessScreen, setShowSuccessScreen] = useState<boolean>(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState<{
    orderCode: number;
    amount: number;
    newBalance: number;
  } | null>(null);

  // Fetch latest balance and transactions from DB
  const refreshUserData = useCallback(async () => {
    try {
      const [currentBal, txList] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions(),
      ]);
      setBalance(currentBal);
      setTransactions(txList);
    } catch {
      // ignore
    }
  }, []);

  const generateOrder = useCallback(async (amountVnd: number) => {
    try {
      const order = await walletService.createPayOSPaymentLink(amountVnd, ewalletProvider);
      setTransferNote(order.transferNote);
      setOrderCode(order.orderCode);
      setAccountNumber(order.accountNumber);
      setAccountName(order.accountName);
      setBankName(order.bankName);
      setQrUrl(order.qrUrl);
      setCheckoutUrl(order.checkoutUrl);
      setTimeLeft(899);
    } catch (err: any) {
      setSuccessToast(err?.message || 'Không thể tạo mã VietQR từ PayOS. Vui lòng thử lại.');
      setTimeout(() => setSuccessToast(null), 4000);
    }
  }, [ewalletProvider]);

  // Initial load
  useEffect(() => {
    refreshUserData();
    generateOrder(50000);
  }, [refreshUserData, generateOrder]);

  // Handle PayOS return redirect (?status=success&orderCode=XXXXX)
  useEffect(() => {
    if (statusParam === 'success' && orderCodeParam) {
      const code = parseInt(orderCodeParam, 10);
      if (!isNaN(code)) {
        setIsVerifying(true);
        walletService.checkPaymentStatus(code).then(async (res) => {
          setIsVerifying(false);
          const [updatedBal, updatedTx] = await Promise.all([
            walletService.getBalance(),
            walletService.getTransactions(),
          ]);
          setBalance(updatedBal);
          setTransactions(updatedTx);
          setSuccessOrderDetails({
            orderCode: code,
            amount: res.amountVnd || 0,
            newBalance: updatedBal,
          });
          setShowSuccessScreen(true);
        }).catch(() => {
          setIsVerifying(false);
          setShowSuccessScreen(true);
          setSuccessOrderDetails({
            orderCode: code,
            amount: 0,
            newBalance: balance,
          });
        });
      }
    }
  }, [statusParam, orderCodeParam, balance]);

  // Background polling for QR payments: checks PayOS status every 4s while order is active
  useEffect(() => {
    if (showSuccessScreen || !orderCode || selectedMethod !== 'E_WALLET') return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await walletService.checkPaymentStatus(orderCode);
        if (res.isPaid) {
          clearInterval(pollInterval);
          const [updatedBal, updatedTx] = await Promise.all([
            walletService.getBalance(),
            walletService.getTransactions(),
          ]);
          setBalance(updatedBal);
          setTransactions(updatedTx);
          setSuccessOrderDetails({
            orderCode,
            amount: res.amountVnd || selectedAmount,
            newBalance: updatedBal,
          });
          setShowSuccessScreen(true);
        }
      } catch {
        // quiet polling failure
      }
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [orderCode, showSuccessScreen, selectedMethod, selectedAmount]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 899));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    generateOrder(amount);
  };

  const parseCustomInput = (input: string): number => {
    const clean = input.trim().toLowerCase();
    if (clean.endsWith('k')) {
      const num = parseFloat(clean.slice(0, -1));
      return isNaN(num) ? 0 : Math.round(num * 1000);
    }
    const num = parseFloat(clean.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const parsed = parseCustomInput(val);
    if (parsed >= 10000) {
      setSelectedAmount(parsed);
      generateOrder(parsed);
    } else if (parsed > 0) {
      setSelectedAmount(parsed);
    }
  };

  const currentDepositAmount = selectedAmount > 0 ? selectedAmount : 0;
  const balanceAfter = balance + currentDepositAmount;

  const handleCopyNote = () => {
    navigator.clipboard.writeText(transferNote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Manual status check button
  const handleCheckStatus = async () => {
    if (!orderCode) return;
    setIsPolling(true);
    try {
      const res = await walletService.checkPaymentStatus(orderCode);
      const [updatedBal, updatedTx] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions(),
      ]);
      setBalance(updatedBal);
      setTransactions(updatedTx);

      if (res.isPaid) {
        setSuccessOrderDetails({
          orderCode,
          amount: res.amountVnd || currentDepositAmount,
          newBalance: updatedBal,
        });
        setShowSuccessScreen(true);
      } else {
        setSuccessToast(`Đơn hàng #${orderCode} đang chờ thanh toán qua ngân hàng.`);
        setTimeout(() => setSuccessToast(null), 3500);
      }
    } catch {
      setSuccessToast('Đang kết nối cổng PayOS, vui lòng thử lại sau giây lát.');
      setTimeout(() => setSuccessToast(null), 3500);
    } finally {
      setIsPolling(false);
    }
  };

  const handleCheckByRef = async () => {
    if (!manualRef.trim()) return;
    setIsPolling(true);
    try {
      const res = await walletService.checkByRef(manualRef.trim());
      const [updatedBal, updatedTx] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions(),
      ]);
      setBalance(updatedBal);
      setTransactions(updatedTx);

      if (res.isPaid) {
        setSuccessOrderDetails({
          orderCode: res.orderCode || orderCode || 0,
          amount: res.amountVnd || currentDepositAmount,
          newBalance: updatedBal,
        });
        setShowSuccessScreen(true);
      } else {
        setSuccessToast(res.message || `Mã ${manualRef} đang chờ xử lý.`);
        setTimeout(() => setSuccessToast(null), 3500);
      }
    } catch {
      setSuccessToast('Không thể kiểm tra mã giao dịch.');
      setTimeout(() => setSuccessToast(null), 3500);
    } finally {
      setIsPolling(false);
    }
  };

  // Dev simulation
  const handleSimulatePayment = async () => {
    setIsVerifying(true);
    await walletService.confirmDeposit(currentDepositAmount, selectedMethod === 'E_WALLET' ? 'QR' : 'Card', orderCode || undefined, transferNote);
    const [newBal, newTx] = await Promise.all([
      walletService.getBalance(),
      walletService.getTransactions(),
    ]);
    setBalance(newBal);
    setTransactions(newTx);
    setIsVerifying(false);
    setSuccessOrderDetails({
      orderCode: orderCode || 0,
      amount: currentDepositAmount,
      newBalance: newBal,
    });
    setShowSuccessScreen(true);
  };

  const handleContinueDepositing = () => {
    setShowSuccessScreen(false);
    setSuccessOrderDetails(null);
    router.push('/wallet');
    generateOrder(selectedAmount);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-gt-text font-rajdhani selection:bg-gt-cyan selection:text-black">
      <Navbar />

      {/* Floating Status Toast */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0B0F17] border border-gt-cyan text-gt-cyan px-5 py-3 rounded-lg shadow-[0_0_25px_rgba(0,240,255,0.35)] flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-gt-cyan" />
          <span className="font-orbitron font-bold text-xs tracking-wide">{successToast}</span>
        </div>
      )}

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* ========================================================================= */}
        {/* SUCCESS SCREEN VIEW (Shown after PayOS redirect or confirmed payment) */}
        {/* ========================================================================= */}
        {showSuccessScreen ? (
          <div className="max-w-2xl mx-auto my-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-[#0B0F17] border-2 border-emerald-400 rounded-3xl p-8 sm:p-12 shadow-[0_0_60px_rgba(16,185,129,0.3)] text-center relative overflow-hidden">
              
              {/* Background ambient glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

              {/* Glowing animated check badge */}
              <div className="relative mx-auto w-24 h-24 mb-6 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-pulse" />
              </div>

              <div className="font-mono text-xs text-emerald-400 uppercase tracking-[0.25em] mb-2 font-bold">
                PAYMENT COMPLETED // GIAO DỊCH THÀNH CÔNG
              </div>

              <h1 className="font-orbitron text-3xl sm:text-4xl font-black uppercase text-white tracking-wider mb-3">
                BẠN ĐÃ THANH TOÁN THÀNH CÔNG!
              </h1>

              <p className="font-mono text-sm text-gray-300 max-w-md mx-auto mb-8">
                Hệ thống đã xác nhận thanh toán qua cổng <strong className="text-white">PayOS</strong> và cập nhật số dư vào ví GameTrust của bạn.
              </p>

              {/* Transaction details summary box */}
              <div className="bg-[#121824] border border-gray-800 rounded-2xl p-6 text-left space-y-3 mb-8">
                {successOrderDetails?.orderCode && (
                  <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-gray-400">Mã giao dịch / Order Code:</span>
                    <span className="font-orbitron font-bold text-white tracking-wider">
                      #{successOrderDetails.orderCode}
                    </span>
                  </div>
                )}
                {successOrderDetails?.amount ? (
                  <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-gray-400">Số tiền nạp:</span>
                    <span className="font-orbitron font-black text-emerald-400 text-lg">
                      +{successOrderDetails.amount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                ) : null}
                <div className="h-px bg-gray-800 my-2"></div>
                <div className="flex justify-between items-center text-base font-mono">
                  <span className="text-gray-300 font-bold">Số dư hiện tại trong ví:</span>
                  <span className="font-orbitron font-black text-2xl text-yellow-400 tracking-wider">
                    {balance.toLocaleString('vi-VN')} <span className="text-lg">đ</span>
                  </span>
                </div>
              </div>

              {/* 2 Primary CTA Buttons requested by user */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleContinueDepositing}
                  className="py-4 px-6 rounded-xl bg-gt-cyan hover:bg-white text-black font-orbitron font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-[1.02]"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>TIẾP TỤC NẠP</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoHome}
                  className="py-4 px-6 rounded-xl bg-gray-900 border border-gray-700 hover:border-gray-500 text-white font-orbitron font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-gray-800"
                >
                  <Home className="w-5 h-5 text-gray-400" />
                  <span>VỀ TRANG CHỦ</span>
                </button>
              </div>

            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* REGULAR DEPOSIT INTERFACE */
          /* ========================================================================= */
          <>
            {/* Back Link */}
            <div>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-gt-cyan transition-colors group tracking-wider uppercase"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-gt-cyan" />
                <span>QUAY LẠI HỒ SƠ</span>
              </Link>
            </div>

            {/* Top Header: Title & Current Balance Widget */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
              <div>
                <div className="font-mono text-xs text-gt-cyan tracking-[0.2em] uppercase mb-1">
                  WALLET_01 // GAMETRUST FINANCE
                </div>
                <h1 className="font-orbitron text-4xl md:text-5xl font-black uppercase text-white tracking-wider text-glow-cyan">
                  NẠP TIỀN VÍ
                </h1>
              </div>

              {/* Current Balance Box */}
              <div className="bg-[#0B0F17]/90 border border-yellow-500/30 rounded-xl px-7 py-4 shadow-[0_0_25px_rgba(234,179,8,0.15)] flex flex-col justify-center min-w-[240px]">
                <span className="font-mono text-[11px] text-gray-400 uppercase tracking-widest mb-0.5">
                  SỐ DƯ HIỆN TẠI
                </span>
                <div className="font-orbitron font-black text-3xl md:text-4xl text-yellow-400 tracking-wider flex items-baseline">
                  {balance.toLocaleString('vi-VN')} <span className="text-xl ml-1 text-yellow-500 font-bold">đ</span>
                </div>
                <span className="font-mono text-[10px] text-yellow-500/80 uppercase tracking-wider mt-0.5">
                  VNĐ // GAMETRUST CREDITS
                </span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* E-WALLET Tab */}
              <button
                type="button"
                onClick={() => setSelectedMethod('E_WALLET')}
                className={`p-5 rounded-xl border text-left transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                  selectedMethod === 'E_WALLET'
                    ? 'bg-[#0B0F17] border-gt-cyan shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                    : 'bg-[#0B0F17]/50 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className={`p-3 rounded-lg border ${
                  selectedMethod === 'E_WALLET'
                    ? 'bg-gt-cyan/15 border-gt-cyan text-gt-cyan'
                    : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}>
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-orbitron font-bold text-sm tracking-wider text-white uppercase">
                    VÍ ĐIỆN TỬ & VIETQR
                  </div>
                  <div className="font-mono text-xs text-gray-400 mt-0.5">
                    PayOS VietQR (MBBank) • Momo • ZaloPay
                  </div>
                </div>
              </button>

              {/* CREDIT / DEBIT CARD Tab */}
              <button
                type="button"
                onClick={() => setSelectedMethod('CREDIT_CARD')}
                className={`p-5 rounded-xl border text-left transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                  selectedMethod === 'CREDIT_CARD'
                    ? 'bg-[#0B0F17] border-gt-cyan shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                    : 'bg-[#0B0F17]/50 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className={`p-3 rounded-lg border ${
                  selectedMethod === 'CREDIT_CARD'
                    ? 'bg-gt-cyan/15 border-gt-cyan text-gt-cyan'
                    : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-orbitron font-bold text-sm tracking-wider text-white uppercase">
                    THẺ QUỐC TẾ / NỘI ĐỊA
                  </div>
                  <div className="font-mono text-xs text-gray-400 mt-0.5">
                    Visa • Mastercard • Thẻ ATM Napas
                  </div>
                </div>
              </button>
            </div>

            {/* Main Content Area */}
            {selectedMethod === 'E_WALLET' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Amount Selection & Breakdown (Col 7) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* SELECT DEPOSIT AMOUNT (10k, 50k, 100k, 200k, 500k) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block font-mono text-xs text-gray-300 uppercase tracking-widest font-semibold flex items-center gap-2">
                        <Coins size={14} className="text-gt-cyan" />
                        <span>CHỌN MỆNH GIÁ NẠP NHANH</span>
                      </label>
                      <span className="font-mono text-[11px] text-gray-500">Đơn vị: VNĐ</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {PRESET_AMOUNTS.map((preset) => {
                        const isSelected = selectedAmount === preset.value && !customAmount;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleSelectPreset(preset.value)}
                            className={`py-4 px-3 rounded-xl border transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center ${
                              isSelected
                                ? 'bg-[#0B0F17] border-gt-cyan text-gt-cyan shadow-[0_0_20px_rgba(0,240,255,0.35)] scale-[1.03]'
                                : 'bg-[#0B0F17]/60 border-gray-800 text-white hover:border-gray-700 hover:bg-[#0B0F17]'
                            }`}
                          >
                            <span className="font-orbitron font-black text-2xl tracking-wide">
                              {preset.label}
                            </span>
                            <span className="font-mono text-[10px] text-gray-400 mt-0.5">
                              {preset.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CUSTOM AMOUNT INPUT */}
                  <div className="space-y-2">
                    <label className="block font-mono text-xs text-gray-400 uppercase tracking-wider flex items-center justify-between">
                      <span>HOẶC TỰ NHẬP SỐ TIỀN MONG MUỐN (VNĐ)</span>
                      <span className="text-gray-500 text-[11px]">Hỗ trợ gõ số hoặc thêm chữ k (VD: 50k, 150k, 250000)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="VD: 50k, 150000, 1000k..."
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="w-full bg-[#0B0F17] border border-gray-800 focus:border-gt-cyan rounded-xl py-3.5 pl-4 pr-32 text-white font-orbitron text-base outline-none transition-colors"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-gt-cyan font-bold">
                        {customAmount ? (
                          `= ${parseCustomInput(customAmount).toLocaleString('vi-VN')} đ`
                        ) : (
                          'VNĐ'
                        )}
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-gray-500 flex justify-between">
                      <span>Hạn mức tối thiểu: 10.000 đ (10k)</span>
                      <span>Hạn mức tối đa: 50.000.000 đ (50 triệu)</span>
                    </div>
                  </div>

                  {/* Breakdown Box */}
                  <div className="bg-[#0B0F17] border border-gray-800/80 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-center text-sm font-mono text-gray-400">
                      <span>Số tiền nạp</span>
                      <span className="font-orbitron font-semibold text-white">
                        {currentDepositAmount.toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm font-mono text-gray-400">
                      <span>Phí dịch vụ cổng</span>
                      <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider">
                        0 đ (MIỄN PHÍ)
                      </span>
                    </div>

                    <div className="h-px bg-gray-800"></div>

                    <div className="flex justify-between items-center text-base font-mono">
                      <span className="text-gray-300">Số dư sau khi nạp</span>
                      <span className="font-orbitron font-bold text-xl text-yellow-400 tracking-wider">
                        {balanceAfter.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                  {/* PayOS Notice Badge */}
                  <div className="p-4 rounded-xl bg-gt-cyan/5 border border-gt-cyan/20 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-gt-cyan shrink-0 mt-0.5" />
                    <div className="text-xs font-mono text-gray-300 space-y-1 leading-relaxed">
                      <span className="text-gt-cyan font-bold block">TỰ ĐỘNG XÁC NHẬN QUA PAYOS VIETQR 24/7</span>
                      Quét mã qua bất kỳ ứng dụng ngân hàng nào (MBBank, Vietcombank, Techcombank, VPBank, Momo, v.v.). Tiền sẽ được tự động cộng vào ví ngay sau khi chuyển khoản thành công!
                    </div>
                  </div>

                </div>

                {/* Right Column: SCAN TO DEPOSIT QR Widget (Col 5) */}
                <div className="lg:col-span-5 bg-[#0B0F17] border border-gt-cyan/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col items-center">
                  
                  <div className="w-full flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-widest font-bold">
                      QUÉT MÃ ĐỂ NẠP TIỀN
                    </span>

                    {/* Sub-tabs: MOMO / ZALOPAY / PAYOS */}
                    <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-lg border border-gray-800">
                      {(['PAYOS', 'MOMO', 'ZALOPAY'] as EWalletProvider[]).map((prov) => (
                        <button
                          key={prov}
                          type="button"
                          onClick={() => setEwalletProvider(prov)}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                            ewalletProvider === prov
                              ? 'bg-gt-cyan text-black font-bold'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {prov}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cyber QR Box with Glowing Frame & Scanning Beam */}
                  <div className="relative p-4 bg-black rounded-xl border-2 border-gt-cyan shadow-[0_0_30px_rgba(0,240,255,0.3)] my-2 overflow-hidden group">
                    
                    {/* Neon Corner Accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white"></div>

                    {/* Cyber Scan beam effect */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-gt-cyan to-transparent opacity-80 animate-pulse pointer-events-none top-1/2"></div>

                    {/* QR Image or Loading */}
                    {qrUrl ? (
                      <img
                        src={qrUrl}
                        alt="PayOS VietQR Code"
                        className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded bg-white p-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.vietqr.io/image/970422-${accountNumber}-compact2.png?amount=${currentDepositAmount}&addInfo=${encodeURIComponent(transferNote)}&accountName=${encodeURIComponent(accountName)}`;
                        }}
                      />
                    ) : (
                      <div className="w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-center bg-[#07090E] rounded border border-gray-800 text-gt-cyan gap-3">
                        <RefreshCw className="w-8 h-8 animate-spin text-gt-cyan" />
                        <span className="font-mono text-xs text-gray-400">Đang khởi tạo PayOS...</span>
                      </div>
                    )}
                  </div>

                  {/* Countdown Timer */}
                  <div className="flex items-center gap-2 font-mono text-xs text-gray-400 mt-4 mb-5">
                    <Clock className="w-3.5 h-3.5 text-gt-cyan animate-spin" />
                    <span>HẾT HẠN SAU <strong className="text-white font-orbitron">{formatTime(timeLeft)}</strong></span>
                  </div>

                  {/* Transfer Code Box */}
                  <div className="w-full bg-[#121824] border border-gray-800 rounded-xl p-4 text-center mb-4">
                    <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">
                      NỘI DUNG CHUYỂN KHOẢN (BẮT BUỘC)
                    </div>
                    <div className="font-orbitron font-extrabold text-lg text-gt-cyan tracking-widest select-all">
                      {transferNote}
                    </div>
                    <div className="text-[11px] font-mono text-gray-400 mt-2 space-y-0.5">
                      <div>Số tiền: <strong className="text-emerald-400 font-bold">{currentDepositAmount.toLocaleString('vi-VN')} VNĐ</strong></div>
                      <div>Ngân hàng: <strong className="text-white">{bankName}</strong> | STK: <strong className="text-white">{accountNumber}</strong></div>
                      <div>Chủ TK: <strong className="text-white uppercase">{accountName}</strong></div>
                    </div>
                  </div>

                  {/* Copy Transfer Content Button */}
                  <button
                    type="button"
                    onClick={handleCopyNote}
                    className="w-full py-3.5 px-4 rounded-xl border border-gt-cyan/60 hover:border-gt-cyan bg-gt-cyan/10 hover:bg-gt-cyan/20 text-gt-cyan font-orbitron font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)] mb-3"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">ĐÃ SAO CHÉP NỘI DUNG!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>SAO CHÉP NỘI DUNG CHUYỂN KHOẢN</span>
                      </>
                    )}
                  </button>

                  {/* Open PayOS Hosted Checkout Link Button (if available) */}
                  {checkoutUrl && (
                    <a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl border border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-orbitron font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.25)] mb-3"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>MỞ CỔNG THANH TOÁN PAYOS TRỰC TIẾP</span>
                    </a>
                  )}

                  {/* Manual Check Status Button */}
                  <button
                    type="button"
                    disabled={isPolling}
                    onClick={handleCheckStatus}
                    className="w-full py-3 px-4 rounded-xl border border-gray-700 hover:border-gt-cyan bg-[#121824] text-white font-orbitron font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer mb-3 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-gt-cyan ${isPolling ? 'animate-spin' : ''}`} />
                    <span>{isPolling ? 'ĐANG ĐỐI SOÁT PAYOS...' : 'KIỂM TRA TRẠNG THÁI THANH TOÁN'}</span>
                  </button>

                  {/* Manual Ref Input - ponytail: 1 compact row */}
                  <div className="w-full flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Nhập mã GT (VD: GT891725)..."
                      value={manualRef}
                      onChange={(e) => setManualRef(e.target.value)}
                      className="flex-1 bg-[#121824] border border-gray-800 focus:border-gt-cyan rounded-xl px-3 py-2 text-white font-mono text-xs uppercase outline-none"
                    />
                    <button
                      type="button"
                      disabled={isPolling || !manualRef.trim()}
                      onClick={handleCheckByRef}
                      className="px-3 py-2 bg-gt-cyan/15 hover:bg-gt-cyan border border-gt-cyan/40 text-gt-cyan hover:text-black font-orbitron font-bold text-xs uppercase rounded-xl transition-all cursor-pointer disabled:opacity-40"
                    >
                      XÁC NHẬN
                    </button>
                  </div>

                  {/* Instant Verification Simulation Button (Dev Test) */}
                  <button
                    type="button"
                    disabled={isVerifying}
                    onClick={handleSimulatePayment}
                    className="w-full py-2.5 px-4 rounded-xl bg-gt-cyan/20 hover:bg-gt-cyan text-gt-cyan hover:text-black border border-gt-cyan/40 font-orbitron font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>ĐANG MÔ PHỎNG...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>MÔ PHỎNG THANH TOÁN THÀNH CÔNG (DEV)</span>
                      </>
                    )}
                  </button>

                </div>

              </div>
            ) : (
              /* CREDIT / DEBIT CARD VIEW */
              <div className="max-w-2xl mx-auto bg-[#0B0F17] border border-gray-800 rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                  <CreditCard className="w-6 h-6 text-gt-cyan" />
                  <div>
                    <h3 className="font-orbitron font-bold text-lg text-white">THANH TOÁN THẺ TRỰC TUYẾN</h3>
                    <p className="font-mono text-xs text-gray-400">Hỗ trợ thẻ Visa, Mastercard, ATM Napas</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Số thẻ
                    </label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      maxLength={19}
                      className="w-full bg-[#121824] border border-gray-800 focus:border-gt-cyan rounded-lg px-4 py-3 text-white font-mono text-sm outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                        Ngày hết hạn
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-[#121824] border border-gray-800 focus:border-gt-cyan rounded-lg px-4 py-3 text-white font-mono text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                        Mã bảo mật (CVC/CVV)
                      </label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        className="w-full bg-[#121824] border border-gray-800 focus:border-gt-cyan rounded-lg px-4 py-3 text-white font-mono text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      className="w-full py-3.5 bg-gt-cyan text-black hover:bg-white font-orbitron font-black text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                    >
                      THANH TOÁN {currentDepositAmount.toLocaleString('vi-VN')} VNĐ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Section: RECENT TRANSACTIONS Table (Real DB Records) */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800/80">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gt-cyan"></span>
                  <h2 className="font-orbitron font-bold text-base text-white uppercase tracking-wider">
                    LỊCH SỬ GIAO DỊCH GẦN ĐÂY
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={refreshUserData}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-gray-400 hover:text-gt-cyan transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>CẬP NHẬT</span>
                </button>
              </div>

              <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
                {transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800/80 bg-black/40 text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                          <th className="py-4 px-6">NGÀY</th>
                          <th className="py-4 px-6">MÃ GIAO DỊCH</th>
                          <th className="py-4 px-6">HÌNH THỨC</th>
                          <th className="py-4 px-6">NỘI DUNG</th>
                          <th className="py-4 px-6">SỐ TIỀN</th>
                          <th className="py-4 px-6 text-right">TRẠNG THÁI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/50 font-mono text-xs">
                        {transactions.map((tx) => (
                          <tr
                            key={tx.id}
                            className="hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="py-4 px-6 text-gray-400">{tx.date}</td>
                            <td className="py-4 px-6 text-white font-semibold font-orbitron tracking-wider">
                              {tx.transactionId}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                tx.method === 'QR'
                                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                                  : 'bg-indigo-950/40 text-indigo-400 border-indigo-500/30'
                              }`}>
                                {tx.method}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-gray-400 max-w-[200px] truncate">
                              {tx.note || '—'}
                            </td>
                            <td className="py-4 px-6 font-orbitron font-bold text-emerald-400 tracking-wider">
                              +{tx.amount.toLocaleString('vi-VN')} đ
                            </td>
                            <td className="py-4 px-6 text-right">
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    tx.status === 'Success'
                                      ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                                      : tx.status === 'Pending'
                                      ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]'
                                      : 'bg-rose-400 shadow-[0_0_6px_#f43f5e]'
                                  }`}
                                />
                                <span className={
                                  tx.status === 'Success'
                                    ? 'text-emerald-400'
                                    : tx.status === 'Pending'
                                    ? 'text-amber-400'
                                    : 'text-rose-400'
                                }>
                                  {tx.status === 'Success' ? 'Thành công' : tx.status === 'Pending' ? 'Đang chờ' : 'Thất bại'}
                                </span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 px-6 text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-gray-600 mx-auto" />
                    <div className="font-orbitron text-sm text-gray-400">CHƯA CÓ LỊCH SỬ GIAO DỊCH</div>
                    <div className="font-mono text-xs text-gray-600">
                      Các giao dịch nạp tiền qua VietQR hoặc Thẻ sẽ hiển thị tại đây sau khi bạn tạo lệnh.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center text-gt-cyan font-orbitron">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    }>
      <WalletContent />
    </Suspense>
  );
}
