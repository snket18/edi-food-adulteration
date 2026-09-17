import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { mockMonitoringData } from '../utils/mockData';
import type { MonitoringDashboardData } from '../utils/types';
import { LoadingSpinner, ErrorState } from '../components/ui/StateContainers';
import { MonitoringKpiCard } from '../components/monitoring/MonitoringKpiCard';
import { TestingTrendChart, ClassificationChart, AdulterantChart } from '../components/monitoring/MonitoringCharts';
import { RecentTestsTable, FlaggedTests } from '../components/monitoring/MonitoringTables';
import { Activity, Beaker, AlertCircle, Calendar } from 'lucide-react';

export default function Monitoring() {
  const [data, setData] = useState<MonitoringDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getMonitoringDashboard();
      if (response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to load data');
      }
    } catch (err) {
      console.warn('API failed, falling back to mock monitoring data');
      // If Neon is offline, fallback to mock data
      setData(mockMonitoringData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="py-24"><LoadingSpinner /></div>;
  }

  if (error && !data) {
    return (
      <div className="py-24">
        <ErrorState 
          title="Unable to load monitoring data" 
          description={error} 
          onRetry={fetchDashboardData} 
        />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Monitoring</h2>
        <p className="text-muted-foreground mt-1">
          Monitor food adulteration testing activity and detected adulterants.
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MonitoringKpiCard 
          title="Total Tests" 
          value={data.summary.totalTests.toLocaleString()} 
          subtitle="+12.5% this week" 
          icon={<Activity className="h-5 w-5" />}
          trend="up"
        />
        <MonitoringKpiCard 
          title="Pure Samples" 
          value={data.summary.pureSamples.toLocaleString()} 
          subtitle="67% of total tests" 
          icon={<Beaker className="h-5 w-5" />}
        />
        <MonitoringKpiCard 
          title="Adulterated Samples" 
          value={data.summary.adulteratedSamples.toLocaleString()} 
          subtitle="33% of total tests" 
          icon={<AlertCircle className="h-5 w-5" />}
          trend="down"
        />
        <MonitoringKpiCard 
          title="Tests This Week" 
          value={data.summary.testsThisWeek.toLocaleString()} 
          subtitle="Active surveillance" 
          icon={<Calendar className="h-5 w-5" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <TestingTrendChart data={data.trends} />
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ClassificationChart 
            pureCount={data.summary.pureSamples} 
            adulteratedCount={data.summary.adulteratedSamples} 
          />
          <AdulterantChart data={data.adulterants} />
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTestsTable tests={data.recentTests} />
        <div className="col-span-1">
          <FlaggedTests tests={data.flaggedTests} />
        </div>
      </div>
    </div>
  );
}
