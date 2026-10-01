/**
 * Public API Boundary for Squads Feature
 * Follows Rule 8.3: Other features and pages must import through this index file.
 */

export * from './types/squad.types';
export * from './services/squad.service';
export * from './hooks/useSquads';
export * from './hooks/useSquadMatchmaking';
export { PlayerCard } from './components/PlayerCard';
export { SquadFinderSection } from './components/SquadFinderSection';
export { DiscordLobby } from './components/DiscordLobby';
