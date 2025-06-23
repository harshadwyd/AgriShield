import { mockDetectionResults } from '../constants/mockData';
import { DetectionResult } from '../types';

export class DetectionService {
  static async analyzeImage(
    imageBase64: string, 
    type: 'pest' | 'disease', 
    cropType: string
  ): Promise<DetectionResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Simulate random results based on type
    const possibleResults = Object.keys(mockDetectionResults);
    const randomResult = possibleResults[Math.floor(Math.random() * possibleResults.length)];
    
    const result = mockDetectionResults[randomResult];
    
    // Add some randomness to confidence
    const confidence = Math.max(75, Math.min(98, result.confidence + (Math.random() - 0.5) * 10));
    
    return {
      ...result,
      confidence: Math.round(confidence * 10) / 10
    };
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
}