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
    card: 'suggestion critical',
    title: 'text-inherit',
    body: 'text-inherit opacity-80',
    iconBg: 'bg-black/20',
    icon: 'report_problem',
  },
  warning: {
    card: 'suggestion warning',
    title: 'text-inherit',
    body: 'text-inherit opacity-80',
    iconBg: 'bg-black/20',
    icon: 'warning',
  },
  tip: {
    card: 'suggestion tip',
    title: 'text-inherit',
    body: 'text-inherit opacity-80',
    iconBg: 'bg-black/20',
    icon: 'lightbulb',
  },
};
