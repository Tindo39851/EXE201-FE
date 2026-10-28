import { apiClient, getApiErrorMessage } from '@/services/api-client';
import type { WalletTransaction, PayOSCheckoutData, EWalletProvider, DepositPreset, PaymentStatusResponse } from '../types/wallet.types';

export const USD_TO_VND_RATE = 25400;

export const PRESET_AMOUNTS: DepositPreset[] = [
  { label: '10k', vnd: 10000 },
  { label: '50k', vnd: 50000 },
  { label: '100k', vnd: 100000 },
  { label: '200k', vnd: 200000 },
  { label: '500k', vnd: 500000 },
];

let currentBalance = 0;

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

interface PaymentTransactionApiResponse {
  id?: string;
  orderCode: number;
  createdAt?: string;
  method?: 'QR' | 'Card';
  amountVnd?: number;
  amountUsd?: number;
  status?: string;
  transferNote?: string;
  description?: string;
}

export const walletService = {
  async getBalance(): Promise<number> {
    const res = await apiClient.get<{ balance: number }>('/payment/balance');
    const payload = res.data as { balance: number };
    if (payload && typeof payload.balance === 'number') {
      currentBalance = payload.balance;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('wallet:balance-updated', { detail: currentBalance }));
      }
    }
    return currentBalance;
  },

  async getTransactions(): Promise<WalletTransaction[]> {
    const res = await apiClient.get<PaymentTransactionApiResponse[]>('/payment/transactions');
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
      return mapped;
    }
    throw new Error('Dữ liệu lịch sử giao dịch không hợp lệ.');
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
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'Không thể kết nối đến máy chủ'));
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
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'Không tìm thấy giao dịch'));
    }
  },

  async createPayOSPaymentLink(amountVnd: number, provider: EWalletProvider = 'PAYOS'): Promise<PayOSCheckoutData> {
    if (provider !== 'PAYOS') {
      throw new Error(`${provider} chưa được kết nối. Vui lòng chọn PayOS.`);
    }
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
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'Không thể tạo cổng thanh toán PayOS. Vui lòng thử lại.'));
    }
  },

  async confirmDeposit(orderCode: number): Promise<WalletTransaction> {
    if (!orderCode) {
      throw new Error('Không có mã giao dịch để xác nhận.');
    }
    const simulation = await apiClient.post<{ success: boolean }>(`/payment/simulate-success/${orderCode}`);
    if (!simulation.data?.success) {
      throw new Error('Giao dịch không còn ở trạng thái chờ xử lý.');
    }
    const transactions = await this.getTransactions();
    const confirmed = transactions.find(item => item.transactionId === `TXN-${orderCode}` && item.status === 'Success');
    if (!confirmed) throw new Error('Backend chưa xác nhận giao dịch thành công.');
    await this.getBalance();
    return confirmed;
  },
};
