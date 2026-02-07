import { cn } from '@/lib/utils';

type TrustFooterProps = {
  stage: string;
  status: 'Open' | 'Closed' | null;
};

function contentFor(stage: string, status: TrustFooterProps['status']) {
  if (status === 'Closed') {
    return {
      title: 'Project complete',
      body: 'This project has been completed. If you have any follow-up questions or need further support, please get in touch and we’ll be happy to help.',
    };
  }

  switch (stage) {
    case 'Design':
      return {
        title: 'What happens next',
        body: 'We’re currently finalising requirements and approach. If we need clarification or input, we’ll reach out directly. You’ll see updates here as progress continues.',
      };

    case 'Build':
      return {
        title: 'What happens next',
        body: 'Development is actively underway. We’ll continue progressing the work and post updates here as key milestones are reached.',
      };

    case 'UAT':
      return {
        title: 'Action may be required',
        body: 'We’re in user acceptance testing. Please review any updates carefully and let us know if changes are needed so we can move things forward.',
      };

    case 'Training':
      return {
        title: 'Preparing handover',
        body: 'We’re preparing documentation and training materials. You’ll be notified when sessions are scheduled or materials are ready.',
      };

    case 'Warranty':
      return {
        title: 'Post-delivery support',
        body: 'The project is now in its warranty period. We’ll address any issues that arise and keep this page updated as needed.',
      };

    default:
      return {
        title: 'What happens next',
        body: 'We’ll continue progressing this project and update this page as work moves forward. You’ll be notified if we need anything from you.',
      };
  }
}

export function TrustFooter({ stage, status }: TrustFooterProps) {
  const content = contentFor(stage, status);

  return (
    <div
      className={cn(
        'rounded-lg border border-dashed',
        'border-border/60 dark:border-white/10',
        'bg-background/50 dark:bg-background/30',
        'px-4 py-3',
      )}
    >
      <p className="text-sm font-medium">{content.title}</p>

      <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-3xl">{content.body}</p>
    </div>
  );
}
