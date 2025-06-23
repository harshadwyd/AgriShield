import { supabase } from './supabase';
import { Database } from '../types/database';

type Achievement = Database['public']['Tables']['achievements']['Row'];
type UserAchievement = Database['public']['Tables']['user_achievements']['Row'];

export class AchievementService {
  // Get all achievements
  static async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Get user's achievement progress
  static async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  // Update achievement progress
  static async updateAchievementProgress(
    userId: string,
    achievementId: string,
    progress: number
  ) {
    // Check if user achievement record exists
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    const isCompleted = progress >= 100;
    const now = new Date().toISOString();

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('user_achievements')
        .update({
          progress,
          completed: isCompleted,
          completed_at: isCompleted ? now : null,
          updated_at: now,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId,
          progress,
          completed: isCompleted,
          completed_at: isCompleted ? now : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Check and update achievements based on user activity
  static async checkAchievements(userId: string) {
    // Get user's detection count
    const { data: detections } = await supabase
      .from('detections')
      .select('detection_type, severity_level')
      .eq('user_id', userId);

    if (!detections) return;

    const totalScans = detections.length;
    const pestDetections = detections.filter(d => d.detection_type === 'pest').length;
    const diseaseDetections = detections.filter(d => d.detection_type === 'disease').length;
    const highSeverity = detections.filter(d => d.severity_level === 'High').length;

    // Define achievement checks
    const achievementChecks = [
      {
        id: 'first_scan',
        progress: Math.min(100, (totalScans / 1) * 100),
      },
      {
        id: 'scan_master',
        progress: Math.min(100, (totalScans / 10) * 100),
      },
      {
        id: 'detection_expert',
        progress: Math.min(100, (totalScans / 50) * 100),
      },
      {
        id: 'pest_hunter',
        progress: Math.min(100, (pestDetections / 20) * 100),
      },
      {
        id: 'disease_detective',
        progress: Math.min(100, (diseaseDetections / 15) * 100),
      },
    ];

    // Update achievements
    const updates = await Promise.all(
      achievementChecks.map(check =>
        this.updateAchievementProgress(userId, check.id, check.progress)
      )
    );

    return updates;
  }

  // Get achievement leaderboard
  static async getLeaderboard(limit: number = 10) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        user_id,
        profiles:user_id (
          full_name,
          farm_name
        )
      `)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Group by user and count completed achievements
    const leaderboard = data.reduce((acc, achievement) => {
      const userId = achievement.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          user_id: userId,
          profile: achievement.profiles,
          completed_count: 0,
        };
      }
      acc[userId].completed_count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(leaderboard)
      .sort((a, b) => b.completed_count - a.completed_count)
      .slice(0, limit);
  }
}