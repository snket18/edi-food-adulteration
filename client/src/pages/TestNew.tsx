import { useState } from 'react';
import { StepIndicator } from '../components/features/StepIndicator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function TestNew() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const steps = [
    { id: 'prep', name: 'Sample Preparation' },
    { id: 'capture', name: 'Capture Spectrum' },
    { id: 'process', name: 'AI Analysis' },
    { id: 'result', name: 'View Result' }
  ];

  const handleStartTest = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.createTest({ sampleType: 'MILK' });
      if (res.data.success) {
        navigate('/test/capture', { state: { testId: res.data.data.id } });
      } else {
        setError(res.data.message || 'Failed to create test');
        setIsLoading(false);
      }
    } catch (err: any) {
      const currentUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
      setError(err.response?.data?.message || `Network error while creating test (Trying to hit: ${currentUrl})`);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">New Milk Test</h2>
        <p className="text-muted-foreground">Follow the instructions to analyze your milk sample.</p>
      </div>

      <StepIndicator steps={steps} currentStepIndex={0} />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Step 1: Preparation</CardTitle>
          <CardDescription>Prepare your sample and smartphone hardware</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="warning">
            <AlertDescription>
              Ensure the diffraction grating is securely attached to your smartphone camera before proceeding.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4 text-foreground">
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shrink-0">1</div>
              <div>
                <p className="mt-1 font-medium text-sm">Prepare the milk sample.</p>
                <p className="text-xs text-muted-foreground">Place the milk sample in a clean, transparent container.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shrink-0">2</div>
              <div>
                <p className="mt-1 font-medium text-sm">Place the sample appropriately.</p>
                <p className="text-xs text-muted-foreground">Position a consistent white light source directly behind the sample container.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shrink-0">3</div>
              <div>
                <p className="mt-1 font-medium text-sm">Attach the smartphone diffraction-grating.</p>
                <p className="text-xs text-muted-foreground">Clip your low-cost optical attachment securely over the main camera lens.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shrink-0">4</div>
              <div>
                <p className="mt-1 font-medium text-sm">Position the smartphone camera correctly.</p>
                <p className="text-xs text-muted-foreground">Align the camera so the light passes through the sample and hits the grating.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shrink-0">5</div>
              <div>
                <p className="mt-1 font-medium text-sm">Prepare for spectrum capture.</p>
                <p className="text-xs text-muted-foreground">Ensure the environment is relatively dark to minimize stray light interference.</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={handleStartTest} size="lg" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating Test...' : 'Continue to Camera'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
