import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SpectrumChartProps {
  data: Array<{ wavelength: number; original: number; processed: number }>;
  viewMode: 'original' | 'processed';
}

export function SpectrumChart({ data, viewMode }: SpectrumChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-muted/20 border rounded-lg">
        <p className="text-muted-foreground text-sm">No spectral data available</p>
      </div>
    );
  }

  const isProcessed = viewMode === 'processed';

  return (
    <div className="w-full h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20, // Tighter left margin since we don't really show Y ticks
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
          <XAxis 
            dataKey="wavelength" 
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
            tickLine={false}
            axisLine={false}
            domain={['dataMin', 'dataMax']}
            type="number"
            tickCount={6}
            name="Wavelength (nm)"
          />
          <YAxis 
            tick={false} 
            axisLine={false}
            tickLine={false}
            domain={[0, 100]} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '12px' }}
            labelFormatter={(label) => `${label} nm`}
            formatter={(value: any) => [(Number(value) || 0).toFixed(1), 'Intensity']}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey={isProcessed ? "processed" : "original"}
            stroke={isProcessed ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
            fillOpacity={isProcessed ? 0.2 : 0.1}
            fill={isProcessed ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
            strokeWidth={isProcessed ? 2 : 1.5}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
