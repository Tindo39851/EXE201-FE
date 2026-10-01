'use client';

import { useState, useEffect, useCallback } from 'react';
import { reputationService } from '../services/reputation.service';
import type { PlatformMetrics, ReputationReport, ReputationReview, TopRepPlayer } from '../types/reputation.types';

export function useReputation() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [reports, setReports] = useState<ReputationReport[]>([]);
  const [reviews, setReviews] = useState<ReputationReview[]>([]);
  const [topPlayers, setTopPlayers] = useState<TopRepPlayer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [metricsData, reportsData, reviewsData, topPlayersData] = await Promise.all([
        reputationService.getMetrics(),
        reputationService.getReports(),
        reputationService.getReviews(),
        reputationService.getTopPlayers(),
      ]);
      setMetrics(metricsData);
      setReports(reportsData);
      setReviews(reviewsData);
      setTopPlayers(topPlayersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reputation data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial client-side API hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  return {
    metrics,
    reports,
    reviews,
    topPlayers,
    isLoading,
    error,
    refetch: loadData,
  };
}
