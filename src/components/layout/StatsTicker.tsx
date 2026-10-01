import React from 'react';

const stats = [
  { label: 'PLAYERS ONLINE', value: '62,100', color: 'text-gt-cyan' },
  { label: 'REP SCORE AVG', value: '9.1/10', color: 'text-gt-green' },
  { label: 'SESSIONS TODAY', value: '14,892', color: 'text-gt-yellow' },
  { label: 'CLANS ACTIVE', value: '347', color: 'text-gt-cyan' },
  { label: 'PLATFORM UPTIME', value: '99.97%', color: 'text-gt-green' },
  { label: 'TOXICITY RATE', value: '0.4%', color: 'text-gt-red' },
  { label: 'TEAMS FORMED', value: '8,441', color: 'text-gt-magenta' },
];

export default function StatsTicker() {
  return (
    <div className="w-full bg-[#080D15] border-y border-gt-border/80 overflow-hidden py-3 relative shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gt-bg to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gt-bg to-transparent z-10 pointer-events-none"></div>

      <div className="flex whitespace-nowrap animate-ticker font-mono text-xs uppercase tracking-widest text-gt-text-dim items-center select-none">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            {stats.map((stat, j) => (
              <div key={j} className="flex items-center mx-5 group cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-gt-cyan/50 mr-2 group-hover:bg-gt-cyan group-hover:scale-125 transition-all"></span>
                <span className="text-gt-text-dim mr-2 group-hover:text-white transition-colors">{stat.label}:</span>
                <span className={`font-bold ${stat.color} tracking-wider font-orbitron text-[11px]`}>{stat.value}</span>
                <span className="text-gt-border-bright mx-4 text-xs font-mono">◆</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
