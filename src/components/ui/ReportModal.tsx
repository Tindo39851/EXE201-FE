'use client';

import React, { useState } from 'react';
import { getApiErrorMessage } from '@/services/api-client';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react';
import { reputationService } from '@/features/reputation/services/reputation.service';
import type { ReputationReport } from '@/features/reputation/types/reputation.types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (report: ReputationReport) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [targetUser, setTargetUser] = useState('');
  const [type, setType] = useState('TOXICITY');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const report = await reputationService.submitReport({
        user: targetUser,
        type,
        reason,
      });
      if (onSuccess) onSuccess(report);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, 'Failed to submit report'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-md bg-[#0B0F17] border-2 border-gt-red p-6 rounded-sm cyber-cut shadow-[0_0_50px_rgba(255,42,77,0.3)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gt-text-dim hover:text-gt-red p-1 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-gt-red/20 border border-gt-red cyber-cut-sm mb-3">
            <ShieldAlert size={24} className="text-gt-red" />
          </div>
          <h2 className="font-orbitron text-xl font-black text-white uppercase tracking-wider">
            REPORT CONDUCT VIOLATION
          </h2>
          <p className="font-mono text-xs text-gt-text-dim mt-1">
            Enforce community anti-toxicity protocols
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-gt-red/10 border border-gt-red/40 text-gt-red rounded-sm text-xs font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-gt-text-dim uppercase tracking-wider mb-1">Target Gamer Tag</label>
            <input
              type="text"
              required
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              placeholder="e.g. TOXIC_GHOUL"
              className="w-full bg-[#080B12] border border-gt-border hover:border-gt-red focus:border-gt-red focus:outline-none px-3 py-2 text-white rounded-sm"
            />
          </div>

          <div>
            <label className="block text-gt-text-dim uppercase tracking-wider mb-1">Violation Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-[#080B12] border border-gt-border hover:border-gt-red focus:border-gt-red focus:outline-none px-3 py-2 text-white rounded-sm"
            >
              <option value="TOXICITY">Toxicity / Hate Speech</option>
              <option value="AFK">AFK / Intentional Feeding</option>
              <option value="CHEATING">Cheating / Scripting / Exploits</option>
              <option value="SMURFING">Smurfing / Rank Boosting</option>
            </select>
          </div>

          <div>
            <label className="block text-gt-text-dim uppercase tracking-wider mb-1">Evidence / Incident Context</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide match timestamp, lobby ID or behavior log..."
              className="w-full bg-[#080B12] border border-gt-border hover:border-gt-red focus:border-gt-red focus:outline-none p-3 text-white rounded-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-gt-red to-orange-600 text-white font-orbitron text-xs font-bold uppercase tracking-wider cyber-cut glow-red flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <AlertTriangle size={14} />
            <span>{submitting ? 'DISPATCHING REPORT...' : 'SUBMIT VIOLATION REPORT'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
