import { supabase } from './supabase';
import { Database } from '../types/database';

type Detection = Database['public']['Tables']['detections']['Row'];
type DetectionInsert = Database['public']['Tables']['detections']['Insert'];
type DetectionUpdate = Database['public']['Tables']['detections']['Update'];

export class DetectionService {
  // Create a new detection
  static async createDetection(detection: DetectionInsert): Promise<Detection> {
    const { data, error } = await supabase
      .from('detections')
      .insert(detection)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user's detections with pagination
  static async getUserDetections(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      type?: string;
      severity?: string;
      sortBy?: 'created_at' | 'confidence_score' | 'severity_level';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ) {
    const {
      limit = 20,
      offset = 0,
      type,
      severity,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;

    let query = supabase
      .from('detections')
      .select('*')
      .eq('user_id', userId)
      .range(offset, offset + limit - 1)
      .order(sortBy, { ascending: sortOrder === 'asc' });

    if (type) {
      query = query.eq('detection_type', type);
    }

    if (severity) {
      query = query.eq('severity_level', severity);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  // Get detection by ID
  static async getDetection(id: string): Promise<Detection | null> {
    const { data, error } = await supabase
      .from('detections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  }

  // Update detection
  static async updateDetection(id: string, updates: DetectionUpdate): Promise<Detection> {
    const { data, error } = await supabase
      .from('detections')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete detection
  static async deleteDetection(id: string): Promise<void> {
    const { error } = await supabase
      .from('detections')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Get detection statistics for a user
  static async getDetectionStats(userId: string, dateRange?: { from: string; to: string }) {
    let query = supabase
      .from('detections')
      .select('detection_type, severity_level, confidence_score, created_at')
      .eq('user_id', userId);

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.from)
        .lte('created_at', dateRange.to);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Process statistics
    const stats = {
      total: data.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      averageConfidence: 0,
      recentActivity: data.slice(0, 10),
    };

    data.forEach(detection => {
      // Count by type
      stats.byType[detection.detection_type] = 
        (stats.byType[detection.detection_type] || 0) + 1;

      // Count by severity
      stats.bySeverity[detection.severity_level] = 
        (stats.bySeverity[detection.severity_level] || 0) + 1;
    });

    // Calculate average confidence
    if (data.length > 0) {
      stats.averageConfidence = data.reduce((sum, d) => sum + d.confidence_score, 0) / data.length;
    }

    return stats;
  }

  // Get public detections for community features
  static async getPublicDetections(options: {
    limit?: number;
    offset?: number;
    type?: string;
    crop?: string;
  } = {}) {
    const { limit = 20, offset = 0, type, crop } = options;

    let query = supabase
      .from('detections')
      .select(`
        *,
        profiles:user_id (
          full_name,
          farm_name,
          location
        )
      `)
      .eq('is_public', true)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('detection_type', type);
    }

    if (crop) {
      query = query.eq('crop_type', crop);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  // Upload detection image
  static async uploadDetectionImage(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('detection-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('detection-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }
}