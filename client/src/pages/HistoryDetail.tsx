import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ResultCard } from '../components/features/ResultCard';
import { SpectrumChart } from '../components/features/SpectrumChart';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ErrorState, LoadingSpinner } from '../components/ui/StateContainers';
import { ArrowLeft, MapPin, ChevronDown, ChevronUp, Activity, FileTerminal, Download } from 'lucide-react';
import { api } from '../services/api';
import { mockHistoryTests, generateMockSpectrum } from '../utils/mockData';
import type { TestResult, AdulterantType } from '../utils/types';

export default function TestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [test, setTest] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI states
  const [techDetailsOpen, setTechDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'original' | 'processed'>('processed');

  useEffect(() => {
    let isMounted = true;
    
    const fetchTest = async () => {
      if (!id) return;
      
      // If we received a mock test from the previous screen, use it directly (important for Demo Mode when DB is down)
      if (location.state?.mockTest) {
        setTest(location.state.mockTest);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await api.getTestById(id);
        if (isMounted) {
          if (response.data.success) {
            setTest(response.data.data);
          } else {
            throw new Error(response.data.message || 'Test not found');
          }
        }
      } catch (err) {
        if (isMounted) {
          // Fallback to mock data search
          const foundMock = mockHistoryTests.find(t => t.id === id);
          if (foundMock) {
            setTest(foundMock);
          } else {
            setError('Test record not found in database or offline history.');
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTest();
    return () => { isMounted = false; };
  }, [id]);

  // Re-generate the deterministic graph data for this specific historical test
  const graphData = useMemo(() => {
    if (!test?.prediction) return [];
    return generateMockSpectrum(test.prediction.predictedClass as AdulterantType);
  }, [test]);

  if (isLoading) return <div className="py-12"><LoadingSpinner /></div>;
  if (error || !test) return (
    <div className="py-12">
      <ErrorState title="Test Not Found" description={error || 'Invalid Test ID'} onRetry={() => navigate('/history')} />
    </div>
  );

  const isPure = test.prediction?.predictedClass === 'PURE';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in">
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/history')} className="shrink-0 -ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Test Details</h2>
            <p className="text-muted-foreground font-mono text-sm">{test.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={isPure ? 'success' : 'destructive'} className="text-sm">
            {test.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Result & Spectrum */}
        <div className="lg:col-span-2 space-y-6">
          
          {test.prediction && (
            <ResultCard 
              predictionClass={test.prediction.predictedClass as AdulterantType}
              confidence={test.prediction.confidenceScore}
            />
          )}

          <Card className="card-print">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-muted/20">
              <div>
                <CardTitle className="text-lg">Spectrum Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">Historical spectral capture</p>
              </div>
              <div className="flex bg-muted p-1 rounded-md no-print">
                <button
                  className={`px-3 py-1 text-sm rounded-sm font-medium transition-colors ${viewMode === 'original' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setViewMode('original')}
                >
                  Original
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-sm font-medium transition-colors ${viewMode === 'processed' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setViewMode('processed')}
                >
                  Processed
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <SpectrumChart data={graphData} viewMode={viewMode} />
              <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground border-t pt-4">
                <span className="flex items-center gap-1"><Activity className="h-3 w-3"/> Reconstructed Demo Spectrum</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Metadata & Technical */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg">Test Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sample Type</span>
                <span className="font-medium">Milk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{new Date(test.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{new Date(test.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="text-muted-foreground">Device</span>
                <span className="font-medium">Smartphone (Web)</span>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-1">Location</p>
                <div className="flex items-center gap-2 font-medium bg-muted/30 p-2 rounded-md">
                  <MapPin className="h-4 w-4 text-primary" />
                  College Laboratory (Demo)
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b pb-4">
              <button 
                className="flex items-center justify-between w-full text-left"
                onClick={() => setTechDetailsOpen(!techDetailsOpen)}
              >
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileTerminal className="h-4 w-4" /> Technical Details
                </CardTitle>
                {techDetailsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
            </CardHeader>
            {techDetailsOpen && (
              <CardContent className="pt-4 text-sm font-mono space-y-2 text-muted-foreground bg-muted/20 border-t">
                <p><span className="text-foreground font-semibold">Model Architecture:</span> MobileNetV2 Prototype</p>
                <p><span className="text-foreground font-semibold">Input Shape:</span> 224 x 224 x 3</p>
                <p><span className="text-foreground font-semibold">Classification Node:</span> 4-Class Softmax</p>
                <p><span className="text-foreground font-semibold">Execution:</span> Cloud API Simulated Inference</p>
                <p><span className="text-foreground font-semibold">Database:</span> PostgreSQL via Prisma</p>
              </CardContent>
            )}
          </Card>

          <div className="space-y-3 pt-4 no-print">
            <Button 
              variant="secondary"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.()) {
                  alert("PDF downloading is not supported inside the native app yet. Please use the Web Dashboard to download reports.");
                } else {
                  window.print();
                }
              }}
              className="w-full gap-2 shadow-sm"
              size="lg"
            >
              <Download className="h-4 w-4" />
              Download PDF Report
            </Button>
            <Button className="w-full" onClick={() => navigate('/test')}>
              Test Another Sample
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
