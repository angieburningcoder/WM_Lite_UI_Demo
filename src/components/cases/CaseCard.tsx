'use client';

import Link from 'next/link';
import { ExternalLink, FileText, ChevronRight } from 'lucide-react';
import { Case } from '@/data/types';
import { Card } from '@/components/ui/Card';
import { RiskBadge, PlatformBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime, formatNumber, cn } from '@/lib/utils';

interface CaseCardProps {
  caseData: Case;
  compact?: boolean;
}

export function CaseCard({ caseData, compact = false }: CaseCardProps) {
  return (
    <Card hover className={cn(compact && 'p-4')}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <RiskBadge level={caseData.riskLevel} size="sm" />
            <PlatformBadge platform={caseData.platform} size="sm" />
          </div>

          <h3 className="font-medium text-white truncate">
            @{caseData.suspectedAccountName}
          </h3>
          <p className="text-sm text-slate-400 truncate mt-0.5">
            {caseData.suspectedDisplayName}
          </p>

          {!compact && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-slate-500">
              <span>相似度 {caseData.similarityScore}%</span>
              <span>{formatNumber(caseData.followers)} 追蹤者</span>
              <span>{formatRelativeTime(caseData.discoveredAt)}</span>
            </div>
          )}

          {!compact && caseData.reasons.length > 0 && (
            <p className="text-sm text-slate-400 mt-3 line-clamp-2">
              {caseData.reasons[0]}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 sm:items-end">
          <Link href={`/cases/${caseData.id}`} className="flex-1 sm:flex-initial">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              查看詳情
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/evidence/${caseData.id}`} className="flex-1 sm:flex-initial">
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">
              <FileText className="w-4 h-4" />
              證據包
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

interface CaseListProps {
  cases: Case[];
  emptyMessage?: string;
}

export function CaseList({ cases, emptyMessage = '目前沒有符合條件的案件' }: CaseListProps) {
  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cases.map((caseData) => (
        <CaseCard key={caseData.id} caseData={caseData} />
      ))}
    </div>
  );
}
