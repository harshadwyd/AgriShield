import { mockDetectionResults } from '../constants/mockData';
import { DetectionResult } from '../types';
import { DetectionService as DBDetectionService } from '../lib/detections';
import { supabase } from '../lib/supabase';

export class DetectionService {
  static async analyzeImage(
    imageBase64: string, 
    type: 'pest' | 'disease', 
    cropType: string,
    userId?: string
  ): Promise<DetectionResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Simulate random results based on type
    const possibleResults = Object.keys(mockDetectionResults);
    const randomResult = possibleResults[Math.floor(Math.random() * possibleResults.length)];
    
    const result = mockDetectionResults[randomResult];
    
    // Add some randomness to confidence
    const confidence = Math.max(75, Math.min(98, result.confidence + (Math.random() - 0.5) * 10));
    
    const detectionResult = {
      ...result,
      confidence: Math.round(confidence * 10) / 10
    };

    // Save to database if user is provided
    if (userId) {
      try {
        // First, upload the image (in a real app, you'd convert base64 to file)
        // For now, we'll use a placeholder URL
        const imageUrl = `https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800`;
        
        const detectionData = {
          user_id: userId,
          image_url: imageUrl,
          detection_type: type,
          crop_type: cropType,
          result_data: detectionResult,
          confidence_score: detectionResult.confidence,
          severity_level: detectionResult.severity,
          treatment_applied: false,
          is_public: false,
        };

        const savedDetection = await DBDetectionService.createDetection(detectionData);
        console.log('Detection saved to database:', savedDetection.id);
        
        // Update analytics
        const today = new Date().toISOString().split('T')[0];
        await this.updateAnalytics(userId, today);
        
      } catch (error) {
        console.error('Failed to save detection to database:', error);
        // Don't throw error - still return the result even if DB save fails
      }
    }
    
    return detectionResult;
  }

  static async updateAnalytics(userId: string, date: string) {
    try {
      const { AnalyticsService } = await import('../lib/analytics');
      await AnalyticsService.recordDailyAnalytics(userId, date);
    } catch (error) {
      console.error('Failed to update analytics:', error);
    }
  }

  static async getDetectionHistory(): Promise<any[]> {
    // Mock implementation - would fetch from API
    return [];
  }

  static getSeverityColor(severity: string): string {
    switch (severity) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  }

  static getConfidenceLevel(confidence: number): string {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 80) return 'High';
    if (confidence >= 70) return 'Good';
    if (confidence >= 60) return 'Fair';
    return 'Low';
  }

  // Method to check database connection
  static async testDatabaseConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  // Method to get detection count for user
  static async getDetectionCount(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('detections')
        .select('id')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data?.length || 0;
    } catch (error) {
      console.error('Failed to get detection count:', error);
      return 0;
    }
  }
}