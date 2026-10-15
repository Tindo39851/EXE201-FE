'use client';

import React, { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { VoiceLoungesSection } from '@/features/voice-lounges';

export default function VoiceLoungesPage() {
  return (
    <div className="min-h-screen bg-gt-bg text-gt-text flex flex-col font-rajdhani selection:bg-gt-cyan selection:text-black">
      <Navbar />

      <main className="pt-20 pb-16 flex-1 w-full">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono text-sm text-gt-cyan">
            CONNECTING TO LIVEKIT VOICE SECTOR...
          </div>
        }>
          <VoiceLoungesSection />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
