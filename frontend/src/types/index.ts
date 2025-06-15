export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any; // Para erros de validação Zod
}

export interface CollectPeopleRequest {
  query: string;
  limit: number;
}

export interface CollectResult {
  found?: number;
  saved?: number;
  duplicates?: number;
  errors?: number;
  pending?: number;
  requested?: number;
  processed?: number;
}

export interface PendingProfilesStatus {
  totalPeople: number;
  totalProfiles: number;
  pendingProfiles: number;
  completionRate: number;
}

export interface DataStats {
  totalPeople: number;
  totalProfiles: number;
  verifiedPeople: number;
  processedProfiles: number;
  averageCompletion: number;
  verificationRate: number;
  processingRate: number;
}

export interface SkillCount {
  skill: string;
  count: number;
}

export interface LanguageCount {
  language: string;
  count: number;
}

export interface SeniorityDistribution {
  junior: number;
  mid: number;
  senior: number;
  lead: number;
}

export interface TopProfile {
  name: string;
  username: string;
  completion: number;
  verified: boolean;
}

export interface QueryStat {
  query: string;
  count: number;
  avgCompletion: number;
  verifiedCount: number;
}

export interface Insights {
  topSkills: SkillCount[];
  languageDistribution: LanguageCount[];
  seniorityDistribution: SeniorityDistribution;
  topProfiles: TopProfile[];
  dataQuality: DataStats;
  queryStats: QueryStat[];
}
