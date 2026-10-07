'use client';

import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Monitor, Settings, PhoneOff } from 'lucide-react';
import type { VoiceRoom } from '../types/voice.types';

interface VoiceControlsProps {
  room: VoiceRoom;
  isMuted: boolean;
  isDeafened: boolean;
  isScreenSharing: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onToggleScreenShare: () => void;
  onLeaveRoom: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  room,
  isMuted,
  isDeafened,
  isScreenSharing,
  onToggleMute,
  onToggleDeafen,
  onToggleScreenShare,
  onLeaveRoom,
}) => {
  return (
    <div className="bg-[#0B0F17] border-t border-gray-800/80 px-6 py-3 flex items-center justify-between">
      {/* Left: Connection State & Room Info */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
          IN ROOM
        </div>
        <div className="font-orbitron font-semibold text-white text-xs tracking-wide">
          {room.name}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          <span>CONNECTED · {room.ping}ms</span>
        </div>
      </div>

      {/* Right: Audio / Voice Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Mic Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          className={`p-3 rounded-xl border transition-all duration-200 active:scale-95 ${
            isMuted
              ? 'bg-rose-950/60 border-rose-500/60 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
              : 'bg-[#121824] border-gray-800 hover:border-gray-700 text-gray-200 hover:text-white'
          }`}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Deafen / Speaker Toggle */}
        <button
          onClick={onToggleDeafen}
          title={isDeafened ? 'Undeafen' : 'Deafen'}
          className={`p-3 rounded-xl border transition-all duration-200 active:scale-95 ${
            isDeafened
              ? 'bg-rose-950/60 border-rose-500/60 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
              : 'bg-[#121824] border-gray-800 hover:border-gray-700 text-gray-200 hover:text-white'
          }`}
        >
          {isDeafened ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={onToggleScreenShare}
          title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
          className={`p-3 rounded-xl border transition-all duration-200 active:scale-95 ${
            isScreenSharing
              ? 'bg-cyan-950/60 border-gt-cyan text-gt-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]'
              : 'bg-[#121824] border-gray-800 hover:border-gray-700 text-gray-200 hover:text-white'
          }`}
        >
          <Monitor className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          title="Voice Settings"
          className="p-3 rounded-xl border bg-[#121824] border-gray-800 hover:border-gray-700 text-gray-200 hover:text-white transition-all duration-200 active:scale-95"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Disconnect Button */}
        <button
          onClick={onLeaveRoom}
          title="Disconnect from Room"
          className="p-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] transition-all duration-200 active:scale-95 ml-2"
        >
          <PhoneOff className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
