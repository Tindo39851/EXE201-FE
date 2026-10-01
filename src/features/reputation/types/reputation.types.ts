export interface PlatformMetrics {
  avgRepScore: number;
  squadsFormed: number;
  activeNow: number;
  totalSessions: number;
  toxicityRate: number;
  successRate: number;
}

export interface MetricRing {
  label: string;
  value: number;
  color: string;
  stroke: string;
  shadow: string;
}

export interface ReputationReport {
  id: string;
  type: string;
  user: string;
  status: string;
  badgeColor: 'red' | 'yellow' | 'cyan';
  timestamp?: string;
}

export interface ReputationReview {
  id: string;
  user: string;
  stars: number;
  quote: string;
  author: string;
  time: string;
  badge: string;
  badgeColor: 'cyan' | 'magenta' | 'green';
}

export interface TopRepPlayer {
  rank: number;
  name: string;
  game: string;
  tier: string;
  rep: string;
  color: string;
}
