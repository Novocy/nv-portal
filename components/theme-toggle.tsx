'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      aria-label='Toggle theme'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative h-9 w-9 rounded-md',
        'hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring',
        className,
      )}
    >
      <Sun
        className={cn(
          'absolute h-4 w-4 transition-all',
          isDark ? 'scale-0 rotate-90' : 'scale-100 rotate-0',
        )}
      />
      <Moon
        className={cn(
          'absolute h-4 w-4 transition-all',
          isDark ? 'scale-100 rotate-0' : 'scale-0 rotate-90',
        )}
      />
    </Button>
  );
}
