import type { TestResult } from './types';

export const mockDashboardStats = {
  totalTests: 24,
  pureSamples: 16,
  adulteratedSamples: 8,
  testsThisWeek: 5,
};

export const mockRecentTests: TestResult[] = [
  {
    id: '#001',
    userId: 'user-1',
    timestamp: '2026-09-17T10:00:00Z',
    prediction: {
      predictedClass: 'PURE',
      confidenceScore: 0.964,
    },
    spectrumImageUrl: '/placeholder.jpg',
    status: 'COMPLETED',
  },
  {
    id: '#002',
    userId: 'user-1',
    timestamp: '2026-09-16T14:30:00Z',
    prediction: {
      predictedClass: 'UREA',
      confidenceScore: 0.921,
    },
    spectrumImageUrl: '/placeholder.jpg',
    status: 'COMPLETED',
  },
  {
    id: '#003',
    userId: 'user-1',
    timestamp: '2026-09-14T09:15:00Z',
    prediction: {
      predictedClass: 'WATER',
      confidenceScore: 0.92,
    },
    spectrumImageUrl: '/placeholder.jpg',
    location: { latitude: 18.5204, longitude: 73.8567 }, // Pune Center
    status: 'COMPLETED',
  },
];

export const mockHistoryTests: TestResult[] = [
  ...mockRecentTests,
  {
    id: 'SC-20260910-045',
    userId: 'mock-user-123',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    spectrumImageUrl: '/placeholder.jpg',
    prediction: {
      predictedClass: 'UREA',
      confidenceScore: 0.94
    },
    location: { latitude: 18.5020, longitude: 73.8580 }, // Swargate
    status: 'COMPLETED',
  },
  {
    id: 'SC-20260905-112',
    userId: 'mock-user-123',
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    spectrumImageUrl: '/placeholder.jpg',
    prediction: {
      predictedClass: 'PURE',
      confidenceScore: 0.98
    },
    location: { latitude: 18.5308, longitude: 73.8475 }, // Shivaji Nagar
    status: 'COMPLETED',
  },
  {
    id: 'SC-20260828-088',
    userId: 'mock-user-123',
    timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    spectrumImageUrl: '/placeholder.jpg',
    prediction: {
      predictedClass: 'STARCH',
      confidenceScore: 0.88
    },
    location: { latitude: 18.5410, longitude: 73.8290 }, // Baner area
    status: 'COMPLETED',
  },
  {
    id: 'SC-20260815-003',
    userId: 'mock-user-123',
    timestamp: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
    spectrumImageUrl: '/placeholder.jpg',
    prediction: {
      predictedClass: 'PURE',
      confidenceScore: 0.97
    },
    location: { latitude: 18.5360, longitude: 73.8820 }, // Viman Nagar area
    status: 'COMPLETED',
  },
  // --- New points across India ---
  {
    id: 'IND-MUM-01',
    userId: 'user-2',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    spectrumImageUrl: '/placeholder.jpg',
    prediction: { predictedClass: 'WATER', confidenceScore: 0.91 },
    location: { latitude: 19.0760, longitude: 72.8777 }, // Mumbai
    status: 'COMPLETED',
  },
  {
    id: 'IND-DEL-01',
    userId: 'user-3',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    spectrumImageUrl: '/placeholder.jpg',
    prediction: { predictedClass: 'PURE', confidenceScore: 0.99 },
    location: { latitude: 28.7041, longitude: 77.1025 }, // Delhi
    status: 'COMPLETED',
  },
  {
    id: 'IND-BLR-01',
    userId: 'user-4',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    spectrumImageUrl: '/placeholder.jpg',
    prediction: { predictedClass: 'UREA', confidenceScore: 0.89 },
    location: { latitude: 12.9716, longitude: 77.5946 }, // Bangalore
    status: 'COMPLETED',
  },
  {
    id: 'IND-KOL-01',
    userId: 'user-5',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    spectrumImageUrl: '/placeholder.jpg',
    prediction: { predictedClass: 'STARCH', confidenceScore: 0.92 },
    location: { latitude: 22.5726, longitude: 88.3639 }, // Kolkata
    status: 'COMPLETED',
  },
  {
    id: 'IND-CHN-01',
    userId: 'user-6',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    spectrumImageUrl: '/placeholder.jpg',
    prediction: { predictedClass: 'PURE', confidenceScore: 0.96 },
    location: { latitude: 13.0827, longitude: 80.2707 }, // Chennai
    status: 'COMPLETED',
  },
  {
    id: 'IND-HYD-01',
    userId: 'user-7',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    spectrumImageUrl: '/placeholder.jpg',
    prediction: { predictedClass: 'WATER', confidenceScore: 0.94 },
    location: { latitude: 17.3850, longitude: 78.4867 }, // Hyderabad
    status: 'COMPLETED',
  }
];

// Helper to generate a realistic-looking mock spectral graph
export const generateMockSpectrum = (scenario: 'PURE' | 'WATER' | 'UREA' | 'STARCH' | undefined) => {
  const data = [];
  
  // Base wavelength range (visible light spectrum roughly 400nm to 700nm)
  for (let wavelength = 400; wavelength <= 700; wavelength += 2) {
    // Base curve (Planck-like shape)
    let originalIntensity = Math.sin((wavelength - 400) / 100) * 50 + 20;
    
    // Add noise to original
    originalIntensity += (Math.random() - 0.5) * 15;
    
    // Processed is smoothed out
    let processedIntensity = Math.sin((wavelength - 400) / 100) * 50 + 20;

    // Add specific spectral peaks based on scenario
    if (scenario === 'WATER' && Math.abs(wavelength - 600) < 15) {
      originalIntensity -= 15 + Math.random() * 5;
      processedIntensity -= 15; // Water absorption trough
    }
    
    if (scenario === 'UREA' && Math.abs(wavelength - 450) < 10) {
      originalIntensity += 25 + Math.random() * 10;
      processedIntensity += 25; // Urea peak
    }
    
    if (scenario === 'STARCH' && Math.abs(wavelength - 550) < 20) {
      originalIntensity += 30 + Math.random() * 8;
      processedIntensity += 30; // Starch peak
    }
    
    // Ensure no negative values
    data.push({
      wavelength,
      original: Math.max(0, originalIntensity),
      processed: Math.max(0, processedIntensity),
    });
  }
  
  return data;
};

export const mockMonitoringData = {
  summary: {
    totalTests: 1248,
    pureSamples: 842,
    adulteratedSamples: 406,
    testsThisWeek: 126,
    weeklyGrowth: 12.5
  },
  trends: [
    { date: 'Mon', tests: 45 },
    { date: 'Tue', tests: 52 },
    { date: 'Wed', tests: 38 },
    { date: 'Thu', tests: 65 },
    { date: 'Fri', tests: 48 },
    { date: 'Sat', tests: 89 },
    { date: 'Sun', tests: 72 }
  ],
  adulterants: [
    { name: 'Water', count: 210 },
    { name: 'Urea', count: 98 },
    { name: 'Starch', count: 76 }
  ],
  recentTests: mockHistoryTests.slice(0, 5),
  flaggedTests: mockHistoryTests.filter(t => 
    t.prediction?.predictedClass !== 'PURE' && 
    (t.prediction?.confidenceScore ?? 0) > 0.90
  ).slice(0, 5)
};
