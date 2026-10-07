'use client';

import React, { useState } from 'react';
import { getApiErrorMessage } from '@/services/api-client';
import { X, Award, Star, Sparkles } from 'lucide-react';
import { reputationService } from '@/features/reputation/services/reputation.service';
import type { ReputationReview } from '@/features/reputation/types/reputation.types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (review: ReputationReview) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [targetUser, setTargetUser] = useState('');
  const [stars, setStars] = useState(5);
  const [badge, setBadge] = useState('Team Player');
  const [quote, setQuote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const review = await reputationService.submitReview({
        user: targetUser,
        stars,
        badge,
        quote,
      });
      if (onSuccess) onSuccess(review);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, 'Failed to submit review'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-md bg-[#0B0F17] border-2 border-gt-magenta p-6 rounded-sm cyber-cut shadow-[0_0_50px_rgba(255,0,127,0.3)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gt-text-dim hover:text-gt-magenta p-1 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-gt-magenta/20 border border-gt-magenta cyber-cut-sm mb-3">
            <Award size={24} className="text-gt-magenta" />
          </div>
          <h2 className="font-orbitron text-xl font-black text-white uppercase tracking-wider">
            SUBMIT PLAYER ENDORSEMENT
          </h2>
          <p className="font-mono text-xs text-gt-text-dim mt-1">
            Reward fair play and clutch teammates
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
              placeholder="e.g. AXIOM_V"
              className="w-full bg-[#080B12] border border-gt-border hover:border-gt-magenta focus:border-gt-magenta focus:outline-none px-3 py-2 text-white rounded-sm"
            />
          </div>

          <div>
            <label className="block text-gt-text-dim uppercase tracking-wider mb-1">Rating ({stars} / 5 Stars)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setStars(num)}
                  className={`p-2 border rounded-sm transition-all cursor-pointer ${
                    stars >= num
                      ? 'border-gt-yellow bg-gt-yellow/20 text-gt-yellow shadow-[0_0_10px_rgba(255,215,0,0.3)]'
                      : 'border-gt-border text-gt-text-dim hover:border-white'
                  }`}
                >
                  <Star size={16} fill={stars >= num ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gt-text-dim uppercase tracking-wider mb-1">Badge Tag</label>
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full bg-[#080B12] border border-gt-border hover:border-gt-magenta focus:border-gt-magenta focus:outline-none px-3 py-2 text-white rounded-sm"
            >
              <option value="Team Player">Team Player</option>
              <option value="Clutch Player">Clutch Player</option>
              <option value="Great IGL">Great IGL</option>
              <option value="Calm Comms">Calm Comms</option>
              <option value="Master Strategist">Master Strategist</option>
            </select>
          </div>

          <div>
            <label className="block text-gt-text-dim uppercase tracking-wider mb-1">Review Quote / Comment</label>
            <textarea
              required
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Calm in clutch moments, great rotations..."
              className="w-full bg-[#080B12] border border-gt-border hover:border-gt-magenta focus:border-gt-magenta focus:outline-none p-3 text-white rounded-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-gt-magenta to-pink-600 text-white font-orbitron text-xs font-bold uppercase tracking-wider cyber-cut glow-magenta flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Sparkles size={14} />
            <span>{submitting ? 'TRANSMITTING...' : 'POST ENDORSEMENT'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
