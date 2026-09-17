import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '../components/features/DashboardStats';
import { RecentTestsList } from '../components/features/RecentTestsList';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState, LoadingSpinner, ErrorState } from '../components/ui/StateContainers';
import { mockDashboardStats, mockRecentTests } from '../utils/mockData';
import type { TestResult } from '../utils/types';
import { Beaker, FileText, BarChart3, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<typeof mockDashboardStats | null>(null);
  const [tests, setTests] = useState<TestResult[]>([]);

  // Simulate API fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Uncomment to test error state
        // throw new Error("Failed to connect to server");

        setStats(mockDashboardStats);
        setTests(mockRecentTests);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <ErrorState 
          title="Unable to load dashboard"
          description={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border rounded-lg p-6 sm:p-8 shadow-sm">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Good morning, Jane
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Let's keep your food testing simple and reliable.
          </p>
        </div>
        <div className="shrink-0">
          <Button onClick={() => navigate('/test')} size="lg" className="w-full sm:w-auto gap-2 shadow-md">
            <Beaker className="h-5 w-5" /> Start New Test
          </Button>
        </div>
      </section>

      {/* Test Statistics */}
      <section>
        <DashboardStats stats={stats} />
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Tests Section */}
        <div className="md:col-span-2 space-y-4">
          <Card className="h-full border-t-4 border-t-primary/80">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
              <div className="space-y-1">
                <CardTitle>Recent Tests</CardTitle>
                <CardDescription>
                  Your latest milk quality analysis results.
                </CardDescription>
              </div>
              {tests.length > 0 && (
                <button 
                  onClick={() => navigate('/history')}
                  className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  View All <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {tests.length === 0 ? (
                <EmptyState 
                  title="No tests yet"
                  description="Start your first milk analysis to see your results here."
                  icon={<Beaker className="h-6 w-6 text-muted-foreground" />}
                />
              ) : (
                <RecentTestsList tests={tests} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="md:col-span-1 space-y-4">
          <Card className="h-full">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12" 
                onClick={() => navigate('/test')}
              >
                <Beaker className="h-5 w-5 text-primary" />
                New Test
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12" 
                onClick={() => navigate('/history')}
              >
                <FileText className="h-5 w-5 text-muted-foreground" />
                Test History
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12" 
                onClick={() => navigate('/reports')}
              >
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
