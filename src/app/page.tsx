import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/layout/Hero';
import StatsTicker from '@/components/layout/StatsTicker';
import Footer from '@/components/layout/Footer';

// Features (Imported via Public API Boundaries)
import { SquadFinderSection } from '@/features/squads';
import { TournamentHubSection } from '@/features/tournaments';
import { ClanHubSection } from '@/features/clans';
import { ReputationSection } from '@/features/reputation';
import { SocialFeedSection } from '@/features/social';

export default function Home() {
  return (
    <main className="min-h-screen bg-gt-bg selection:bg-gt-cyan selection:text-black">
      {/* Shared Navigation */}
      <Navbar />

      {/* Hero Presentation */}
      <Hero />

      {/* Telemetry Ticker */}
      <StatsTicker />

      {/* Feature 1: Squad Finder (Live Matchmaking) */}
      <section className="px-4 md:px-8 lg:px-16 py-16">
        <SquadFinderSection />
      </section>

      {/* Feature 2 & 3: Tournament Hub + Clan Hub (Side by Side) */}
      <section className="px-4 md:px-8 lg:px-16 py-16 border-t border-gt-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <TournamentHubSection />
          <ClanHubSection />
        </div>
      </section>

      {/* Feature 4: Reputation Engine */}
      <section className="px-4 md:px-8 lg:px-16 py-16 border-t border-gt-border">
        <ReputationSection />
      </section>

      {/* Feature 5: Social Feed Network */}
      <section className="px-4 md:px-8 lg:px-16 py-16 border-t border-gt-border">
        <div className="max-w-7xl mx-auto">
          <SocialFeedSection />
        </div>
      </section>

      {/* Shared Footer */}
      <Footer />
    </main>
  );
}
