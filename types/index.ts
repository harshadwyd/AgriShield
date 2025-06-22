export interface Detection {
  id: string;
  timestamp: number;
  image: string;
  type: 'pest' | 'disease';
  crop: string;
  result: DetectionResult;
  treatmentApplied?: boolean;
}

export interface DetectionResult {
  name: string;
  scientific_name: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  symptoms: string[];
  treatments: {
    organic: Treatment[];
    chemical: Treatment[];
    preventive: string[];
  };
  image_analysis?: {
    bounding_boxes: BoundingBox[];
  };
}

export interface Treatment {
  name: string;
  dosage: string;
  frequency: string;
  safety: string;
  effectiveness: number;
  cost: 'Low' | 'Medium' | 'High';
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  farmSize?: string;
  primaryCrops: string[];
  location?: string;
}

export interface UserSettings {
  language: 'en' | 'hi' | 'mr';
  units: 'metric' | 'imperial';
  defaultCrop: string;
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  dataUsage: 'low' | 'medium' | 'high';
}

export interface EducationalContent {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'article';
  category: string;
  thumbnail?: string;
  url: string;
  duration?: number;
  downloadable: boolean;
  downloaded?: boolean;
  languages: string[];
  description: string;
}

export interface AppState {
  user: UserProfile | null;
  detections: Detection[];
  settings: UserSettings;
  isOnboarded: boolean;
  offline: {
    isOffline: boolean;
    pendingUploads: Detection[];
    cachedContent: EducationalContent[];
  };
}