import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StepIndicator } from '../components/features/StepIndicator';
import { DemoSampleBrowser } from '../components/features/DemoSampleBrowser';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Camera, RefreshCw, AlertCircle, Sparkles, Loader2, PlaySquare, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { api } from '../services/api';

export default function TestCapture() {
  const navigate = useNavigate();
  const location = useLocation();
  const testId = location.state?.testId;
  
  const [mode, setMode] = useState<'camera' | 'demo' | 'upload'>('demo');
  const [isCaptured, setIsCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Deterministic mock scenario based on Demo Sample Browser
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

      {/* Mode Toggle */}
      <div className="flex p-1 bg-muted rounded-lg w-fit mx-auto sm:mx-0 flex-wrap">
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${mode === 'demo' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setMode('demo')}
        >
          <PlaySquare className="h-4 w-4" /> Demo Samples
        </button>
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${mode === 'camera' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setMode('camera')}
        >
          <Camera className="h-4 w-4" /> Camera Capture
        </button>
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${mode === 'upload' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => setMode('upload')}
        >
          <UploadCloud className="h-4 w-4" /> Upload Image
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {mode === 'camera' && 'Camera Interface'}
            {mode === 'demo' && 'Demo Sample Selection'}
            {mode === 'upload' && 'Upload Spectrum Image'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {mode === 'camera' ? (
            <>
              {/* Simulated Camera Viewfinder */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex flex-col items-center justify-center">
                {!isCaptured ? (
                  <>
                    <div className="absolute inset-0 border-2 border-primary/50 m-8 border-dashed rounded-md pointer-events-none" />
                    <Camera className="h-12 w-12 text-muted mb-4 opacity-50" />
                    <p className="text-muted-foreground text-sm">Camera preview simulating spectrum capture...</p>
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                      <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" /> Live
                    </div>
                  </>
                ) : (
                  <>
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
            </>
          ) : mode === 'demo' ? (
            <DemoSampleBrowser 
              selectedScenario={mockScenario} 
              onSelect={(scenario) => {
                setMockScenario(scenario);
                setIsCaptured(true);
              }} 
            />
          ) : (
            <div className="space-y-6">
              {!isCaptured ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/20 rounded-lg cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, or JPEG (Max 10MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        // Mock an upload handling
                        setMockScenario('PURE'); // Randomize or default to pure for user uploads in demo
                        setIsCaptured(true);
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900 opacity-80" />
                  <div className="z-10 text-white flex flex-col items-center">
                    <ImageIcon className="h-10 w-10 mb-2 text-primary-foreground" />
                    <p className="font-semibold text-lg">Image Uploaded Successfully</p>
                  </div>
                </div>
              )}
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Upload an image of the diffraction spectrum captured previously. Ensure the image is clear and well-lit.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            {mode === 'camera' && !isCaptured ? (
              <Button onClick={handleCapture} size="lg" className="w-full sm:w-auto">
                <Camera className="mr-2 h-5 w-5" /> Capture Spectrum
              </Button>
            ) : mode === 'upload' && !isCaptured ? (
               <div /> // Hidden button since input label handles the click
            ) : (
              <>
                {(mode === 'camera' || mode === 'upload') && (
                  <Button variant="outline" onClick={handleRetake} size="lg" className="w-full sm:w-auto" disabled={isLoading}>
                    <RefreshCw className="mr-2 h-5 w-5" /> {mode === 'upload' ? 'Upload Different Image' : 'Retake'}
                  </Button>
                )}
                <Button 
                  onClick={handleContinue} 
                  size="lg" 
                  className="w-full sm:w-auto" 
                  disabled={isLoading || (mode === 'demo' && !mockScenario)}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Processing...' : 'Process Image'}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
