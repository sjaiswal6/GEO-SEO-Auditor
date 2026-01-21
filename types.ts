
export interface AuditResult {
  seoScore: number;
  geoScore: number;
  seoSummary: string;
  geoSummary: string;
  seoImprovements: Improvement[];
  geoImprovements: Improvement[];
  metaTags: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface Improvement {
  category: string;
  suggestion: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'Easy' | 'Moderate' | 'Hard';
}

export interface AnalysisState {
  loading: boolean;
  error: string | null;
  result: AuditResult | null;
}
