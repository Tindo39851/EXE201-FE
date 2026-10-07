'use client';

import React, { useEffect, useState } from 'react';
import { X, Bell, Users, Check, Ban, Radio } from 'lucide-react';
import { squadService } from '@/features/squads/services/squad.service';
import type { SquadInvite } from '@/features/squads/types/squad.types';

interface InboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InboxModal: React.FC<InboxModalProps> = ({ isOpen, onClose }) => {
  const [invites, setInvites] = useState<SquadInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const data = await squadService.getMyInvites();
      setInvites(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Refresh inbox contents whenever the modal opens.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchInvites();
    }
  }, [isOpen]);

  const handleRespond = async (id: string, accept: boolean) => {
    setActingId(id);
    try {
      await squadService.respondToInvite(id, accept);
      setInvites(prev =>
        prev.map(inv =>
          inv.id === id ? { ...inv, status: accept ? 'ACCEPTED' : 'DECLINED' } : inv
        )
      );
    } finally {
      setActingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-lg bg-[#0B0F17] border-2 border-gt-cyan p-6 sm:p-7 rounded-sm cyber-cut shadow-[0_0_50px_rgba(0,240,255,0.4)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gt-text-dim hover:text-gt-cyan p-1 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gt-border/70">
          <div className="w-10 h-10 rounded-sm bg-gt-cyan/20 border border-gt-cyan flex items-center justify-center text-gt-cyan cyber-cut-sm">
            <Bell size={20} />
          </div>
          <div>
            <div className="section-label text-gt-cyan text-[10px] font-mono uppercase">
              NOTIF_FEED // SQUAD DISPATCH
            </div>
            <h2 className="font-orbitron text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              INBOX & INVITES
              <Radio size={14} className="text-gt-cyan animate-pulse" />
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gt-text-dim font-mono text-xs">
            Scanning incoming transmissions...
          </div>
        ) : invites.length === 0 ? (
          <div className="py-12 text-center font-mono space-y-2">
            <Users size={32} className="mx-auto text-gt-text-dim/40" />
            <p className="text-xs text-gt-text-dim">No pending squad invites found.</p>
            <p className="text-[11px] text-gt-text-dim/60">
              Invites from other captains will appear in real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {invites.map((invite) => {
              const isPending = invite.status === 'PENDING';
              return (
                <div
                  key={invite.id}
                  className="bg-[#080D15] border border-gt-border p-3.5 rounded-sm flex items-center justify-between gap-3 font-mono text-xs hover:border-gt-cyan/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-orbitron font-bold text-white uppercase text-[13px]">
                        {invite.invitedBy || 'CAPTAIN'}
                      </span>
                      <span className="text-[10px] text-gt-text-dim">→ {invite.playerId}</span>
                    </div>
                    <div className="text-[11px] text-gt-text-dim flex items-center gap-2">
                      <span>Lobby Invite</span>
                      <span>•</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-sm uppercase font-bold ${
                          invite.status === 'ACCEPTED'
                            ? 'text-gt-green border border-gt-green/40 bg-gt-green/10'
                            : invite.status === 'DECLINED'
                            ? 'text-gt-red border border-gt-red/40 bg-gt-red/10'
                            : 'text-gt-yellow border border-gt-yellow/40 bg-gt-yellow/10'
                        }`}
                      >
                        {invite.status}
                      </span>
                    </div>
                  </div>

                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRespond(invite.id, true)}
                        disabled={actingId === invite.id}
                        className="px-3 py-1.5 bg-gt-green/20 hover:bg-gt-green text-gt-green hover:text-black border border-gt-green font-orbitron text-[11px] font-bold uppercase rounded-sm cyber-cut-sm transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Check size={12} />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleRespond(invite.id, false)}
                        disabled={actingId === invite.id}
                        className="px-2.5 py-1.5 bg-gt-red/15 hover:bg-gt-red text-gt-red hover:text-white border border-gt-red font-orbitron text-[11px] font-bold uppercase rounded-sm cyber-cut-sm transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Ban size={12} />
                        <span>Decline</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-gt-text-dim italic font-mono">
                      Resolved
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
