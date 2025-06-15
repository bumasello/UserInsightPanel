export interface SearchPeopleRequest {
  query: string;
  torreGgId?: string;
  identityType: "person" | "organization" | "all";
  limit?: number;
  meta?: boolean;
  excluding?: string[];
  excludedPeople?: string[];
  excludeContacts?: boolean;
}

export interface SearchPeopleResponse {
  ardaId: number;
  ggId: string;
  name: string;
  comparableName: string;
  username: string;
  professionalHeadline: string;
  imageUrl: string | null;
  completion: number;
  grammar: number;
  weight: number;
  verified: boolean;
  connections: any[];
  totalStrength: number;
  pageRank: number;
  organizationId: string | null;
  organizationNumericId: number | null;
  publicId: string | null;
  status: string | null;
  creators: any[];
  relationDegree: number;
  isSearchable: boolean;
  contact: boolean;
}

export interface GenomeResponse {
  person: {
    ardaId: number;
    name: string;
    username: string;
    professionalHeadline?: string;
    completion?: number;
    showPhone?: boolean;
    created?: string;
    verified?: boolean;
    flags?: {
      canInviteToApply?: boolean;
      canInviteToOpen?: boolean;
      canSendCommunityInvites?: boolean;
      canEdit?: boolean;
      canReport?: boolean;
      isEditable?: boolean;
      isInvitedByMe?: boolean;
    };
    weight?: number;
    locale?: string;
    subjectId?: number;
    picture?: string;
    hasEmail?: boolean;
    isTest?: boolean;
    isBot?: boolean;
  };
  stats?: {
    views?: number;
    applicationsInTheLastMonth?: number;
    directApplicationsInTheLastMonth?: number;
  };
  strengths?: Array<{
    id: string;
    name: string;
    weight: number;
    recommendations?: number;
    media?: any[];
  }>;
  interests?: Array<{
    id: string;
    name: string;
    weight: number;
    recommendations?: number;
    media?: any[];
  }>;
  experiences?: Array<{
    id: string;
    category: string;
    name: string;
    organizations?: any[];
    responsibilities?: string[];
    fromMonth?: string;
    fromYear?: string;
    toMonth?: string;
    toYear?: string;
    additionalInfo?: string;
    highlighted?: boolean;
    weight?: number;
    verifications?: number;
    recommendations?: number;
    media?: any[];
    rank?: number;
    strengths?: any[];
  }>;
  jobs?: any[];
  projects?: any[];
  publications?: any[];
  education?: Array<{
    id: string;
    category: string;
    name: string;
    organizations?: any[];
    responsibilities?: string[];
    fromMonth?: string;
    fromYear?: string;
    toMonth?: string;
    toYear?: string;
    additionalInfo?: string;
    highlighted?: boolean;
    weight?: number;
    verifications?: number;
    recommendations?: number;
    media?: any[];
    rank?: number;
    strengths?: any[];
  }>;
  opportunities?: any[];
  languages?: Array<{
    code: string;
    language: string;
    fluency: string;
  }>;
  username: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface DataCollectionResult {
  collected: number;
  duplicates: number;
  errors: number;
}

export interface DataStats {
  overview: {
    totalPeople: number;
    totalProfiles: number;
    processedProfiles: number;
    pendingProfiles: number;
    errorProfiles: number;
    verifiedPeople: number;
    processingRate: number;
  };
  topProfiles: any[];
  recentCollections: Array<{
    _id: string;
    count: number;
  }>;
}
