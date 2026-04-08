'use client';

import Link from 'next/link';
import { ArrowLeft, FolderOpen, ChevronRight, Clock } from 'lucide-react';
import { RiskBadge, PlatformBadge, StatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/Skeleton';
import { cases } from '@/data/mockData';
import { formatRelativeTime } from '@/lib/utils';
import { Case } from '@/data/types';

const TRACKED_STATUSES = ['scheduled', 'submitted', 'accepted', 'success', 'failed', 'taken_down'] as const;

const STAGES: { status: typeof TRACKED_STATUSES[number]; label: string; description: string }[] = [
  { status: 'scheduled', label: '已排程', description: '系統自動建立，待送件' },
  { status: 'submitted', label: '已送件', description: '平台審核中' },
  { status: 'accepted', label: '已受理', description: '平台已確認受理，處理中' },
  { status: 'success', label: '下架成功', description: '處理完成' },
  { status: 'taken_down', label: '已確認下架', description: '非人工處理，來源不明' },
  { status: 'failed', label: '申請失敗', description: '平台未通過申請' },
];

function CaseRow({ c }: { c: Case }) {
  return (
    <Link href={`/cases/${c.id}`}>
      <div className="group flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70 transition-all cursor-pointer">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
          <RiskBadge level={c.riskLevel} size="sm" />
          <PlatformBadge platform={c.platform} size="sm" />
        </div>

        {/* Account info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">@{c.suspectedAccountName}</p>
          {c.failedReason ? (
            <p className="text-xs text-rose-400 truncate">{c.failedReason}</p>
          ) : (
            <p className="text-xs text-slate-500 truncate">{c.suspectedDisplayName}</p>
          )}
        </div>

        {/* Last updated (ops sync indicator) */}
        <div className="flex-shrink-0 flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatRelativeTime(c.lastUpdatedAt)}</span>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </div>
    </Link>
  );
}

export default function CasesPage() {
  const trackedCases = cases.filter(c => (TRACKED_STATUSES as readonly string[]).includes(c.currentStatus));

  const stageCases = {
    scheduled: trackedCases.filter(c => c.currentStatus === 'scheduled'),
    submitted: trackedCases.filter(c => c.currentStatus === 'submitted'),
    accepted: trackedCases.filter(c => c.currentStatus === 'accepted'),
    success: trackedCases.filter(c => c.currentStatus === 'success'),
    taken_down: trackedCases.filter(c => c.currentStatus === 'taken_down'),
    failed: trackedCases.filter(c => c.currentStatus === 'failed'),
  };

  return (
    <div className="py-6 sm:py-8 relative overflow-hidden">
      <div className="absolute top-20 right-0 w-80 h-80 bg-blue-500/8 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          返回首頁
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Case Tracker</h1>
        </div>
        <p className="text-slate-400 text-base mb-8">追蹤排程 · 送件 · 下架進度</p>

        {/* Three Stages */}
        {trackedCases.length === 0 ? (
          <EmptyState
            title="目前沒有進行中的案件"
            description="系統尚未自動排程任何案件，我們持續監控中。"
            icon="shield"
          />
        ) : (
          <div className="space-y-8">
            {STAGES.map(stage => {
              const list = stageCases[stage.status];
              return (
                <div key={stage.status}>
                  {/* Stage Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <StatusBadge status={stage.status} size="md" />
                    <p className="text-sm text-slate-500">{stage.description}</p>
                    {list.length > 0 && (
                      <span className="ml-auto text-xs font-bold text-slate-500">{list.length} 件</span>
                    )}
                  </div>

                  {/* Case Rows */}
                  {list.length > 0 ? (
                    <div className="space-y-2">
                      {list.map(c => <CaseRow key={c.id} c={c} />)}
                    </div>
                  ) : (
                    <div className="py-6 text-center rounded-xl border border-dashed border-slate-700/50">
                      <p className="text-slate-600 text-sm">目前無案件</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Internal ops note */}
        <p className="text-center text-slate-600 text-xs mt-10">
          案件狀態由 Watchmen 團隊人工更新 · 最後同步時間顯示於各案件右側
        </p>
      </div>
    </div>
  );
}
