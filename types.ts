export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  VISION = 'VISION',
  LANGUAGE = 'LANGUAGE',
  BUSINESS = 'BUSINESS',
  MARKET = 'MARKET',
  TEST_LAB = 'TEST_LAB',
  SITE_AUDITOR = 'SITE_AUDITOR',
  GOOGLE_BUSINESS = 'GOOGLE_BUSINESS',
  SOCIAL_SEARCH = 'SOCIAL_SEARCH'
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  type?: 'text' | 'image' | 'chart';
  chartData?: any[];
  timestamp: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  category?: string;
}

export interface AnalysisResult {
  title: string;
  summary: string;
  details: string[];
  metrics?: { label: string; value: string }[];
}

// Enums for UI state
export enum ProcessingState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AuditReport {
  domain: string;
  overallScore: number;
  summary: string;
  webRiskStatus: {
    safe: boolean;
    threats: string[];
    details: string;
  };
  detectedImages: string[];
  resources: {
    title: string;
    score: number; // 0-100
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    details: string;
    recommendation: string;
  }[];
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export interface BusinessProfile {
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  category: string;
  isOpen: boolean;
  phoneNumber: string;
  website: string;
  summary: string;
  reviews: Review[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface SocialProfileResult {
  entityName: string;
  summary: string;
  profiles: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
}