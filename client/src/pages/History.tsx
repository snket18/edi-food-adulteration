import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState, ErrorState, LoadingSpinner } from '../components/ui/StateContainers';
import { Search, Filter, ArrowUpDown, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { mockHistoryTests } from '../utils/mockData';
import type { TestResult } from '../utils/types';

export default function History() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<'ALL' | 'PURE' | 'ADULTERATED'>('ALL');
  const [adulterantFilter, setAdulterantFilter] = useState<'ALL' | 'WATER' | 'UREA' | 'STARCH'>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'CONFIDENCE'>('NEWEST');

  useEffect(() => {
    let isMounted = true;
    
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await api.getTests();
        if (isMounted) {
          if (response.data.success && response.data.data.length > 0) {
            setTests(response.data.data);
          } else {
            setTests(mockHistoryTests); // Fallback to mock if empty
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn("API failed, falling back to mock history data.");
          setTests(mockHistoryTests); // Fallback on error (Neon likely not configured)
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHistory();
    return () => { isMounted = false; };
  }, []);

  // Compute filtered and sorted results
  const filteredTests = useMemo(() => {
    let result = [...tests];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (test) =>
          test.id.toLowerCase().includes(q) ||
          test.prediction?.predictedClass.toLowerCase().includes(q)
      );
    }

    // Classification Filter
    if (classFilter === 'PURE') {
      result = result.filter(t => t.prediction?.predictedClass === 'PURE');
    } else if (classFilter === 'ADULTERATED') {
      result = result.filter(t => t.prediction?.predictedClass !== 'PURE');
    }

    // Adulterant Filter
    if (adulterantFilter !== 'ALL') {
      result = result.filter(t => t.prediction?.predictedClass === adulterantFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'NEWEST') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortBy === 'OLDEST') {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else if (sortBy === 'CONFIDENCE') {
        const confA = a.prediction?.confidenceScore || 0;
        const confB = b.prediction?.confidenceScore || 0;
        return confB - confA;
      }
      return 0;
    });

    return result;
  }, [tests, searchQuery, classFilter, adulterantFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setClassFilter('ALL');
    setAdulterantFilter('ALL');
  };

  if (isLoading) return <div className="py-12"><LoadingSpinner /></div>;
  
  if (error && tests.length === 0) return (
    <div className="py-12">
      <ErrorState title="Unable to load your test history" description={error} onRetry={() => window.location.reload()} />
    </div>
  );

  if (tests.length === 0) return (
    <div className="py-12">
      <EmptyState 
        icon={<FileText className="h-12 w-12 text-muted-foreground" />}
        title="No tests yet"
        description="Your completed milk analyses will appear here."
      />
      <div className="mt-4 flex justify-center">
        <Button onClick={() => navigate('/test')}>Start New Test</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Test History</h2>
          <p className="text-muted-foreground">View and manage your previous milk analysis results.</p>
        </div>
        <Button onClick={() => navigate('/test')} className="shrink-0">
          Start New Test
        </Button>
      </div>

      {/* Controls Bar */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by ID or adulterant..." 
              className="w-full pl-9 pr-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <select 
              className="w-full p-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value as any)}
            >
              <option value="ALL">All Classifications</option>
              <option value="PURE">Pure</option>
              <option value="ADULTERATED">Adulterated</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <select 
              className="w-full p-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={adulterantFilter}
              onChange={(e) => setAdulterantFilter(e.target.value as any)}
              disabled={classFilter === 'PURE'}
            >
              <option value="ALL">All Adulterants</option>
              <option value="WATER">Water</option>
              <option value="UREA">Urea</option>
              <option value="STARCH">Starch</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
            <select 
              className="w-full p-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="CONFIDENCE">Highest Confidence</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {filteredTests.length === 0 ? (
        <div className="py-12 bg-muted/10 border rounded-lg flex flex-col items-center text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-xl font-semibold">No matching tests found.</h3>
          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Test ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Classification</th>
                  <th className="px-6 py-4 font-medium">Adulterant</th>
                  <th className="px-6 py-4 font-medium">Confidence</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTests.map((test) => {
                  const isPure = test.prediction?.predictedClass === 'PURE';
                  return (
                    <tr key={test.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{test.id}</td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(test.timestamp).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant={isPure ? 'success' : 'destructive'} className="font-normal">
                          {isPure ? 'Pure' : 'Adulterated'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {isPure ? '-' : <span className="text-amber-600 font-medium">{test.prediction?.predictedClass}</span>}
                      </td>
                      <td className="px-6 py-4">
                        {test.prediction?.confidenceScore ? `${(test.prediction.confidenceScore * 100).toFixed(1)}%` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/history/${test.id}`)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredTests.map((test) => {
              const isPure = test.prediction?.predictedClass === 'PURE';
              return (
                <Card key={test.id} className="overflow-hidden cursor-pointer active:scale-[0.99] transition-transform" onClick={() => navigate(`/history/${test.id}`)}>
                  <div className={`h-1.5 w-full ${isPure ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{test.id}</p>
                        <p className="text-xs text-muted-foreground">{new Date(test.timestamp).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={isPure ? 'success' : 'destructive'} className="text-[10px] px-1.5 h-5">
                        {isPure ? 'Pure' : 'Adulterated'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-end border-t pt-3 mt-1 text-sm">
                      <div>
                        <span className="text-muted-foreground block text-xs">Detected</span>
                        <span className={isPure ? 'text-green-600' : 'text-amber-600 font-medium'}>
                          {isPure ? 'None' : test.prediction?.predictedClass}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground block text-xs">Confidence</span>
                        <span className="font-medium">
                          {test.prediction?.confidenceScore ? `${(test.prediction.confidenceScore * 100).toFixed(1)}%` : 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-1">
                      <span className="text-primary text-xs font-medium flex items-center gap-1">
                        View Details <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
