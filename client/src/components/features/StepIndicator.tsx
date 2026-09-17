

import { Check } from 'lucide-react';

interface Step {
  id: string;
  name: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStepIndex: number;
}

export function StepIndicator({ steps, currentStepIndex }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <li key={step.name} className="md:flex-1">
              {isCompleted ? (
                <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-primary flex items-center gap-2">
                    <Check className="h-4 w-4" /> Step {index + 1}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : isCurrent ? (
                <div className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" aria-current="step">
                  <span className="text-sm font-medium text-primary">Step {index + 1}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-muted py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-muted-foreground">Step {index + 1}</span>
                  <span className="text-sm font-medium text-muted-foreground">{step.name}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
