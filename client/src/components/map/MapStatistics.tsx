import { Card, CardContent } from '../ui/Card';
import type { MapDataPoint } from './GeographicMap';

interface MapStatisticsProps {
  data: MapDataPoint[];
}

export function MapStatistics({ data }: MapStatisticsProps) {
  const total = data.length;
  const pure = data.filter(d => d.classification === 'PURE').length;
  const adulterated = total - pure;
  
  // Find most common adulterant
  const adulterants = data.map(d => d.adulterant).filter(Boolean) as string[];
  const frequency: Record<string, number> = {};
  let mostCommon = 'None';
  let maxCount = 0;
  
  adulterants.forEach(a => {
    frequency[a] = (frequency[a] || 0) + 1;
    if (frequency[a] > maxCount) {
      maxCount = frequency[a];
      mostCommon = a;
    }
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Locations</p>
          <p className="text-2xl font-bold mt-1">{total}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pure Tests</p>
          <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-500">{pure}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Adulterated</p>
          <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-500">{adulterated}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Top Adulterant</p>
          <p className="text-2xl font-bold mt-1 capitalize">{mostCommon}</p>
        </CardContent>
      </Card>
    </div>
  );
}
