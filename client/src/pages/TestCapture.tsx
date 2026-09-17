import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StepIndicator } from '../components/features/StepIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Camera, RefreshCw, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';

export default function TestCapture() {
  const navigate = useNavigate();
  const location = useLocation();
  const testId = location.state?.testId;
  const [isCaptured, setIsCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Developer override to deterministically select the scenario
  const [mockScenario, setMockScenario] = useState<'PURE' | 'WATER' | 'UREA' | 'STARCH' | undefined>();
  
  const steps = [
    { id: 'prep', name: 'Sample Preparation' },
    { id: 'capture', name: 'Capture Spectrum' },
    { id: 'process', name: 'AI Analysis' },
    { id: 'result', name: 'View Result' }
  ];

  if (!testId) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-destructive font-medium">Error: No active test session found.</p>
        <Button onClick={() => navigate('/test')}>Return to Start</Button>
      </div>
    );
  }

  const handleCapture = () => {
    setIsCaptured(true);
  };

  const handleRetake = () => {
    setIsCaptured(false);
  };

  const handleContinue = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.captureSpectrum(testId, { mockScenario });
      if (res.data.success) {
        navigate('/test/processing', { state: { testId } });
      } else {
        setError(res.data.message || 'Capture failed');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Network error during capture');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Capture Spectrum</h2>
        <p className="text-muted-foreground">Align your smartphone camera and capture the diffraction spectrum.</p>
      </div>

      <StepIndicator steps={steps} currentStepIndex={1} />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Camera Interface</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Simulated Camera Viewfinder */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex flex-col items-center justify-center">
            {!isCaptured ? (
              <>
                {/* Simulated live viewfinder lines */}
                <div className="absolute inset-0 border-2 border-primary/50 m-8 border-dashed rounded-md pointer-events-none" />
                <Camera className="h-12 w-12 text-muted mb-4 opacity-50" />
                <p className="text-muted-foreground text-sm">Camera preview simulating spectrum capture...</p>
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" /> Live
                </div>
              </>
            ) : (
              <>
                {/* Captured State */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900 opacity-80" />
                <div className="z-10 text-white flex flex-col items-center">
                  <Sparkles className="h-10 w-10 mb-2 text-primary-foreground" />
                  <p className="font-semibold text-lg">Spectrum Captured Successfully</p>
                </div>
              </>
            )}
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isCaptured 
                ? "Review the capture above. If the spectrum lines are clear and horizontal, you may proceed." 
                : "Tips: Keep the sample steady, ensure consistent lighting, and align the spectrum horizontally."}
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            {!isCaptured ? (
              <Button onClick={handleCapture} size="lg" className="w-full sm:w-auto">
                <Camera className="mr-2 h-5 w-5" /> Capture Spectrum
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleRetake} size="lg" className="w-full sm:w-auto" disabled={isLoading}>
                  <RefreshCw className="mr-2 h-5 w-5" /> Retake
                </Button>
                <Button onClick={handleContinue} size="lg" className="w-full sm:w-auto" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Processing...' : 'Process Image'}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Developer Demo Controls */}
      <div className="pt-8 border-t">
        <p className="text-xs text-muted-foreground mb-2 font-mono uppercase tracking-wider">Demo / Prototype Controls</p>
        <div className="flex flex-wrap gap-2">
          {['PURE', 'WATER', 'UREA', 'STARCH'].map(scenario => (
            <Badge 
              key={scenario}
              variant={mockScenario === scenario ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setMockScenario(mockScenario === scenario ? undefined : scenario as any)}
            >
              Force {scenario}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Select a scenario above before clicking "Process Image" to guarantee a specific deterministic result.
        </p>
      </div>
    </div>
  );
}
