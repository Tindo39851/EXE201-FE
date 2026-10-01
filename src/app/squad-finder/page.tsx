'use client';

import Navbar from '@/components/layout/Navbar';
import { DiscordLobby } from '@/features/squads';

export default function SquadFinderPage() {
  return (
    <div className="min-h-screen bg-gt-bg text-gt-text flex flex-col font-rajdhani selection:bg-gt-cyan selection:text-black">
      <Navbar />
      <div className="flex-1 flex pt-16">
        <DiscordLobby />
      </div>
    </div>
  );
}
