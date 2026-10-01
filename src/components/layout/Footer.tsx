import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gt-border px-4 md:px-8 lg:px-16 py-12 bg-[#06080D]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-gt-cyan to-gt-magenta rotate-45 rounded-sm flex items-center justify-center">
                <span className="text-white font-orbitron text-xs font-bold -rotate-45">GT</span>
              </div>
              <span className="font-orbitron text-lg font-bold text-white tracking-wider">GAMETRUST</span>
            </div>
            <p className="text-gt-text-dim text-xs font-mono leading-relaxed">
              THE PREMIER COMPETITIVE<br />PLAYER MATCHING PLATFORM
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-orbitron text-xs font-bold text-gt-cyan mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 font-mono text-xs text-gt-text-dim">
              <li><Link href="/squad-finder" className="hover:text-gt-cyan transition-colors">Squad Finder</Link></li>
              <li><Link href="/tournament" className="hover:text-gt-cyan transition-colors">Tournaments</Link></li>
              <li><Link href="/clan" className="hover:text-gt-cyan transition-colors">Clans</Link></li>
              <li><Link href="/reputation" className="hover:text-gt-cyan transition-colors">Reputation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-orbitron text-xs font-bold text-gt-cyan mb-4 uppercase tracking-wider">Games</h4>
            <ul className="space-y-2 font-mono text-xs text-gt-text-dim">
              <li className="hover:text-gt-cyan cursor-pointer transition-colors">Liên Quân Mobile</li>
              <li className="hover:text-gt-cyan cursor-pointer transition-colors">Free Fire</li>
              <li className="hover:text-gt-cyan cursor-pointer transition-colors">Valorant</li>
              <li className="hover:text-gt-cyan cursor-pointer transition-colors">Counter-Strike 2</li>
              <li className="hover:text-gt-cyan cursor-pointer transition-colors">League of Legends</li>
            </ul>
          </div>

          <div>
            <h4 className="font-orbitron text-xs font-bold text-gt-cyan mb-4 uppercase tracking-wider">Network</h4>
            <ul className="space-y-2 font-mono text-xs text-gt-text-dim">
              <li className="hover:text-gt-cyan cursor-pointer transition-colors">Discord Server</li>
              <li className="hover:text-gt-cyan cursor-pointer transition-colors">Twitter / X</li>
              <li className="hover:text-gt-cyan cursor-pointer transition-colors">API Documentation</li>
              <li className="hover:text-gt-cyan cursor-pointer transition-colors">Contact Support</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gt-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-gt-text-dim">
            © 2026 GAMETRUST ENTERPRISE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 font-mono text-xs text-gt-text-dim">
            <span className="hover:text-gt-cyan cursor-pointer transition-colors">PRIVACY POLICY</span>
            <span className="hover:text-gt-cyan cursor-pointer transition-colors">TERMS OF SERVICE</span>
            <span className="hover:text-gt-cyan cursor-pointer transition-colors">SECURITY</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gt-green animate-pulse"></div>
            <span className="font-mono text-xs text-gt-green">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
