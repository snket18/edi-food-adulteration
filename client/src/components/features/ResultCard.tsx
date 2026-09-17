import type { AdulterantType } from '../../utils/types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ResultCardProps {
  predictionClass: AdulterantType;
  confidence: number;
}

export function ResultCard({ predictionClass, confidence }: ResultCardProps) {
  const isPure = predictionClass === 'PURE';
  const confidencePercent = (confidence * 100).toFixed(1);

  return (
    <Card className={`overflow-hidden border-2 ${isPure ? 'border-green-500/50' : 'border-amber-500/50'}`}>
      <div className={`px-6 py-8 flex flex-col items-center justify-center text-center ${isPure ? 'bg-green-50/50 dark:bg-green-950/20' : 'bg-amber-50/50 dark:bg-amber-950/20'}`}>
        {isPure ? (
          <ShieldCheck className="h-16 w-16 text-green-600 mb-4" />
        ) : (
          <ShieldAlert className="h-16 w-16 text-amber-600 mb-4" />
        )}
        
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          {isPure ? 'Sample classified as Pure' : 'Sample classified as Adulterated'}
        </h2>
        
        {isPure ? (
          <p className="text-lg text-green-700 dark:text-green-400 font-medium">No adulterant detected</p>
        ) : (
          <p className="text-lg text-amber-700 dark:text-amber-400 font-medium flex items-center gap-2">
            Detected adulterant: <Badge variant="warning" className="text-sm px-3">{predictionClass}</Badge>
          </p>
        )}
      </div>

      <CardContent className="p-6 bg-card space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm font-medium text-foreground">Model Confidence</p>
              <p className="text-xs text-muted-foreground">Prototype prediction certainty</p>
            </div>
            <span className="text-2xl font-bold">{confidencePercent}%</span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isPure ? 'bg-green-500' : 'bg-amber-500'}`} 
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {isPure 
              ? "Based on the prototype analysis, the sample was classified as pure."
              : `Based on the prototype analysis, the sample was classified as adulterated and the detected class is ${predictionClass}.`}
          </p>
          {!isPure && (
            <p className="text-sm font-medium text-foreground mt-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Consider confirming suspicious results using an appropriate laboratory/official testing method.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
