'use client';

import { useState, useEffect, useCallback } from 'react';
import { clanService } from '../services/clan.service';
import type { Clan, ClanFilterDto } from '../types/clan.types';

export function useClans() {
  const [clans, setClans] = useState<Clan[]>([]);
  const [selectedClan, setSelectedClan] = useState<Clan | null>(null);
  const [activeTier, setActiveTier] = useState<string>('ALL');
  const [activeRegion, setActiveRegion] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClans = useCallback(async (tier: string, region: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: ClanFilterDto = { tier, region };
      const data = await clanService.getClans(filters);
      setClans(data);
      if (data.length > 0 && (!selectedClan || !data.some(c => c.id === selectedClan.id))) {
        setSelectedClan(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clans');
    } finally {
      setIsLoading(false);
    }
  }, [selectedClan]);

  useEffect(() => {
    // Data loading is intentionally triggered by filter changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClans(activeTier, activeRegion);
  }, [activeTier, activeRegion, fetchClans]);

  const selectClanById = (id: number) => {
    const found = clans.find(c => c.id === id);
    if (found) {
      setSelectedClan(found);
    }
  };

  return {
    clans,
    selectedClan,
    activeTier,
    activeRegion,
    isLoading,
    error,
    setActiveTier,
    setActiveRegion,
    selectClanById,
    refetch: () => fetchClans(activeTier, activeRegion),
  };
}
