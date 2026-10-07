import { apiClient } from '@/services/api-client';
import type { PlatformMetrics, ReputationReport, ReputationReview, TopRepPlayer, CreateReviewDto, CreateReportDto } from '../types/reputation.types';

const MOCK_METRICS: PlatformMetrics = {
  avgRepScore: 9.1,
  squadsFormed: 62100,
  activeNow: 1203,
  totalSessions: 284103,
  toxicityRate: 0.4,
  successRate: 97.8,
};

const MOCK_REPORTS: ReputationReport[] = [
  { id: '#RPT_1041', type: 'TOXICITY', user: 'AXIOM_V5', status: 'TEMP BANNED', badgeColor: 'red' },
  { id: '#RPT_1040', type: 'AFK', user: 'NULL_FEED', status: 'PENDING', badgeColor: 'yellow' },
  { id: '#RPT_1039', type: 'CHEATING', user: 'BOT_WAVE1', status: 'CONFIRMED', badgeColor: 'red' },
  { id: '#RPT_1038', type: 'SMURFING', user: 'SMURF_X18', status: 'MONITOR', badgeColor: 'cyan' },
];

const MOCK_REVIEWS: ReputationReview[] = [
  { id: 'rev_1', user: 'AXIOM_V', stars: 5, quote: "Best IGL I've squadded with on this platform. Clear, calm, wins.", author: 'NULLSHIFT', time: '1h ago', badge: 'Small Team', badgeColor: 'cyan' },
  { id: 'rev_2', user: 'CR4WLER', stars: 5, quote: 'Challenger jungler carrying comms constantly. Highly recommend duoing.', author: 'VECTOR_X', time: '3h ago', badge: 'Clutch Player', badgeColor: 'magenta' },
  { id: 'rev_3', user: 'SYNAPSE', stars: 4, quote: 'Great rotation awareness, a bit passive in lane but good overall.', author: 'GHOST_RIG', time: '5h ago', badge: 'Team Player', badgeColor: 'green' },
];

const MOCK_TOP_PLAYERS: TopRepPlayer[] = [
  { rank: 1, name: 'AXIOM_V', game: 'Valorant', tier: 'Radiant', rep: '9.9', color: 'text-gt-cyan' },
  { rank: 2, name: 'NULLSHIFT', game: 'CS2', tier: 'Global Elite', rep: '9.8', color: 'text-gt-green' },
  { rank: 3, name: 'CR4WLER', game: 'League of Legends', tier: 'Challenger', rep: '9.7', color: 'text-gt-blue' },
  { rank: 4, name: 'VECTOR_X', game: 'Apex Legends', tier: 'Predator', rep: '9.6', color: 'text-gt-purple' },
];

export const reputationService = {
  async getMetrics(): Promise<PlatformMetrics> {
    try {
      const response = await apiClient.get<PlatformMetrics>('/reputation/metrics');
      return response.data;
    } catch {
      return MOCK_METRICS;
    }
  },

  async getReports(): Promise<ReputationReport[]> {
    try {
      const response = await apiClient.get<ReputationReport[]>('/reputation/reports');
      return response.data;
    } catch {
      return MOCK_REPORTS;
    }
  },

  async getReviews(): Promise<ReputationReview[]> {
    try {
      const response = await apiClient.get<ReputationReview[]>('/reputation/reviews');
      return response.data;
    } catch {
      return MOCK_REVIEWS;
    }
  },

  async getTopPlayers(): Promise<TopRepPlayer[]> {
    try {
      const response = await apiClient.get<TopRepPlayer[]>('/reputation/top-players');
      return response.data;
    } catch {
      return MOCK_TOP_PLAYERS;
    }
  },

  async submitReview(dto: CreateReviewDto): Promise<ReputationReview> {
    try {
      const response = await apiClient.post<ReputationReview>('/reputation/reviews', dto);
      return response.data;
    } catch (err: any) {
      if (err?.statusCode === 401) {
        throw new Error('Please sign in to submit a review');
      }
      throw new Error(err?.message || 'Failed to submit review');
    }
  },

  async submitReport(dto: CreateReportDto): Promise<ReputationReport> {
    try {
      const response = await apiClient.post<ReputationReport>('/reputation/reports', dto);
      return response.data;
    } catch (err: any) {
      if (err?.statusCode === 401) {
        throw new Error('Please sign in to submit a report');
      }
      throw new Error(err?.message || 'Failed to submit report');
    }
  },
};
