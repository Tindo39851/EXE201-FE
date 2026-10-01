import { apiClient } from '@/services/api-client';
import type { SocialPost, OnlinePlayer, TrendingTag, CreatePostDto } from '../types/social.types';

const MOCK_POSTS: SocialPost[] = [
  {
    id: 'mock_1',
    username: 'AXIOM_V',
    initial: 'A',
    avatarColor: 'bg-gt-red text-white border-gt-red/60',
    timezone: 'PST',
    tag: 'SIG',
    tagColor: 'text-gt-cyan border-gt-cyan/50 bg-gt-cyan/10',
    game: 'Valorant',
    time: '4m ago',
    content: "LFG 2 more for Radiant push. Need a Sentinel and a Duelist. Strict comms, no excuses. If your MMR ain't matching your attitude, move on.",
    likes: 112,
    liked: false,
    comments: 17,
    bottomGradient: 'from-gt-cyan via-white/50 to-transparent',
  },
  {
    id: 'mock_2',
    username: 'NULLSHIFT',
    initial: 'N',
    avatarColor: 'bg-gt-green text-black border-gt-green/60',
    timezone: 'IN',
    tag: 'TOURNAMENT',
    tagColor: 'text-gt-magenta border-gt-magenta/50 bg-gt-magenta/10',
    game: 'CS2',
    time: '21m ago',
    content: "NEON CIRCUIT OPEN bracket update — PSY went 3-0 in groups, NW is 2-1, heading into winners' semis tonight. Come watch, it's heating up.",
    likes: 184,
    liked: false,
    comments: 47,
    bottomGradient: 'from-gt-magenta via-white/50 to-transparent',
  },
  {
    id: 'mock_3',
    username: 'CR4WLER',
    initial: 'C',
    avatarColor: 'bg-gt-yellow text-black border-gt-yellow/60',
    timezone: 'DV1',
    tag: 'TIP',
    tagColor: 'text-gt-yellow border-gt-yellow/50 bg-gt-yellow/10',
    game: 'League of Legends',
    time: '28m ago',
    content: "Quick tip: if you're LFG and your profile has no roles listed, nobody will invite you. Fill out your card. 30 seconds, makes a huge difference.",
    likes: 1842,
    liked: false,
    comments: 178,
    bottomGradient: 'from-gt-yellow via-white/50 to-transparent',
  },
  {
    id: 'mock_4',
    username: 'GHOST_RIG',
    initial: 'G',
    avatarColor: 'bg-gt-orange text-white border-gt-orange/60',
    timezone: '',
    tag: 'SQUAD WIN',
    tagColor: 'text-gt-green border-gt-green/50 bg-gt-green/10',
    game: 'Overwatch 2',
    time: '5hr ago',
    content: "Finally found a proper 5 stack through GameTrust Squad Finder. 6 wins straight last night. This matchmaking actually works.",
    likes: 86,
    liked: false,
    comments: 71,
    bottomGradient: 'from-gt-green via-white/50 to-transparent',
  },
];

const MOCK_ONLINE_PLAYERS: OnlinePlayer[] = [
  { username: 'AXIOM_V', initial: 'A', color: 'border-gt-red text-gt-red', tag: 'LFG' },
  { username: 'NULLSHIFT', initial: 'N', color: 'border-gt-green text-gt-green', tag: 'LFG' },
  { username: 'VECTOR_X', initial: 'V', color: 'border-gt-purple text-gt-purple', tag: 'LFG' },
  { username: 'GHOST_RIG', initial: 'G', color: 'border-gt-orange text-gt-orange', tag: 'LFT' },
  { username: 'DARK_ECHO', initial: 'D', color: 'border-gt-blue text-gt-blue', tag: 'LFT' },
  { username: 'NEON_JADE', initial: 'N', color: 'border-gt-green text-gt-green', tag: 'LFG' },
  { username: 'SYNAPSE', initial: 'S', color: 'border-gt-magenta text-gt-magenta', tag: 'LFG' },
  { username: 'ZEPHYR_7', initial: 'Z', color: 'border-gt-cyan text-gt-cyan', tag: 'LFG' },
];

const MOCK_TRENDING_TAGS: TrendingTag[] = [
  { tag: '#PhantomSyndicateWin', count: '83', color: 'text-gt-magenta hover:text-white' },
  { tag: '#ClarkieMastery', count: '34', color: 'text-gt-cyan hover:text-white' },
  { tag: '#NeonCircuitOpen', count: '81', color: 'text-gt-yellow hover:text-white' },
  { tag: '#GameTrustSquads', count: '94', color: 'text-gt-green hover:text-white' },
  { tag: '#CS2MidStack', count: '85', color: 'text-gt-cyan hover:text-white' },
  { tag: '#ApexPredFT', count: '24', color: 'text-gt-magenta hover:text-white' },
];

export const socialService = {
  async getPosts(category?: string): Promise<SocialPost[]> {
    try {
      const response = await apiClient.get<SocialPost[]>('/social/feed', { params: { category } });
      return response.data;
    } catch {
      return MOCK_POSTS;
    }
  },

  async createPost(dto: CreatePostDto): Promise<SocialPost> {
    const response = await apiClient.post<SocialPost>('/social/posts', dto);
    return response.data;
  },

  async toggleLikePost(postId: string): Promise<{ liked: boolean; count: number }> {
    const response = await apiClient.post<{ liked: boolean; count: number }>(`/social/posts/${postId}/like`);
    return response.data;
  },

  async getOnlinePlayers(): Promise<OnlinePlayer[]> {
    try {
      const response = await apiClient.get<OnlinePlayer[]>('/social/online-players');
      return response.data;
    } catch {
      return MOCK_ONLINE_PLAYERS;
    }
  },

  async getTrendingTags(): Promise<TrendingTag[]> {
    try {
      const response = await apiClient.get<TrendingTag[]>('/social/trending-tags');
      return response.data;
    } catch {
      return MOCK_TRENDING_TAGS;
    }
  },
};
