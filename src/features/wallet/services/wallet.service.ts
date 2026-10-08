import { apiClient } from '@/services/api-client';
import type { WalletTransaction, PayOSCheckoutData, EWalletProvider, DepositPreset, PaymentStatusResponse } from '../types/wallet.types';

export const USD_TO_VND_RATE = 25400;

export const PRESET_AMOUNTS: DepositPreset[] = [
  { label: '10k', vnd: 10000 },
  { label: '50k', vnd: 50000 },
  { label: '100k', vnd: 100000 },
  { label: '200k', vnd: 200000 },
  { label: '500k', vnd: 500000 },
];

let currentBalance = 150000; // default 150,000 VNĐ
let transactionList: WalletTransaction[] = [];

export interface PaymentApiResponse {
  orderCode: number;
  amountUsd?: number;
  amountVnd: number;
  transferNote: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  checkoutUrl?: string;
  qrCode?: string;
  qrImageUrl?: string;
  status: string;
}

export const walletService = {
  async getBalance(): Promise<number> {
    try {
      const res = await apiClient.get<{ balance: number }>('/payment/balance');
      const payload = res.data as { balance: number };
      if (payload && typeof payload.balance === 'number') {
        currentBalance = payload.balance;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('wallet:balance-updated', { detail: currentBalance }));
        }
      }
    } catch {
      // Use local in-memory fallback
    }
    return currentBalance;
  },

  async getTransactions(): Promise<WalletTransaction[]> {
    try {
      const res = await apiClient.get<any[]>('/payment/transactions');
      const list = res.data;
      if (Array.isArray(list)) {
        const mapped: WalletTransaction[] = list.map((item) => ({
          id: item.id || `tx-${item.orderCode}`,
          transactionId: `TXN-${item.orderCode}`,
          date: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          method: item.method || 'QR',
          amount: item.amountVnd || (item.amountUsd ? Math.round(item.amountUsd * USD_TO_VND_RATE) : 50000),
          status: item.status === 'SUCCESS' ? 'Success' : item.status === 'PENDING' ? 'Pending' : 'Failed',
          provider: item.method === 'Card' ? 'Credit Card' : 'PayOS VietQR',
          note: item.transferNote || item.description,
        }));
        transactionList = mapped;
        return mapped;
      }
    } catch {
      // In case of network error, return cached transactions
    }
    return [...transactionList];
  },

  async checkPaymentStatus(orderCode: number): Promise<PaymentStatusResponse> {
    try {
      const res = await apiClient.get<PaymentStatusResponse>(`/payment/check-status/${orderCode}`);
      const data = res.data as PaymentStatusResponse;
      if (data && typeof data.balance === 'number') {
        currentBalance = data.balance;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('wallet:balance-updated', { detail: currentBalance }));
        }
      }
      return data;
    } catch (err: any) {
      return {
        orderCode,
        status: 'PENDING',
        amountVnd: 0,
        isPaid: false,
        balance: currentBalance,
        message: err?.message || 'Không thể kết nối đến máy chủ',
      };
    }
  },

  async checkByRef(ref: string): Promise<PaymentStatusResponse> {
    try {
      const res = await apiClient.get<PaymentStatusResponse>(`/payment/check-by-ref?ref=${encodeURIComponent(ref)}`);
      const data = res.data as PaymentStatusResponse;
      if (data && typeof data.balance === 'number') {
        currentBalance = data.balance;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('wallet:balance-updated', { detail: currentBalance }));
        }
      }
      return data;
    } catch (err: any) {
      return {
        orderCode: 0,
        status: 'PENDING',
        amountVnd: 0,
        isPaid: false,
        balance: currentBalance,
        message: err?.response?.data?.message || err?.message || 'Không tìm thấy giao dịch',
      };
    }
  },

  async createPayOSPaymentLink(amountVnd: number, provider: EWalletProvider = 'PAYOS'): Promise<PayOSCheckoutData> {
    try {
      const res = await apiClient.post<PaymentApiResponse>('/payment/create-payment-link', {
        amountVnd,
        description: `Nạp ${amountVnd.toLocaleString('vi-VN')} đ`,
      });

      const data = res.data as PaymentApiResponse;
      if (data && data.orderCode) {
        const qrUrl = data.qrImageUrl || `https://img.vietqr.io/image/970422-0838939851-compact2.png?amount=${data.amountVnd}&addInfo=${encodeURIComponent(data.transferNote)}&accountName=DO%20TRONG%20TIN`;

        return {
          orderCode: data.orderCode,
          amountVnd: data.amountVnd,
          amountUsd: data.amountUsd,
          transferNote: data.transferNote,
          accountNumber: data.accountNumber || '0838939851',
          accountName: data.accountName || 'DO TRONG TIN',
          bankName: data.bankName || 'MBBank',
          qrUrl,
          checkoutUrl: data.checkoutUrl,
        };
      }
      throw new Error('Dữ liệu cổng thanh toán không hợp lệ.');
    } catch (err: any) {
      console.error('[WALLET_ERROR] Failed to create PayOS link via backend:', err);
      throw new Error(err?.response?.data?.message || err?.message || 'Không thể tạo cổng thanh toán PayOS. Vui lòng thử lại.');
    }
  },

  generateFallbackOrder(amountVnd: number, provider: EWalletProvider = 'PAYOS'): PayOSCheckoutData {
    const orderCode = Number(String(Date.now()).slice(-6));
    const transferNote = `GT${orderCode}`;
    const bankBin = '970422'; // MBBank (VietQR standard)
    const accountNumber = '0838939851';
    const accountName = 'DO TRONG TIN';
    
    const qrUrl = `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact2.png?amount=${amountVnd}&addInfo=${encodeURIComponent(transferNote)}&accountName=${encodeURIComponent(accountName)}`;

    return {
      orderCode,
      amountVnd,
      amountUsd: Math.round((amountVnd / USD_TO_VND_RATE) * 100) / 100,
      transferNote,
      accountNumber,
      accountName,
      bankName: 'MBBank',
      qrUrl,
    };
  },

  async confirmDeposit(amountVnd: number, method: 'QR' | 'Card', orderCode?: number, note?: string): Promise<WalletTransaction> {
    if (orderCode) {
      try {
        await apiClient.post(`/payment/simulate-success/${orderCode}`);
      } catch {
        // Fallback simulation
      }
    }

    currentBalance += amountVnd;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wallet:balance-updated', { detail: currentBalance }));
    }
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      transactionId: `TXN-${orderCode || Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      method,
      amount: amountVnd,
      status: 'Success',
      provider: method === 'QR' ? 'PayOS VietQR' : 'Credit Card',
      note,
    };
    transactionList = [newTx, ...transactionList];
    return newTx;
  },
};
