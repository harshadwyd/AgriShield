import { useState, useEffect } from 'react';
import { DetectionService } from '../lib/detections';
import { Database } from '../types/database';
import { useAuth } from './useAuth';

type Detection = Database['public']['Tables']['detections']['Row'];

export const useDetections = (options?: {
  limit?: number;
  type?: string;
  severity?: string;
  autoRefresh?: boolean;
}) => {
  const { user } = useAuth();
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const {
    limit = 20,
    type,
    severity,
    autoRefresh = false
  } = options || {};

  const fetchDetections = async (reset = false) => {
    if (!user) return;

    try {
      setError(null);
      if (reset) {
        setLoading(true);
        setOffset(0);
      }

      const currentOffset = reset ? 0 : offset;
      const data = await DetectionService.getUserDetections(user.id, {
        limit,
        offset: currentOffset,
        type,
        severity,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      if (reset) {
        setDetections(data);
      } else {
        setDetections(prev => [...prev, ...data]);
      }

      setHasMore(data.length === limit);
      setOffset(currentOffset + data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch detections');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchDetections(false);
    }
  };

  const refresh = () => {
    fetchDetections(true);
  };

  const createDetection = async (detectionData: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newDetection = await DetectionService.createDetection({
        ...detectionData,
        user_id: user.id,
      });

      setDetections(prev => [newDetection, ...prev]);
      return newDetection;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create detection';
      setError(errorMessage);
      throw err;
    }
  };

  const updateDetection = async (id: string, updates: any) => {
    try {
      const updatedDetection = await DetectionService.updateDetection(id, updates);
      setDetections(prev =>
        prev.map(detection =>
          detection.id === id ? updatedDetection : detection
        )
      );
      return updatedDetection;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update detection';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteDetection = async (id: string) => {
    try {
      await DetectionService.deleteDetection(id);
      setDetections(prev => prev.filter(detection => detection.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete detection';
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchDetections(true);
    }
  }, [user, type, severity]);

  useEffect(() => {
    if (autoRefresh && user) {
      const interval = setInterval(() => {
        fetchDetections(true);
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, user]);

  return {
    detections,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    createDetection,
    updateDetection,
    deleteDetection,
  };
};