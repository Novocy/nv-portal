import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type ServiceUpdate = {
  id: string;
  title: string | null;
  body: string | null;
  occurred_at: string;
  type: 'update' | 'message' | 'action' | 'milestone';
};

function formatDateTime(date: string) {
  const d = new Date(date);
  return `${d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })} · ${d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

function typeStyles(type: ServiceUpdate['type']) {
  switch (type) {
    case 'message':
      return {
        badge: 'bg-primary/60 text-white dark:bg-primary/50 dark:text-white',
        dot: 'bg-blue-500',
        surface: 'bg-background/60 dark:bg-background/40 border-border/50 dark:border-white/10',
      };

    case 'action':
      return {
        badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
        dot: 'bg-amber-500',
        surface: 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/40 dark:border-amber-900/40',
      };

    case 'milestone':
      return {
        badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
        dot: 'bg-emerald-500',
        surface:
          'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/40 dark:border-emerald-900/40',
      };

    default:
      return {
        badge: 'bg-muted text-muted-foreground',
        dot: 'bg-foreground/60',
        surface: 'bg-background/60 dark:bg-background/40 border-border/50 dark:border-white/10',
      };
  }
}

function labelForType(type: ServiceUpdate['type']) {
  switch (type) {
    case 'message':
      return 'Message';
    case 'action':
      return 'Action required';
    case 'milestone':
      return 'Milestone';
    default:
      return 'Update';
  }
}

export function ServiceUpdatesTimeline({ updates }: { updates: ServiceUpdate[] }) {
  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-sm font-semibold tracking-tight">Service updates</h2>
        <p className="text-sm text-muted-foreground">
          Progress and communication from the Novocy delivery team.
        </p>
      </div>

      {/* Empty */}
      {updates.length === 0 && (
        <div
          className="
            rounded-lg border border-dashed
            border-border/60 dark:border-white/10
            bg-background/50 dark:bg-background/30
            p-6
          "
        >
          <p className="text-sm text-muted-foreground">
            No updates yet. Progress updates will appear here as work continues.
          </p>
        </div>
      )}

      {/* Timeline */}
      {updates.length > 0 && (
        <div className="relative space-y-10 pl-4">
          {/* Vertical line */}
          <span
            aria-hidden
            className="
              absolute left-[22px] top-0 h-full w-px
              bg-border/70 dark:bg-white/10
            "
          />

          {updates.map((u) => {
            const styles = typeStyles(u.type);

            return (
              <div key={u.id} className="relative grid grid-cols-[auto_1fr] gap-5">
                {/* Dot */}
                <span
                  aria-hidden
                  className={cn(
                    'mt-2 h-3 w-3 rounded-full ring-2 ring-background dark:ring-background',
                    styles.dot,
                  )}
                />

                {/* Content */}
                <div
                  className={cn(
                    'rounded-xl border p-5 space-y-3',
                    'backdrop-blur-sm',
                    styles.surface,
                  )}
                >
                  {/* Title row */}
                  <div className="flex flex-wrap items- justify-between gap-2">
                    <p className="text-sm font-medium leading-tight">
                      {u.title ?? labelForType(u.type)}
                    </p>

                    <Badge
                      variant="secondary"
                      className={cn('text-[11px] font-medium', styles.badge)}
                    >
                      {labelForType(u.type)}
                    </Badge>
                  </div>

                  {/* Body */}
                  {u.body && (
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                      {u.body}
                    </p>
                  )}

                  {/* Timestamp */}
                  <p className="text-xs text-muted-foreground">{formatDateTime(u.occurred_at)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
