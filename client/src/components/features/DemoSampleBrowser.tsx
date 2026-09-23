import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Beaker, Droplets, AlertTriangle, Info } from 'lucide-react';

interface DemoSampleBrowserProps {
  onSelect: (scenario: 'PURE' | 'WATER' | 'UREA' | 'STARCH') => void;
  selectedScenario?: 'PURE' | 'WATER' | 'UREA' | 'STARCH';
}

const samples = [
  {
    id: 'PURE',
    title: 'Pure Milk',
    description: 'Baseline unadulterated milk sample',
    icon: Beaker,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  {
    id: 'WATER',
    title: 'Water Adulterated',
    description: 'Milk diluted with water (reduced density)',
    icon: Droplets,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    id: 'UREA',
    title: 'Urea Adulterated',
    description: 'Contains urea to artificially boost nitrogen content',
    icon: AlertTriangle,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20'
  },
  {
    id: 'STARCH',
    title: 'Starch Adulterated',
    description: 'Thickened with starch to hide water dilution',
    icon: Info,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  }
] as const;

export function DemoSampleBrowser({ onSelect, selectedScenario }: DemoSampleBrowserProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Select Demo Sample</h3>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Simulation</Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Choose a pre-configured sample to simulate the spectral capture and analysis process. This is ideal for presentation demos where capturing a real spectrum might be difficult.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {samples.map((sample) => (
          <Card 
            key={sample.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${selectedScenario === sample.id ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}
            onClick={() => onSelect(sample.id)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${sample.bg} ${sample.color} ${sample.border} border`}>
                  <sample.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-md">{sample.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardDescription className="text-xs">{sample.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
