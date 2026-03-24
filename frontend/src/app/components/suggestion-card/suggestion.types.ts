export type SuggestionPriority = 'critical' | 'warning' | 'tip';

export interface Suggestion {
  priority: SuggestionPriority;
  title: string;
  body: string;
  example?: string | null;
}

export interface PriorityConfig {
  card: string;
  title: string;
  body: string;
  iconBg: string;
  icon: string;
}

export const PRIORITY_CONFIG: Record<SuggestionPriority, PriorityConfig> = {
  critical: {
    card: 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/50',
    title: 'text-rose-900 dark:text-rose-400',
    body: 'text-rose-800/90 dark:text-rose-200/80',
    iconBg: 'bg-rose-100 dark:bg-rose-900/50',
    icon: 'report_problem',
  },
  warning: {
    card: 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50',
    title: 'text-amber-900 dark:text-amber-400',
    body: 'text-amber-800/90 dark:text-amber-200/80',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    icon: 'warning',
  },
  tip: {
    card: 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50',
    title: 'text-emerald-900 dark:text-emerald-400',
    body: 'text-emerald-800/90 dark:text-emerald-200/80',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    icon: 'lightbulb',
  },
};
