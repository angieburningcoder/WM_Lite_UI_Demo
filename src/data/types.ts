// Watchmen Lite - Type Definitions

export type RiskLevel = 'H' | 'M' | 'L';
export type Platform = 'Instagram' | 'Facebook' | 'Threads';
export type CaseStatus = 'detected' | 'scheduled' | 'submitted' | 'accepted' | 'success' | 'failed' | 'taken_down' | 'monitoring';
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly';
export type DelegationPreference = 'self_only' | 'delegate_when_needed';

export interface UserProfile {
  displayName: string;
  chineseName: string;
  englishName: string;
  email: string;
  brandNames: string[];
  fanPages: { name: string; url: string }[];
  monitoredKeywords: string[];
  platforms: Platform[];
  timezone: string;
  notificationFrequency: NotificationFrequency;
  delegationPreference: DelegationPreference;
  hasCompletedOnboarding: boolean;
  onboardingCompletedAt?: string;
  loaUploaded?: boolean;
  trademarkProvided?: boolean;
  privacyConsentAccepted?: boolean;
}

export interface StatusTimelineItem {
  status: CaseStatus;
  label: string;
  timestamp: string;
  completed: boolean;
}

export interface Evidence {
  snapshots: {
    id: string;
    type: 'profile' | 'post' | 'bio' | 'story';
    url: string;
    capturedAt: string;
    description: string;
  }[];
  checklist: {
    id: string;
    item: string;
    detected: boolean;
    detail: string;
  }[];
  reportTextBlock: string;
}

export interface Case {
  id: string;
  platform: Platform;
  suspectedAccountName: string;
  suspectedDisplayName: string;
  suspectedUrl: string;
  similarityScore: number;
  followers: number;
  discoveredAt: string;
  riskLevel: RiskLevel;
  currentStatus: CaseStatus;
  currentStatusLabel: string;
  failedReason?: string;
  lastUpdatedAt: string;
  reasons: string[];
  statusTimeline: StatusTimelineItem[];
  recommendedActions: {
    type: 'self' | 'delegate';
    steps: string[];
    sla?: string;
    requiredInfo?: string[];
  }[];
  evidence: Evidence;
}

export interface Alert {
  id: string;
  type: 'new_case' | 'status_update' | 'environment_change' | 'weekly_summary';
  title: string;
  summary: string;
  riskLevel: RiskLevel | null;
  createdAt: string;
  caseId?: string;
  read: boolean;
}

export interface EnvironmentSignal {
  id: string;
  category: 'mention_trend' | 'pattern_change' | 'platform_risk';
  title: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  value?: string;
}

export interface WeeklyReport {
  weekRange: {
    start: string;
    end: string;
  };
  totals: {
    total: number;
    high: number;
    medium: number;
    low: number;
    scheduled: number;
    resolved: number;
  };
  trend: {
    date: string;
    count: number;
  }[];
  environmentSignals: EnvironmentSignal[];
  topCases: string[]; // case IDs
  watchHours: number;
}
