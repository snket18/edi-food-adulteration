import { Card, CardContent } from '../ui/Card';
import { Activity, Beaker, AlertCircle, TrendingUp } from 'lucide-react';

interface ReportSummaryCardsProps {
  total: number;
  pure: number;
  adulterated: number;
  topAdulterant: string;
}

export function ReportSummaryCards({ total, pure, adulterated, topAdulterant }: ReportSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print-container">
      <Card className="card-print">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
              <p className="text-3xl font-bold tracking-tight">{total.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-md no-print">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-print">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Pure Samples</p>
              <p className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-500">{pure.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md no-print">
              <Beaker className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-print">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Adulterated Samples</p>
              <p className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-500">{adulterated.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-md no-print">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-print">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Top Adulterant</p>
              <p className="text-3xl font-bold tracking-tight capitalize">{topAdulterant}</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-md no-print">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
