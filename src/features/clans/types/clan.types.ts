export type FactionTier = 'ELITE' | 'ALPHA' | 'BETA' | 'GAMMA';

export interface Clan {
  id: number;
  name: string;
  tag: string;
  members: number;
  rating: string;
  tier: FactionTier;
  color: string;
  wins: number;
  founded: string;
  region: string;
  desc: string;
  games: string[];
  req: string;
}

export interface ClanFilterDto {
  tier?: string;
  region?: string;
}
