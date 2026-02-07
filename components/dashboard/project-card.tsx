// components/dashboard/project-card.tsx
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

type ProjectCardProps = {
  id: string;
  name: string | null;
  status: string | null;
  stage?: string | null;
};

function normaliseStage(stage?: string | null) {
  if (!stage) return 'Unknown';

  return stage.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

const STAGE_HELP: Record<string, string> = {
  Design: 'We are defining requirements, process, scope, and technical approach.',
  Build: 'Development is actively in progress.',
  UAT: 'User Acceptance Testing is underway.',
  Training: 'We are preparing documentation and training materials.',
  Warranty: 'Post-delivery support and fixes.',
  Closed: 'This project has been completed.',
};

function stageBadgeClass(stage: string) {
  switch (stage) {
    case 'Design':
      return 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300';
    case 'Build':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    case 'UAT':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
    case 'Training':
      return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
    case 'Warranty':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    case 'Closed':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function ProjectCard({ id, name, stage }: ProjectCardProps) {
  const stageLabel = normaliseStage(stage);

  return (
    <Link href={`/projects/${id}`} className="group block focus-visible:outline-none">
      <Card
        className={cn(
          'relative h-full overflow-hidden',
          'bg-background/80 backdrop-blur',
          'border transition-all duration-300 ease-out',
          'hover:-translate-y-[2px] hover:shadow-xl',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'motion-reduce:transition-none motion-reduce:hover:translate-y-0 py-0',
        )}
      >
        <CardContent className="flex h-full flex-col justify-between p-5">
          {/* Top */}
          <div className="space-y-2">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight">
              {name ?? 'Untitled project'}
            </h3>

            {/* Stage badge */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'cursor-help px-2 py-0.5 text-[11px] font-medium',
                      stageBadgeClass(stageLabel),
                    )}
                    aria-label={`What does ${stageLabel} mean?`}
                  >
                    {stageLabel}
                  </Badge>
                </TooltipTrigger>

                <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                  {STAGE_HELP[stageLabel] ?? 'Project stage information.'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-6 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>View project</span>

            <ArrowRight
              className={cn(
                'h-3.5 w-3.5 opacity-0 -translate-x-1',
                'transition-all duration-300',
                'group-hover:opacity-100 group-hover:translate-x-0',
                'motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-x-0',
              )}
            />
          </div>

          {/* Hover accent */}
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 h-px',
              'bg-gradient-to-r from-transparent via-foreground/20 to-transparent',
              'opacity-0 transition-opacity duration-300',
              'group-hover:opacity-100',
            )}
          />
        </CardContent>
      </Card>
    </Link>
  );
}
