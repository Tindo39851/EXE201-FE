'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, ChevronRight, Hash } from 'lucide-react';
import type { ChatMessage } from '../types/voice.types';

interface RoomChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

export const RoomChat: React.FC<RoomChatProps> = ({ messages, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const previousLastMessageIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const lastMessageId = messages.at(-1)?.id;
    if (lastMessageId === previousLastMessageIdRef.current) return;

    const scrollArea = scrollAreaRef.current;
    if (scrollArea && shouldAutoScrollRef.current) {
      scrollArea.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: previousLastMessageIdRef.current ? 'smooth' : 'auto',
      });
    }
    previousLastMessageIdRef.current = lastMessageId;
  }, [messages]);

  const handleChatScroll = () => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;
    const distanceFromBottom = scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 48;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="w-80 lg:w-96 bg-[#0B0F17]/95 border-l border-gray-800/80 flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/80 bg-[#0B0F17]">
        <div className="flex items-center gap-2 text-gray-200">
          <Hash className="w-4 h-4 text-gray-500" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold">
            room-chat
          </span>
        </div>
        <button className="text-gray-500 hover:text-gray-300 p-1 rounded transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollAreaRef}
        onScroll={handleChatScroll}
        className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-800"
      >
        {messages.map(msg => {
          if (msg.isSystem) {
            return (
              <div
                key={msg.id}
                className="text-center text-[11px] font-mono text-gray-500 py-1 italic"
              >
                {msg.content}
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-start gap-2.5 group">
              {/* Avatar circle */}
              <div className="w-7 h-7 rounded-full bg-cyan-950/60 border border-gt-cyan/40 text-gt-cyan flex items-center justify-center text-xs font-orbitron font-bold shrink-0 mt-0.5">
                {msg.authorAvatarLetter || (msg.authorUsername || 'U')[0].toUpperCase()}
              </div>

              {/* Message details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="font-orbitron font-bold text-xs text-gt-cyan tracking-wider">
                    {msg.authorUsername}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                    {msg.createdAt}
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-rajdhani font-medium leading-relaxed break-words">
                  {msg.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-gray-800/80 bg-[#0B0F17]">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="w-full bg-[#121824] border border-gray-800 focus:border-gt-cyan/60 rounded-xl pl-4 pr-20 py-2.5 text-xs text-white placeholder-gray-500 font-rajdhani outline-none transition-colors"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-800/60 transition-colors"
            >
              <Smile className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="text-gt-cyan hover:text-[#33f3ff] p-1.5 rounded-lg hover:bg-cyan-950/40 transition-colors disabled:opacity-30 disabled:hover:text-gt-cyan"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
