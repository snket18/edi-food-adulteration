// Development data interfaces for SpectraCheck

export type Role = 'CONSUMER' | 'VENDOR' | 'INSPECTOR' | 'ADMIN';
export type AdulterantType = 'PURE' | 'WATER' | 'UREA' | 'STARCH';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface TestResult {
  id: string;
  userId: string;
  timestamp: string;
  prediction: {
    predictedClass: AdulterantType;
    confidenceScore: number;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  spectrumImageUrl: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

export interface MonitoringSummary {
  totalTests: number;
  pureSamples: number;
  adulteratedSamples: number;
  testsThisWeek: number;
  weeklyGrowth: number;
}

export interface TrendDataPoint {
  date: string;
  tests: number;
}

export interface AdulterantDistribution {
  name: string;
  count: number;
}

export interface MonitoringDashboardData {
  summary: MonitoringSummary;
  trends: TrendDataPoint[];
  adulterants: AdulterantDistribution[];
  recentTests: TestResult[];
  flaggedTests: TestResult[];
}
