import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StepIndicator } from '../components/features/StepIndicator';
import { SpectrumChart } from '../components/features/SpectrumChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Loader2, CheckCircle2, ChevronRight, Activity, FileTerminal } from 'lucide-react';
import { api } from '../services/api';
import { generateMockSpectrum } from '../utils/mockData';
import { ErrorState } from '../components/ui/StateContainers';

const pipelineStages = [
  'Image Captured',
  'Noise Filtering',
  'Data Cleaning',
  'Normalization',
  'Feature Extraction',
  'ML Classification'
];

export default function TestProcessing() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'original' | 'processed'>('original');
  
  const testId = location.state?.testId;

  // Protect route
  if (!testId) {
    // Navigate back to start if accessed directly
  }

  const steps = [
    { id: 'prep', name: 'Sample Preparation' },
    { id: 'capture', name: 'Capture Spectrum' },
    { id: 'process', name: 'AI Analysis' },
    { id: 'result', name: 'View Result' }
  ];

  // Generate deterministic mock graph data for the demo
  const graphData = useMemo(() => generateMockSpectrum(prediction?.predictedClass), [prediction?.predictedClass]);

  useEffect(() => {
    let isMounted = true;
    
    // Simulate progression through pipeline stages visually (slightly faster for UX)
    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev < pipelineStages.length - 1) return prev + 1;
        return prev;
      });
    }, 400);

      const performAnalysis = async () => {
      try {
        const response = await api.analyzeTest(testId);
        
        if (isMounted && response.data.success) {
          setPrediction(response.data.data.prediction);
          // Switch view mode to processed automatically halfway through
          setViewMode('processed'); 
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
        }
      }
    };

    performAnalysis();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [testId]);

  const isComplete = currentStage === pipelineStages.length - 1 && prediction !== null;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <ErrorState 
          title="Processing Failed"
          description={error}
          onRetry={() => navigate('/test/capture')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Analysis & Visualization</h2>
        <p className="text-muted-foreground">Inspect the spectral preprocessing pipeline before classification.</p>
      </div>

      <StepIndicator steps={steps} currentStepIndex={2} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column: Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
              <div>
                <CardTitle className="text-lg">Spectral Graph</CardTitle>
                <CardDescription>Wavelength vs Signal Intensity</CardDescription>
              </div>
              <div className="flex bg-muted p-1 rounded-md">
                <button
                  className={`px-3 py-1 text-sm rounded-sm font-medium transition-colors ${viewMode === 'original' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setViewMode('original')}
                >
                  Original
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-sm font-medium transition-colors ${viewMode === 'processed' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setViewMode('processed')}
                  disabled={currentStage < 2} // Prevent viewing processed before it's conceptually "cleaned"
                >
                  Processed
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <SpectrumChart data={graphData} viewMode={viewMode} />
              <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground border-t pt-4">
                <span className="flex items-center gap-1"><Activity className="h-3 w-3"/> Simulated Demo Spectrum</span>
                <span>Values are deterministic prototypes</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileTerminal className="h-4 w-4" /> Feature Extraction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm font-mono space-y-2 text-muted-foreground bg-muted/20">
              <p><span className="text-foreground font-semibold">Model Architecture:</span> MobileNetV2 Prototype Representation</p>
              <p><span className="text-foreground font-semibold">Input Shape:</span> 224 x 224 x 3 (Processed spectral representation)</p>
              <p><span className="text-foreground font-semibold">Output Node:</span> 4-Class Softmax (PURE, WATER, UREA, STARCH)</p>
              {isComplete && (
                <p className="text-primary mt-2">→ Feature representation extracted successfully.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Timeline & Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b pb-4">
              <CardTitle>Processing Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="w-full space-y-5">
                {pipelineStages.map((stage, index) => {
                  const isPast = index < currentStage;
                  const isCurrent = index === currentStage;
                  
                  return (
                    <div key={stage} className={`flex items-start gap-3 transition-opacity duration-300 ${isPast ? 'opacity-100' : isCurrent ? 'opacity-100 font-medium' : 'opacity-30'}`}>
                      {isPast ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      ) : isCurrent ? (
                        <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0 mt-0.5" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-sm leading-none">{stage}</span>
                        {isCurrent && <p className="text-xs text-muted-foreground mt-1 animate-pulse">Running...</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {isComplete && prediction && (
            <Card className="border-primary/50 bg-primary/5 animate-in slide-in-from-bottom-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-primary/10 pb-2">
                    <span className="text-muted-foreground">Sample Type</span>
                    <span className="font-medium">Milk</span>
                  </div>
                  <div className="flex justify-between border-b border-primary/10 pb-2">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="success" className="h-5 px-1.5 text-[10px]">Completed</Badge>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-muted-foreground">Prediction</span>
                    <span className={`font-bold ${prediction.predictedClass === 'PURE' ? 'text-green-600' : 'text-destructive'}`}>
                      {prediction.predictedClass}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full gap-2 mt-4 shadow-sm"
                  onClick={() => navigate('/test/result', { state: { prediction, testId }, replace: true })}
                >
                  View Final Result <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
