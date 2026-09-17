import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { mockHistoryTests } from '../utils/mockData';
import { GeographicMap, type MapDataPoint } from '../components/map/GeographicMap';
import { MapStatistics } from '../components/map/MapStatistics';
import { LoadingSpinner, ErrorState } from '../components/ui/StateContainers';
// Removed Select component import

export default function Map() {
  const [data, setData] = useState<MapDataPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [adulterantFilter, setAdulterantFilter] = useState<string>('all');
  // State removed as it's not read

  const fetchMapData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getMapData();
      if (response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to load map data');
      }
    } catch (err) {
      console.warn('API failed, falling back to mock map data');
      // Create a deterministic set of data from mockHistoryTests
      const mockPoints = mockHistoryTests
        .filter(t => t.location != null)
        .map(t => ({
          testId: t.id,
          latitude: t.location!.latitude,
          longitude: t.location!.longitude,
          classification: t.prediction?.predictedClass === 'PURE' ? 'PURE' : 'ADULTERATED',
          adulterant: t.prediction?.predictedClass === 'PURE' ? null : t.prediction?.predictedClass,
          confidence: t.prediction?.confidenceScore || 0,
          timestamp: t.timestamp
        })) as MapDataPoint[];
        
      setData(mockPoints);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  const filteredData = useMemo(() => {
    if (!data) return [];
    let filtered = data;
    
    if (classificationFilter !== 'all') {
      filtered = filtered.filter(d => 
        classificationFilter === 'pure' ? d.classification === 'PURE' : d.classification !== 'PURE'
      );
    }
    
    if (adulterantFilter !== 'all') {
      filtered = filtered.filter(d => d.adulterant === adulterantFilter.toUpperCase());
    }
    
    return filtered;
  }, [data, classificationFilter, adulterantFilter]);

  if (isLoading) {
    return <div className="py-24"><LoadingSpinner /></div>;
  }

  if (error && !data) {
    return (
      <div className="py-24">
        <ErrorState 
          title="Unable to load map data" 
          description={error} 
          onRetry={fetchMapData} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col pb-4 animate-in fade-in">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Geographic Monitoring</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            View food adulteration testing activity by location.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select 
            value={classificationFilter} 
            onChange={(e) => setClassificationFilter(e.target.value)}
            className="flex h-10 w-full sm:w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Classifications</option>
            <option value="pure">Pure Only</option>
            <option value="adulterated">Adulterated Only</option>
          </select>

          <select 
            value={adulterantFilter} 
            onChange={(e) => setAdulterantFilter(e.target.value)} 
            disabled={classificationFilter === 'pure'}
            className="flex h-10 w-full sm:w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Adulterants</option>
            <option value="water">Water</option>
            <option value="urea">Urea</option>
            <option value="starch">Starch</option>
          </select>
        </div>
      </div>

      <div className="shrink-0 mt-4">
        <MapStatistics data={filteredData} />
      </div>

      {/* Map Container - Flex Grow to take remaining height */}
      <div className="flex-grow min-h-[400px] border rounded-md shadow-sm relative">
        <GeographicMap 
          data={filteredData} 
          onSelectTest={() => {}} 
        />
      </div>
    </div>
  );
}
