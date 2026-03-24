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
    card: 'bg-error-50 dark:bg-slate-900/40 border-error-100 dark:border-error-900/30',
    title: 'text-error-900 dark:text-error-400',
    body: 'text-error-800 dark:text-error-200',
    iconBg: 'bg-error-100 dark:bg-error-900/40',
    icon: 'report_problem',
  },
  warning: {
    card: 'bg-warning-50 dark:bg-slate-900/40 border-warning-100 dark:border-warning-900/30',
    title: 'text-warning-900 dark:text-warning-400',
    body: 'text-warning-800 dark:text-warning-200',
    iconBg: 'bg-warning-100 dark:bg-warning-900/40',
    icon: 'warning',
  },
  tip: {
    card: 'bg-success-50 dark:bg-slate-900/40 border-success-100 dark:border-success-900/30',
    title: 'text-success-900 dark:text-success-400',
    body: 'text-success-800 dark:text-success-200',
    iconBg: 'bg-success-100 dark:bg-success-900/40',
    icon: 'lightbulb',
  },
};
