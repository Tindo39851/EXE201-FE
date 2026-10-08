'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, LoaderCircle, Users } from 'lucide-react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  useConnectionState,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
  useTrackToggle,
} from '@livekit/components-react';
import { ConnectionState, Participant, ParticipantEvent, Track, TrackPublication } from 'livekit-client';
import { PlayerSlot } from './PlayerSlot';
import { RoomChat } from './RoomChat';
import { VoiceControls } from './VoiceControls';
import { useVoiceRoom } from '../hooks/useVoiceRoom';
import { voiceService } from '../services/voice.service';
import type { VoiceJoinCredentials, VoiceMember, VoiceRoom } from '../types/voice.types';
import { useAuth } from '@/contexts/AuthContext';
import { getApiErrorMessage } from '@/services/api-client';

interface ActiveRoomProps {
  initialRoom: VoiceRoom;
  onLeave: () => void;
}

interface ConnectedRoomProps extends ActiveRoomProps {
  mediaError: string | null;
}

const participantToMember = (participant: Participant, ownerId?: string): VoiceMember => ({
  id: participant.sid,
  userId: participant.identity,
  username: participant.name || participant.identity,
  avatarLetter: (participant.name || participant.identity || 'U')[0].toUpperCase(),
  avatarColor: participant.isLocal ? '#00F0FF' : '#FFD700',
  muted: !participant.isMicrophoneEnabled,
  isSpeaking: participant.isSpeaking,
  isCurrentUser: participant.isLocal,
  isHost: participant.identity === ownerId,
  joinedAt: participant.joinedAt?.toISOString(),
  connectionQuality: String(participant.connectionQuality || 'unknown').toUpperCase(),
});

const ConnectedRoom: React.FC<ConnectedRoomProps> = ({ initialRoom, mediaError }) => {
  const { room: restRoom, messages, sendMessage } = useVoiceRoom(initialRoom.id);
  const participants = useParticipants();
  const liveKitRoom = useRoomContext();
  const connectionState = useConnectionState();
  const { localParticipant } = useLocalParticipant();
  const microphone = useTrackToggle({ source: Track.Source.Microphone });
  const [microphoneEventMuted, setMicrophoneEventMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [controlError, setControlError] = useState<string | null>(mediaError);
  const isMicrophoneEnabled = microphone.enabled && !microphoneEventMuted;

  useEffect(() => {
    const onMuted = (publication: TrackPublication) => {
      if (publication.source === Track.Source.Microphone) setMicrophoneEventMuted(true);
    };
    const onUnmuted = (publication: TrackPublication) => {
      if (publication.source === Track.Source.Microphone) setMicrophoneEventMuted(false);
    };
    localParticipant.on(ParticipantEvent.TrackMuted, onMuted);
    localParticipant.on(ParticipantEvent.TrackUnmuted, onUnmuted);
    return () => {
      localParticipant.off(ParticipantEvent.TrackMuted, onMuted);
      localParticipant.off(ParticipantEvent.TrackUnmuted, onUnmuted);
    };
  }, [localParticipant]);

  const members = useMemo(
    () => participants.map(participant => participantToMember(participant, initialRoom.ownerId)),
    [participants, initialRoom.ownerId]
  );

  const currentRoom = useMemo<VoiceRoom>(() => ({
    ...(restRoom || initialRoom),
    members,
    onlineCount: members.length,
  }), [restRoom, initialRoom, members]);

  const toggleMute = useCallback(async () => {
    try {
      setControlError(null);
      await microphone.toggle(!isMicrophoneEnabled);
    } catch (error) {
      setControlError(getApiErrorMessage(error, 'Không thể thay đổi trạng thái microphone.'));
    }
  }, [microphone, isMicrophoneEnabled]);

  const leaveRoom = useCallback(async () => {
    try {
      await voiceService.leaveRoom(initialRoom.id, localParticipant.identity);
    } finally {
      await liveKitRoom.disconnect();
    }
  }, [initialRoom.id, liveKitRoom, localParticipant.identity]);

  const displaySlots: Array<VoiceMember | null> = [...members];
  while (displaySlots.length < Math.min(currentRoom.capacity, 8)) displaySlots.push(null);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-[#07090E] border border-gray-800/80 rounded-2xl overflow-hidden shadow-2xl">
      <RoomAudioRenderer muted={isDeafened} />
      <StartAudio label="Bật âm thanh phòng" />

      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/80 bg-[#0B0F17]">
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${connectionState === ConnectionState.Connected ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400'}`} />
          <h2 className="font-orbitron font-bold text-white text-base tracking-wide">{currentRoom.name}</h2>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-0.5 rounded">
            {currentRoom.rankRequirement || currentRoom.tag}
          </span>
          {currentRoom.playMode && (
            <span className="text-[11px] font-mono text-purple-400 bg-purple-950/40 border border-purple-500/30 px-2.5 py-0.5 rounded">
              {currentRoom.playMode}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
          <Users className="w-4 h-4 text-gray-500" />
          <span>{currentRoom.onlineCount}/{currentRoom.capacity}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 p-8 flex items-center justify-center overflow-x-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/10 via-[#07090E] to-[#07090E]">
          <div className="flex flex-wrap items-center justify-center gap-6 max-w-5xl">
            {displaySlots.slice(0, 8).map((member, index) => (
              <PlayerSlot key={member?.id || `empty_${index}`} member={member} isEmpty={!member} />
            ))}
          </div>
        </div>
        <RoomChat messages={messages} onSendMessage={sendMessage} />
      </div>

      <VoiceControls
        room={currentRoom}
        isMuted={!isMicrophoneEnabled}
        isDeafened={isDeafened}
        connectionState={connectionState}
        controlError={controlError || mediaError}
        onToggleMute={() => void toggleMute()}
        onToggleDeafen={() => setIsDeafened(value => !value)}
        onLeaveRoom={() => void leaveRoom()}
      />
    </div>
  );
};

export const ActiveRoom: React.FC<ActiveRoomProps> = ({ initialRoom, onLeave }) => {
  const { user, loading: authLoading } = useAuth();
  const [credentials, setCredentials] = useState<VoiceJoinCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (authLoading || !user) return;
    voiceService.createVoiceToken(initialRoom.id)
      .then(result => {
        if (!cancelled) setCredentials(result);
      })
      .catch(reason => {
        if (!cancelled) setError(getApiErrorMessage(reason, 'Không thể lấy quyền tham gia voice room.'));
      });

    return () => { cancelled = true; };
  }, [initialRoom.id, user, authLoading, attempt]);

  const handleDisconnected = useCallback(() => {
    void voiceService.leaveRoom(initialRoom.id, user?.id).finally(onLeave);
  }, [initialRoom.id, onLeave, user?.id]);

  if (authLoading || (!credentials && !error)) {
    if (!authLoading && !user) {
      return <VoiceStatus icon={<AlertTriangle className="w-7 h-7 text-rose-400" />} title="Cần đăng nhập" detail="Bạn cần đăng nhập trước khi tham gia voice room." />;
    }
    return <VoiceStatus icon={<LoaderCircle className="w-7 h-7 animate-spin" />} title="Đang kết nối voice room" detail="Đang xin token WebRTC an toàn từ backend..." />;
  }

  if (error || !credentials) {
    return (
      <VoiceStatus
        icon={<AlertTriangle className="w-7 h-7 text-rose-400" />}
        title="Không thể kết nối voice"
        detail={error || 'Thiếu thông tin kết nối LiveKit.'}
        action={() => {
          setError(null);
          setAttempt(value => value + 1);
        }}
      />
    );
  }

  return (
    <LiveKitRoom
      token={credentials.participantToken}
      serverUrl={credentials.serverUrl}
      connect
      audio
      video={false}
      onDisconnected={handleDisconnected}
      onError={event => setError(event.message)}
      onMediaDeviceFailure={(_, kind) => setMediaError(`Không truy cập được thiết bị ${kind || 'microphone'}. Hãy kiểm tra quyền trình duyệt.`)}
    >
      <ConnectedRoom initialRoom={initialRoom} onLeave={onLeave} mediaError={mediaError} />
    </LiveKitRoom>
  );
};

const VoiceStatus = ({ icon, title, detail, action }: { icon: React.ReactNode; title: string; detail: string; action?: () => void }) => (
  <div className="min-h-[520px] rounded-2xl border border-gray-800 bg-[#07090E] flex items-center justify-center p-8">
    <div className="max-w-md text-center space-y-4">
      <div className="mx-auto w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center text-gt-cyan">{icon}</div>
      <h2 className="font-orbitron font-bold text-white">{title}</h2>
      <p className="text-sm text-gray-400">{detail}</p>
      {action && <button onClick={action} className="px-4 py-2 rounded-lg border border-gt-cyan text-gt-cyan hover:bg-cyan-950/40">Thử lại</button>}
    </div>
  </div>
);
