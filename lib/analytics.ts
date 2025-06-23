import { supabase } from './supabase';
import { Database } from '../types/database';

type FarmAnalytics = Database['public']['Tables']['farm_analytics']['Row'];

export class AnalyticsService {
  // Record daily analytics
  static async recordDailyAnalytics(userId: string, date: string) {
    // Get detections for the day
    const { data: detections } = await supabase
      .from('detections')
      .select('detection_type, severity_level, treatment_applied')
      .eq('user_id', userId)
      .gte('created_at', `${date}T00:00:00.000Z`)
      .lt('created_at', `${date}T23:59:59.999Z`);

    if (!detections) return;

    const analytics = {
      total_scans: detections.length,
      pest_detections: detections.filter(d => d.detection_type === 'pest').length,
      disease_detections: detections.filter(d => d.detection_type === 'disease').length,
      high_severity_count: detections.filter(d => d.severity_level === 'High').length,
      medium_severity_count: detections.filter(d => d.severity_level === 'Medium').length,
      low_severity_count: detections.filter(d => d.severity_level === 'Low').length,
      treatments_applied: detections.filter(d => d.treatment_applied).length,
    };

    // Upsert analytics record
    const { data, error } = await supabase
      .from('farm_analytics')
      .upsert({
        user_id: userId,
        date,
        ...analytics,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get analytics for date range
  static async getAnalytics(
    userId: string,
    dateRange: { from: string; to: string }
  ): Promise<FarmAnalytics[]> {
    const { data, error } = await supabase
      .from('farm_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', dateRange.from)
      .lte('date', dateRange.to)
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Get summary statistics
  static async getSummaryStats(userId: string, days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const { data, error } = await supabase
      .from('farm_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        totalScans: 0,
        totalPests: 0,
        totalDiseases: 0,
        totalTreatments: 0,
        averageScansPerDay: 0,
        trendData: [],
      };
    }

    const summary = data.reduce(
      (acc, day) => ({
        totalScans: acc.totalScans + day.total_scans,
        totalPests: acc.totalPests + day.pest_detections,
        totalDiseases: acc.totalDiseases + day.disease_detections,
        totalTreatments: acc.totalTreatments + day.treatments_applied,
      }),
      { totalScans: 0, totalPests: 0, totalDiseases: 0, totalTreatments: 0 }
    );

    return {
      ...summary,
      averageScansPerDay: summary.totalScans / days,
      trendData: data.map(day => ({
        date: day.date,
        scans: day.total_scans,
        pests: day.pest_detections,
        diseases: day.disease_detections,
      })),
    };
  }

  // Get global community statistics
  static async getCommunityStats() {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1000);

    const { data: detections, error: detectionsError } = await supabase
      .from('detections')
      .select('detection_type, severity_level, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .limit(10000);

    if (profilesError || detectionsError) {
      throw profilesError || detectionsError;
    }

    const stats = {
      totalUsers: profiles?.length || 0,
      totalDetections: detections?.length || 0,
      pestDetections: detections?.filter(d => d.detection_type === 'pest').length || 0,
      diseaseDetections: detections?.filter(d => d.detection_type === 'disease').length || 0,
      highSeverityIssues: detections?.filter(d => d.severity_level === 'High').length || 0,
    };

    return stats;
  }
}