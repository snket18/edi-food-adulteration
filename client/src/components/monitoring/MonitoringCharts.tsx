import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import type { TrendDataPoint, AdulterantDistribution } from '../../utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface TrendChartProps {
  data: TrendDataPoint[];
}

export function TestingTrendChart({ data }: TrendChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Testing Activity (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#111827', fontWeight: 500 }}
              />
              <Area 
                type="monotone" 
                dataKey="tests" 
                name="Tests Performed"
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorTests)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface ClassificationChartProps {
  pureCount: number;
  adulteratedCount: number;
}

export function ClassificationChart({ pureCount, adulteratedCount }: ClassificationChartProps) {
  const data = [
    { name: 'Pure', value: pureCount, color: '#10b981' },
    { name: 'Adulterated', value: adulteratedCount, color: '#f59e0b' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Classification Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#111827', fontWeight: 500 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-6 mt-2 w-full justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="text-sm">
              <span className="text-muted-foreground">Pure: </span>
              <span className="font-semibold">{pureCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="text-sm">
              <span className="text-muted-foreground">Adulterated: </span>
              <span className="font-semibold">{adulteratedCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AdulterantChartProps {
  data: AdulterantDistribution[];
}

export function AdulterantChart({ data }: AdulterantChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detected Adulterants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <RechartsTooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#111827', fontWeight: 500 }}
              />
              <Bar dataKey="count" name="Samples" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
