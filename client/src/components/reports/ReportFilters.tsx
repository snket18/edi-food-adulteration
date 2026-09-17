import { Card, CardContent } from '../ui/Card';

export interface ReportFilterState {
  dateRange: 'today' | '7days' | '30days' | 'all';
  classification: 'all' | 'pure' | 'adulterated';
  adulterant: string;
  sample: string;
}

interface ReportFiltersProps {
  filters: ReportFilterState;
  setFilters: (filters: ReportFilterState) => void;
}

export function ReportFilters({ filters, setFilters }: ReportFiltersProps) {
  const handleChange = (key: keyof ReportFilterState, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
      // Reset adulterant if classification becomes pure
      ...(key === 'classification' && value === 'pure' ? { adulterant: 'all' } : {})
    });
  };

  return (
    <Card className="no-print">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Date Range</label>
            <select 
              value={filters.dateRange} 
              onChange={(e) => handleChange('dateRange', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Classification</label>
            <select 
              value={filters.classification} 
              onChange={(e) => handleChange('classification', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Classifications</option>
              <option value="pure">Pure Only</option>
              <option value="adulterated">Adulterated Only</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Adulterant</label>
            <select 
              value={filters.adulterant} 
              onChange={(e) => handleChange('adulterant', e.target.value)} 
              disabled={filters.classification === 'pure'}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Adulterants</option>
              <option value="water">Water</option>
              <option value="urea">Urea</option>
              <option value="starch">Starch</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Sample</label>
            <select 
              value={filters.sample} 
              onChange={(e) => handleChange('sample', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Samples</option>
              <option value="milk">Milk</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
