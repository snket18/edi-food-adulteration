import { useNavigate } from 'react-router-dom';
import type { TestResult } from '../../utils/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface RecentTestsListProps {
  tests: TestResult[];
}

export function RecentTestsList({ tests }: RecentTestsListProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Mobile View: Stacked Cards */}
      <div className="md:hidden space-y-4">
        {tests.map((test) => {
          const isPure = test.prediction.predictedClass === 'PURE';
          return (
            <div key={test.id} className="p-4 border rounded-lg bg-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold">{test.id}</span>
                  <span className="text-muted-foreground text-sm ml-2">Milk</span>
                </div>
                <Badge variant={isPure ? 'success' : 'destructive'}>
                  {isPure ? 'Pure' : 'Adulterated'}
                </Badge>
              </div>
              <div className="text-sm space-y-1 mb-4">
                {!isPure && (
                  <p className="text-destructive font-medium">
                    Adulterant: {test.prediction.predictedClass}
                  </p>
                )}
                <p>Confidence: {(test.prediction.confidenceScore * 100).toFixed(1)}%</p>
                <p className="text-muted-foreground">
                  {new Date(test.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate(`/history/${test.id}`)}
              >
                View Details
              </Button>
            </div>
          );
        })}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-t">
            <tr>
              <th className="px-4 py-3 font-medium">Test ID</th>
              <th className="px-4 py-3 font-medium">Sample</th>
              <th className="px-4 py-3 font-medium">Result</th>
              <th className="px-4 py-3 font-medium">Adulterant</th>
              <th className="px-4 py-3 font-medium">Confidence</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tests.map((test) => {
              const isPure = test.prediction.predictedClass === 'PURE';
              return (
                <tr key={test.id} className="hover:bg-muted/50">
                  <td className="px-4 py-4 font-medium">{test.id}</td>
                  <td className="px-4 py-4 text-muted-foreground">Milk</td>
                  <td className="px-4 py-4">
                    <Badge variant={isPure ? 'success' : 'destructive'}>
                      {isPure ? 'Pure' : 'Adulterated'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    {!isPure ? <span className="font-medium text-destructive">{test.prediction.predictedClass}</span> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-4 font-medium">{(test.prediction.confidenceScore * 100).toFixed(1)}%</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {new Date(test.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button 
                      className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
                      onClick={() => navigate(`/history/${test.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
