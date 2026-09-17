import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

// Reuse MapDataPoint type or define local test type
export interface ReportTestRecord {
  testId: string;
  classification: string;
  adulterant: string | null;
  confidence: number;
  timestamp: string;
  latitude?: number;
  longitude?: number;
}

interface ReportDataTableProps {
  tests: ReportTestRecord[];
}

export function ReportDataTable({ tests }: ReportDataTableProps) {
  const navigate = useNavigate();

  return (
    <Card className="card-print">
      <CardHeader className="no-print">
        <CardTitle className="text-lg">Filtered Test Records</CardTitle>
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
                <th className="px-4 py-3 font-medium text-right no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No tests found for the selected filters.
                  </td>
                </tr>
              ) : (
                tests.map((test) => {
                  const isPure = test.classification === 'PURE';
                  return (
                    <tr key={test.testId} className="hover:bg-muted/20 transition-colors page-break-inside-avoid">
                      <td className="px-4 py-3 font-medium">{test.testId}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(test.timestamp).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Badge variant={isPure ? 'success' : 'warning'} className="font-normal print-border">
                          {isPure ? 'Pure' : 'Adulterated'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {isPure ? '-' : <span className="text-amber-600 font-medium">{test.adulterant}</span>}
                      </td>
                      <td className="px-4 py-3">
                        {test.confidence ? `${(test.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-right no-print">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/tests/${test.testId}`)}>
                          View Test
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3 no-print">
          {tests.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground border rounded-md">
              No tests found for the selected filters.
            </div>
          ) : (
            tests.map((test) => {
              const isPure = test.classification === 'PURE';
              return (
                <div 
                  key={test.testId} 
                  className="p-3 border rounded-md hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/tests/${test.testId}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{test.testId}</span>
                    <Badge variant={isPure ? 'success' : 'warning'} className="text-[10px] px-1.5 h-4">
                      {isPure ? 'Pure' : 'Adulterated'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                    <div>
                      <p className="mb-0.5">Date</p>
                      <p className="font-medium text-foreground">{new Date(test.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="mb-0.5">Adulterant</p>
                      <p className="font-medium text-foreground">{isPure ? '-' : test.adulterant}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs h-7">
                    View Details
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
