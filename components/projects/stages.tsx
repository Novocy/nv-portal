'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PencilRuler, Hammer, Bug, GraduationCap, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const STAGES = [
  { key: 'design', label: 'Design', icon: PencilRuler },
  { key: 'build', label: 'Build', icon: Hammer },
  { key: 'uat', label: 'UAT', icon: Bug },
  { key: 'training', label: 'Training', icon: GraduationCap },
  { key: 'warranty', label: 'Warranty', icon: ShieldCheck },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
] as const;

export type StageKey = (typeof STAGES)[number]['key'];

interface StageTimelineProps {
  activeStage: StageKey;
}

export function StageTimeline({ activeStage }: StageTimelineProps) {
  const activeIndex = STAGES.findIndex((stage) => stage.key === activeStage);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center gap-0">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;

          return (
            <React.Fragment key={stage.key}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors',
                      isActive && 'bg-primary text-primary-foreground border-primary',
                      isCompleted && 'bg-muted text-foreground border-border',
                      !isActive &&
                        !isCompleted &&
                        'bg-background text-muted-foreground border-border hover:text-foreground',
                    )}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <Icon className="h-4 w-4" />

                    {isActive && (
                      <span className="absolute top-12 whitespace-nowrap text-xs font-medium text-foreground">
                        {stage.label}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>

                {!isActive && (
                  <TooltipContent side="top">
                    <span className="text-xs font-medium">{stage.label}</span>
                  </TooltipContent>
                )}
              </Tooltip>

              {index < STAGES.length - 1 && (
                <div
                  className={cn(
                    'h-px w-12 transition-colors',
                    index < activeIndex ? 'bg-foreground' : 'bg-border',
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
