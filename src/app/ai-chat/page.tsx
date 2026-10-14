'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { getApiErrorMessage } from '@/services/api-client';
import { aiChatService } from '@/features/ai-chat/services/ai-chat.service';
import type {
  AiChatMessage,
  AiStatusResponse,
} from '@/features/ai-chat/types/ai-chat.types';

const WELCOME_MESSAGE: AiChatMessage = {
  role: 'assistant',
  content:
    'Chào bạn! Mình là GameTrust AI Coach. Mình sẵn sàng hỗ trợ bạn về chiến thuật leo rank, phân tích kèo đấu, luyện phản xạ, phối hợp đồng đội hoặc trao đổi về luật thi đấu trong game.',
};

const SUGGESTIONS = [
  'Lập kế hoạch luyện Valorant 7 ngày cho người mới',
  'Làm sao kiểm soát cảm xúc khi đồng đội toxic?',
  'Gợi ý cách chia role cho team 5 người đánh giải',
  'Darius nếu solo với Trundle full item trong LMHT thì ai có tỉ lệ thắng cao hơn?',
];

export default function AiChatPage() {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<AiChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [status, setStatus] = useState<AiStatusResponse | null>(null);
  const messagePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      setStatus(null);
      return;
    }
    aiChatService
      .getStatus()
      .then(setStatus)
      .catch(() => setStatus(null));
  }, [user]);

  useEffect(() => {
    const panel = messagePanelRef.current;
    if (panel) panel.scrollTop = panel.scrollHeight;
  }, [messages, sending]);

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || sending || !user) return;

    const userMessage: AiChatMessage = { role: 'user', content };
    const conversation = [...messages, userMessage].slice(-20);
    setMessages(conversation);
    setInput('');
    setChatError(null);
    setSending(true);

    try {
      const response = await aiChatService.chat(conversation);
      setMessages((current) => [
        ...current,
        { role: 'assistant' as const, content: response.reply },
      ].slice(-20));
      setStatus({ configured: true, model: response.model });
    } catch (requestError) {
      setChatError(
        getApiErrorMessage(requestError, 'Không thể kết nối AI. Vui lòng kiểm tra lại cấu hình.')
      );
    } finally {
      setSending(false);
    }
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput('');
    setChatError(null);
  };

  return (
    <div className="min-h-screen bg-[#06090F] text-gt-text flex flex-col font-rajdhani selection:bg-gt-cyan selection:text-black">
      <Navbar />

      <main className="pt-24 pb-16 flex-1 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Banner */}
          <section className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-gt-cyan font-mono text-xs uppercase tracking-[0.25em] mb-2">
                <Sparkles size={14} /> AI Powered Ecosystem // GameTrust
              </div>
              <h1 className="font-orbitron text-3xl md:text-5xl font-black text-white tracking-tight">
                GAMETRUST <span className="text-gt-cyan">AI COACH</span>
              </h1>
              <p className="mt-2 max-w-2xl text-gt-text-dim text-sm md:text-base">
                Trợ lý chiến thuật thông minh: Tư vấn combo, phân tích kèo đấu, giáo án luyện tập và phối hợp đồng đội.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 border border-gt-border bg-gt-bg-card rounded-sm font-mono text-xs shadow-sm">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status?.configured ? 'bg-gt-green animate-pulse' : 'bg-yellow-400'
                  }`}
                />
                <span className="text-gt-text-dim">
                  {status
                    ? `${status.configured ? 'OPENAI ONLINE' : 'AI READY'} · ${status.model}`
                    : 'AI ENGINE READY'}
                </span>
              </div>
            </div>
          </section>

          {/* AI COACH CHAT SECTION */}
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 animate-fadeIn">
            <div className="min-h-[580px] h-[calc(100vh-260px)] bg-gt-bg-card border border-gt-border rounded-sm overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.04)]">
              <header className="h-14 px-5 border-b border-gt-border flex items-center justify-between bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-gt-cyan/60 bg-gt-cyan/10 flex items-center justify-center text-gt-cyan rounded-sm">
                    <Bot size={18} />
                  </div>
                  <div>
                    <div className="font-orbitron text-sm font-bold text-white">GAMETRUST COACH</div>
                    <div className="font-mono text-[10px] text-gt-green uppercase tracking-widest">
                      Online · Chat Mode
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetChat}
                  className="p-2 text-gt-text-dim hover:text-gt-red border border-transparent hover:border-gt-red/40 rounded-sm transition-colors cursor-pointer"
                  title="Xóa đoạn chat làm lại"
                >
                  <Trash2 size={16} />
                </button>
              </header>

              {!authLoading && !user ? (
                <div className="flex-1 flex items-center justify-center p-8 text-center">
                  <div className="max-w-md">
                    <ShieldCheck size={44} className="mx-auto text-gt-cyan mb-4" />
                    <h2 className="font-orbitron text-xl font-bold text-white mb-2">ĐĂNG NHẬP ĐỂ CHAT</h2>
                    <p className="text-gt-text-dim text-sm">
                      AI Coach được bảo vệ bởi tài khoản GameTrust. Hãy đăng nhập ở thanh điều hướng để bắt đầu.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div ref={messagePanelRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={`${message.role}-${index}`}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="shrink-0 w-8 h-8 border border-gt-cyan/50 bg-gt-cyan/10 flex items-center justify-center text-gt-cyan rounded-sm">
                            <Bot size={16} />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] px-4 py-3 rounded-sm whitespace-pre-wrap leading-relaxed text-sm ${
                            message.role === 'user'
                              ? 'bg-gt-cyan text-black font-semibold'
                              : 'bg-black/40 border border-gt-border text-gt-text'
                          }`}
                        >
                          {message.content}
                        </div>
                        {message.role === 'user' && (
                          <div className="shrink-0 w-8 h-8 border border-gt-magenta/50 bg-gt-magenta/10 flex items-center justify-center text-gt-magenta rounded-sm">
                            <User size={16} />
                          </div>
                        )}
                      </div>
                    ))}

                    {sending && (
                      <div className="flex items-center gap-3 text-gt-text-dim">
                        <div className="w-8 h-8 border border-gt-cyan/50 bg-gt-cyan/10 flex items-center justify-center text-gt-cyan rounded-sm">
                          <Loader2 size={16} className="animate-spin" />
                        </div>
                        <span className="font-mono text-xs tracking-wider">AI đang suy nghĩ...</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gt-border p-4 bg-black/20">
                    {chatError && (
                      <div className="mb-3 px-3 py-2 border border-gt-red/40 bg-gt-red/10 text-gt-red text-xs rounded-sm">
                        {chatError}
                      </div>
                    )}
                    <form onSubmit={sendMessage} className="flex gap-3">
                      <textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value.slice(0, 4000))}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            event.currentTarget.form?.requestSubmit();
                          }
                        }}
                        placeholder="Hỏi AI Coach về chiến thuật, combo, phản xạ..."
                        rows={2}
                        disabled={!user || sending}
                        className="flex-1 resize-none bg-gt-bg border border-gt-border focus:border-gt-cyan outline-none rounded-sm px-4 py-2.5 text-sm text-white placeholder:text-gt-text-dim disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={!user || sending || !input.trim()}
                        className="w-14 bg-gt-cyan text-black flex items-center justify-center rounded-sm hover:shadow-[0_0_16px_rgba(0,240,255,0.55)] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                        title="Gửi tin nhắn"
                      >
                        {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      </button>
                    </form>
                    <div className="mt-2 font-mono text-[10px] text-gt-text-dim text-right">
                      Enter để gửi · Shift+Enter để xuống dòng
                    </div>
                  </div>
                </>
              )}
            </div>

            <aside className="space-y-4">
              <div className="bg-gt-bg-card border border-gt-border p-4 rounded-sm">
                <h2 className="font-orbitron text-xs font-bold text-white uppercase tracking-wider mb-3">
                  💡 Gợi Ý Câu Hỏi
                </h2>
                <div className="space-y-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setInput(suggestion)}
                      disabled={!user || sending}
                      className="w-full text-left p-2.5 border border-gt-border hover:border-gt-cyan/60 bg-black/20 hover:bg-gt-cyan/5 text-xs text-gt-text-dim hover:text-white rounded-sm transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gt-bg-card border border-gt-border p-4 rounded-sm">
                <div className="flex items-center gap-2 text-gt-green mb-2">
                  <ShieldCheck size={16} />
                  <span className="font-orbitron text-xs font-bold">SECURE PROXY</span>
                </div>
                <p className="text-xs text-gt-text-dim leading-relaxed">
                  API key được bảo mật an toàn ở backend. Mọi trao đổi đều qua bộ lọc kiểm duyệt nội dung an toàn.
                </p>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
