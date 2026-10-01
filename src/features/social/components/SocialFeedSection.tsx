'use client';

import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Radio, TrendingUp, Send } from 'lucide-react';
import { useSocialFeed } from '../hooks/useSocialFeed';

const TABS = ['ALL', 'LFG', 'TOURNAMENT', 'RECRUIT', 'ACHIEVEMENT'];

export const SocialFeedSection: React.FC = () => {
  const {
    posts,
    onlinePlayers,
    trendingTags,
    activeTab,
    setActiveTab,
    toggleLike,
    createBroadcast,
    isPosting,
  } = useSocialFeed();

  const [broadcastText, setBroadcastText] = useState('');

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    createBroadcast(broadcastText);
    setBroadcastText('');
  };

  return (
    <div className="w-full text-gt-text">
      
      {/* Header section */}
      <div className="mb-8 pb-3 border-b border-gt-border/70 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-gt-green section-label mb-1">
            SECTION_05 // COMMUNITY NETWORK
          </span>
          <h2 className="font-orbitron text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
            SOCIAL FEED
            <Radio size={18} className="text-gt-magenta animate-pulse" />
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border cyber-cut-sm transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? 'bg-gt-cyan text-black border-gt-cyan font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-[#0D121B] border-gt-border text-gt-text-dim hover:border-gt-cyan/50 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column - Main Feed */}
        <div className="w-full lg:w-[68%] flex flex-col gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative bg-[#0D121B] border border-gt-border/90 hover:border-gt-cyan/40 rounded-sm overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] group"
            >
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${post.bottomGradient} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
              
              <div className="flex items-start justify-between mb-3.5">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-sm border ${post.avatarColor} cyber-cut-sm flex items-center justify-center font-orbitron font-extrabold text-sm`}>
                      {post.initial}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-gt-green rounded-full border-2 border-gt-bg shadow-[0_0_6px_#00FF66]"></div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-orbitron font-bold text-white text-sm group-hover:text-gt-cyan transition-colors">
                        {post.username}
                      </span>
                      {post.timezone && <span className="font-mono text-xs text-gt-text-dim">[{post.timezone}]</span>}
                      <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 border rounded-sm uppercase tracking-wider ${post.tagColor}`}>
                        {post.tag}
                      </span>
                    </div>

                    {post.game && (
                      <span className="font-mono text-xs text-gt-text-dim mt-0.5">
                        {post.game}
                      </span>
                    )}
                  </div>
                </div>
                
                <span className="font-mono text-xs text-gt-text-dim whitespace-nowrap">{post.time}</span>
              </div>

              <p className="font-rajdhani text-sm text-gt-text mb-4 leading-relaxed pl-13">
                {post.content}
              </p>

              <div className="flex items-center gap-6 font-mono text-xs text-gt-text-dim pl-13 pt-2 border-t border-gt-border/40">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    post.liked ? 'text-gt-magenta' : 'hover:text-gt-magenta'
                  }`}
                >
                  <Heart size={14} className={post.liked ? 'fill-current' : ''} />
                  <span>{post.likes}</span>
                </button>

                <button className="flex items-center gap-1.5 hover:text-gt-cyan transition-colors cursor-pointer">
                  <MessageSquare size={14} />
                  <span>{post.comments}</span>
                </button>

                <button className="flex items-center gap-1.5 hover:text-gt-green transition-colors ml-auto cursor-pointer">
                  <Share2 size={14} />
                  <span>SHARE</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[32%] flex flex-col gap-5">
          
          {/* ONLINE NOW */}
          <div className="bg-[#0D121B] border border-gt-border rounded-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gt-border/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gt-green animate-pulse shadow-[0_0_8px_#00FF66]"></span>
                <span className="font-mono text-xs text-gt-text-dim uppercase tracking-wider font-semibold">ONLINE NOW</span>
              </div>
              <span className="font-orbitron text-gt-cyan font-bold text-xs">1,203 LIVE</span>
            </div>
            
            <div className="flex flex-col divide-y divide-gt-border/30">
              {onlinePlayers.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 group hover:bg-[#121824] px-1 rounded-sm transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-sm border ${player.color} bg-gt-bg flex items-center justify-center font-orbitron font-bold text-[9px]`}>
                      {player.initial}
                    </div>
                    <span className="font-mono text-xs text-white group-hover:text-gt-cyan transition-colors">{player.username}</span>
                    <span className="font-mono text-[10px] text-gt-text-dim px-1 border border-gt-border rounded-sm">{player.tag}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gt-green"></div>
                </div>
              ))}
            </div>
          </div>

          {/* TRENDING */}
          <div className="bg-[#0D121B] border border-gt-border rounded-sm p-4 sm:p-5">
            <h3 className="font-orbitron text-xs font-bold text-gt-magenta mb-3.5 flex items-center gap-1.5 uppercase tracking-wider">
              <TrendingUp size={14} /> TRENDING
            </h3>
            <div className="flex flex-col gap-2.5 font-mono text-xs">
              {trendingTags.map((tag, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
                  <span className={`${tag.color} transition-colors font-semibold`}>{tag.tag}</span>
                  <span className="text-gt-text-dim text-[11px]">#{idx + 1} ({tag.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* BROADCAST LFG */}
          <form onSubmit={handleBroadcastSubmit} className="bg-[#0D121B] border border-gt-border rounded-sm p-4 sm:p-5">
            <h3 className="font-orbitron text-xs font-bold text-gt-yellow mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <Radio size={14} className="text-gt-yellow animate-ping" /> BROADCAST LFG
            </h3>

            <textarea 
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              className="w-full h-20 bg-[#070A10] border border-gt-border p-3 font-mono text-xs text-white placeholder-gt-text-dim focus:border-gt-magenta focus:outline-none resize-none mb-3 rounded-sm transition-colors"
              placeholder="Post your LFG status, game, rank, or scrim request..."
            ></textarea>

            <button
              type="submit"
              disabled={isPosting}
              className="w-full bg-gradient-to-r from-gt-magenta to-pink-600 hover:from-gt-magenta hover:to-gt-purple text-white font-orbitron text-xs uppercase py-2.5 glow-magenta cyber-cut shimmer-effect font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75 cursor-pointer"
            >
              <Send size={13} />
              <span>{isPosting ? 'BROADCASTING...' : 'BROADCAST'}</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
