'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FolderOpen, ChevronRight, Clock, ChevronLeft, Info } from 'lucide-react';
import { RiskBadge, PlatformBadge, StatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/Skeleton';
import { cases } from '@/data/mockData';
import { formatRelativeTime } from '@/lib/utils';
import { Case } from '@/data/types';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 5;

const TABS = [
  { status: 'scheduled',  label: '已排程' },
  { status: 'submitted',  label: '已送件' },
  { status: 'accepted',   label: '已受理' },
  { status: 'success',    label: '下架成功' },
  { status: 'taken_down', label: '已確認下架' },
  { status: 'failed',     label: '申請失敗' },
] as const;

type TabStatus = typeof TABS[number]['status'];

function CaseRow({ c }: { c: Case }) {
  return (
    <Link href={`/cases/${c.id}`}>
      <div className="group flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70 transition-all cursor-pointer">
        <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
          <RiskBadge level={c.riskLevel} size="sm" />
          <PlatformBadge platform={c.platform} size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">@{c.suspectedAccountName}</p>
          {c.failedReason ? (
            <p className="text-xs text-rose-400 truncate">{c.failedReason}</p>
          ) : (
            <p className="text-xs text-slate-500 truncate">{c.suspectedDisplayName}</p>
          )}
        </div>
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
  const [activeTab, setActiveTab] = useState<TabStatus>('scheduled');
  const [page, setPage] = useState(1);

  const allTracked = cases.filter(c =>
    TABS.some(t => t.status === c.currentStatus)
  );

  const countByStatus = Object.fromEntries(
    TABS.map(t => [t.status, allTracked.filter(c => c.currentStatus === t.status).length])
  ) as Record<TabStatus, number>;

  const activeList = allTracked.filter(c => c.currentStatus === activeTab);
  const totalPages = Math.ceil(activeList.length / PAGE_SIZE);
  const paginated = activeList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTabChange = (status: TabStatus) => {
    setActiveTab(status);
    setPage(1);
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
        <p className="text-slate-400 text-base mb-4">追蹤排程 · 送件 · 下架進度</p>

        {/* Data Retention Notice */}
        <div className="flex items-start gap-2.5 mb-6 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Case Tracker 僅顯示<span className="font-semibold text-slate-300"> 本月內</span>的立案紀錄。超過一個月的案件將自動移除，如需查詢歷史紀錄請聯繫 Watchmen 團隊。
          </p>
        </div>

        {allTracked.length === 0 ? (
          <EmptyState
            title="目前沒有進行中的案件"
            description="系統尚未自動排程任何案件，我們持續監控中。"
            icon="shield"
          />
        ) : (
          <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-700/50 scrollbar-none">
              {TABS.map(tab => {
                const count = countByStatus[tab.status];
                const isActive = activeTab === tab.status;
                return (
                  <button
                    key={tab.status}
                    onClick={() => handleTabChange(tab.status)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all flex-shrink-0',
                      isActive
                        ? 'border-white text-white'
                        : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
                    )}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full font-bold',
                        isActive ? 'bg-white/15 text-white' : 'bg-slate-700/60 text-slate-400'
                      )}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab description */}
            <div className="px-4 pt-3 pb-1">
              <p className="text-xs text-slate-500">
                <StatusBadge status={activeTab} size="sm" />
                <span className="ml-2">
                  {TABS.find(t => t.status === activeTab)?.label} · 共 {activeList.length} 件
                </span>
              </p>
            </div>

            {/* Case List */}
            <div className="p-4 space-y-2 min-h-[200px]">
              {paginated.length > 0 ? (
                paginated.map(c => <CaseRow key={c.id} c={c} />)
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-slate-600 text-sm">此狀態目前無案件</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  上一頁
                </button>
                <span className="text-xs text-slate-500">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  下一頁
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-slate-600 text-xs mt-8">
          案件狀態由 Watchmen 團隊人工更新 · 最後同步時間顯示於各案件右側
        </p>
      </div>
    </div>
  );
}
