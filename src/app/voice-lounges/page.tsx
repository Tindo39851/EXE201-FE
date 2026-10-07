'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { VoiceLoungesSection } from '@/features/voice-lounges';

export default function VoiceLoungesPage() {
  return (
    <div className="min-h-screen bg-gt-bg text-gt-text flex flex-col font-rajdhani selection:bg-gt-cyan selection:text-black">
      <Navbar />

      <main className="pt-20 pb-16 flex-1 w-full">
        <VoiceLoungesSection />
      </main>

      <Footer />
    </div>
  );
}
