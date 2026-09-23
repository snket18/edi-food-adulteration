import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultCard } from '../components/features/ResultCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RefreshCw, AlertCircle, Sparkles, ChevronDown, ChevronUp, CheckCircle2, Download, Activity } from 'lucide-react';
import type { AdulterantType } from '../utils/types';
import { SpectrumChart } from '../components/features/SpectrumChart';
import { generateMockSpectrum } from '../utils/mockData';

export default function TestResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [techDetailsOpen, setTechDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'original' | 'processed'>('processed');

  const prediction = location.state?.prediction;
  const testId = location.state?.testId;

  const graphData = useMemo(() => {
    if (!prediction) return [];
    return generateMockSpectrum(prediction.predictedClass as AdulterantType);
  }, [prediction]);

  // NO DATA state
  if (!prediction) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">No test result available.</h2>
        <p className="text-muted-foreground">Capture a spectrum first to begin analysis.</p>
        <Button onClick={() => navigate('/test')}>Start New Test</Button>
      </div>
    );
  }

  // No save logic needed, the test is already saved in the database during Analysis.

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Final Analysis Result</h2>
        <Badge variant={prediction.predictedClass === 'PURE' ? 'success' : 'destructive'} className="w-fit text-sm">
          {prediction.predictedClass}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Result Area */}
        <div className="lg:col-span-2 space-y-6">
          <ResultCard 
            predictionClass={prediction.predictedClass as AdulterantType} 
            confidence={prediction.confidenceScore} 
          />

          <Card>
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg">How the analysis works</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm"><strong>1. Spectrum captured:</strong> Smartphone camera recorded the light diffraction.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm"><strong>2. Image preprocessing:</strong> Isolated the spectral band from the photo.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm"><strong>3. Normalization:</strong> Adjusted intensity values for consistent lighting.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm"><strong>4. Feature extraction:</strong> Identified unique molecular signatures.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm"><strong>5. ML classification:</strong> AI matched signatures against known adulterants.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm"><strong>6. Result generated:</strong> Final confidence score calculated.</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t">
                <button 
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => setTechDetailsOpen(!techDetailsOpen)}
                >
                  <span className="font-semibold text-sm">Technical Details</span>
                  {techDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {techDetailsOpen && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-md space-y-3 text-sm font-mono text-muted-foreground">
                    <div><span className="text-foreground font-semibold">Input:</span> Spectral representation</div>
                    <div><span className="text-foreground font-semibold">Preprocessing:</span> Noise filtering, Normalization</div>
                    <div><span className="text-foreground font-semibold">Feature Extraction:</span> MobileNetV2 / EfficientNet-B0 (Prototype)</div>
                    <div><span className="text-foreground font-semibold">Classification:</span> Pure / Water / Urea / Starch</div>
                    <div><span className="text-foreground font-semibold">Inference:</span> Cloud / Prototype analysis architecture</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg">Test Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Test ID</span>
                <span className="font-medium">{testId || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sample Type</span>
                <span className="font-medium">Milk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="success" className="font-normal text-[10px]">Processing Completed</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">Not recorded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Device</span>
                <span className="font-medium">Smartphone (Web)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-print">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-muted/20">
              <div>
                <CardTitle className="text-lg">Spectrum Summary</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Simulated spectral analysis</p>
              </div>
              <div className="flex bg-muted p-1 rounded-md no-print">
                <button
                  className={`px-2 py-1 text-xs rounded-sm font-medium transition-colors ${viewMode === 'original' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setViewMode('original')}
                >
                  Original
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded-sm font-medium transition-colors ${viewMode === 'processed' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setViewMode('processed')}
                >
                  Processed
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <SpectrumChart data={graphData} viewMode={viewMode} />
              <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground border-t pt-4">
                <span className="flex items-center gap-1"><Activity className="h-3 w-3"/> Reconstructed Demo Spectrum</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Area */}
          <div className="space-y-3 pt-4 no-print">
            <Button 
              variant="default"
              disabled
              className="w-full gap-2 opacity-100 shadow-sm"
              size="lg"
            >
              <CheckCircle2 className="h-4 w-4 text-green-300" />
              Result Saved Automatically
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => window.print()}
              className="w-full gap-2 shadow-sm"
              size="lg"
            >
              <Download className="h-4 w-4" />
              Download PDF Report
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate('/test')} 
              className="w-full gap-2 shadow-sm"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
              Test Another Sample
            </Button>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate(testId ? `/history/${testId}` : '/history')} 
                className="w-full text-xs"
              >
                View Test Details
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/history')} 
                className="w-full text-xs"
              >
                View Test History
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
