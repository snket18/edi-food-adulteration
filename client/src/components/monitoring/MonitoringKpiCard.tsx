import { Card, CardContent } from '../ui/Card';
import type { ReactNode } from 'react';

interface MonitoringKpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function MonitoringKpiCard({ title, value, subtitle, icon, trend }: MonitoringKpiCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-md">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${
            trend === 'up' ? 'text-green-600 dark:text-green-400' : 
            trend === 'down' ? 'text-amber-600 dark:text-amber-400' : 
            'text-muted-foreground'
          }`}>
            {subtitle}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
