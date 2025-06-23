import { useEffect, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useRealtime = (
  table: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  const { user } = useAuth();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user) return;

    const channelName = `${table}_${user.id}`;
    
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: filter || `user_id=eq.${user.id}`,
        },
        callback
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user, table, filter, callback]);

  return channelRef.current;
};

export const useDetectionRealtime = (callback: (payload: any) => void) => {
  return useRealtime('detections', callback);
};

export const useAchievementRealtime = (callback: (payload: any) => void) => {
  return useRealtime('user_achievements', callback);
};