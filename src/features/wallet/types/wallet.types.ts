export type PaymentMethod = 'E_WALLET' | 'CREDIT_CARD';
export type EWalletProvider = 'MOMO' | 'ZALOPAY' | 'PAYOS';
export type TransactionStatus = 'Success' | 'Pending' | 'Failed';

export interface WalletTransaction {
  id: string;
  transactionId: string;
  date: string;
  method: 'QR' | 'Card';
  amount: number; // in VND
  status: TransactionStatus;
  provider?: string;
  note?: string;
}

export interface DepositPreset {
  label: string;
  vnd: number;
}

export interface PayOSCheckoutData {
  orderCode: number;
  amountVnd: number;
  amountUsd?: number;
  transferNote: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  qrUrl: string;
  checkoutUrl?: string;
}

export interface PaymentStatusResponse {
  orderCode: number;
  status: 'PENDING' | 'SUCCESS' | 'CANCELLED' | 'FAILED' | string;
  amountVnd: number;
  isPaid: boolean;
  balance: number;
  message: string;
}
