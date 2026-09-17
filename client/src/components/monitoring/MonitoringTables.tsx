import { useNavigate } from 'react-router-dom';
import type { TestResult } from '../../utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ChevronRight, AlertTriangle } from 'lucide-react';

interface RecentTestsTableProps {
  tests: TestResult[];
}

export function RecentTestsTable({ tests }: RecentTestsTableProps) {
  const navigate = useNavigate();

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Recent Testing Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Test ID</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Classification</th>
                <th className="px-4 py-3 font-medium">Adulterant</th>
                <th className="px-4 py-3 font-medium">Confidence</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tests.map((test) => {
                const isPure = test.prediction?.predictedClass === 'PURE';
                return (
                  <tr key={test.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{test.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(test.timestamp).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={isPure ? 'success' : 'warning'} className="font-normal">
                        {isPure ? 'Pure' : 'Adulterated'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {isPure ? '-' : <span className="text-amber-600 font-medium">{test.prediction?.predictedClass}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {test.prediction?.confidenceScore ? `${(test.prediction.confidenceScore * 100).toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/tests/${test.id}`)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {tests.map((test) => {
            const isPure = test.prediction?.predictedClass === 'PURE';
            return (
              <div 
                key={test.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 active:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/tests/${test.id}`)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{test.id}</span>
                    <Badge variant={isPure ? 'success' : 'warning'} className="text-[10px] px-1.5 h-4">
                      {isPure ? 'Pure' : 'Adulterated'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{new Date(test.timestamp).toLocaleDateString()}</span>
                    {!isPure && (
                      <>
                        <span>•</span>
                        <span className="text-amber-600 font-medium">{test.prediction?.predictedClass}</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface FlaggedTestsProps {
  tests: TestResult[];
}

export function FlaggedTests({ tests }: FlaggedTestsProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-amber-200 bg-amber-50/10 dark:bg-amber-950/10 dark:border-amber-900/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-amber-800 dark:text-amber-500">
          <AlertTriangle className="h-5 w-5" />
          Requires Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tests.length === 0 ? (
          <p className="text-sm text-muted-foreground">No flagged tests require review at this time.</p>
        ) : (
          <div className="space-y-3">
            {tests.map((test) => (
              <div 
                key={test.id} 
                className="flex items-center justify-between p-3 bg-background border border-amber-200 dark:border-amber-900/50 rounded-md hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer transition-colors"
                onClick={() => navigate(`/tests/${test.id}`)}
              >
                <div>
                  <p className="font-medium text-sm text-amber-900 dark:text-amber-400">{test.id}</p>
                  <p className="text-xs text-amber-700/80 dark:text-amber-500/80 mt-1">
                    High Confidence {test.prediction?.predictedClass}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-amber-600">
                    {test.prediction?.confidenceScore ? `${(test.prediction.confidenceScore * 100).toFixed(1)}%` : ''}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {new Date(test.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
