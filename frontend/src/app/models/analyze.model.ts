export interface Suggestion {
  priority: 'critical' | 'warning' | 'tip';
  title: string;
  body: string;
}

export interface Dimension {
  name: string;
  score: number;
}

export interface AnalyzerResult {
  ats_score: number;
  readability_score: number;
  job_match_score: number | null;
  dimensions: Dimension[];
  keywords_found: string[];
  keywords_missing: string[];
  job_match_details: string | null;
  suggestions: Suggestion[];
}
