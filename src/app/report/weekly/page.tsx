'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, Calendar, CheckCircle, ChevronRight, FileText, Hash } from 'lucide-react';
import { TrendChart } from '@/components/charts/TrendChart';
import { RiskBadge, PlatformBadge } from '@/components/ui/Badge';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { weeklyReport, cases } from '@/data/mockData';
import { formatDateTime, cn } from '@/lib/utils';
import { useSettings } from '@/lib/useSettings';
import { Case } from '@/data/types';

type RangeType = 'week' | 'month' | 'custom';

// Mock monthly data (4 weeks)
const monthlyTrend = [
  { date: '第 1 週', count: 8 },
  { date: '第 2 週', count: 14 },
  { date: '第 3 週', count: 11 },
  { date: '第 4 週', count: 9 },
];

function getChartData(type: RangeType, customStart: string, customEnd: string) {
  if (type === 'week') return weeklyReport.trend;
  if (type === 'month') return monthlyTrend;
  // custom: generate daily points between start and end
  if (!customStart || !customEnd) return weeklyReport.trend;
  const start = new Date(customStart);
  const end = new Date(customEnd);
  const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  if (diffDays <= 0) return weeklyReport.trend;
  // ≤ 14 days → daily, > 14 days → weekly buckets
  if (diffDays <= 14) {
    return Array.from({ length: diffDays }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      // pseudo-random but stable count based on day
      const count = ((d.getDate() * 3 + d.getMonth() * 7) % 6) + 1;
      return { date: `${d.getMonth() + 1}/${d.getDate()}`, count };
    });
  }
  // weekly buckets
  const weeks = Math.ceil(diffDays / 7);
  return Array.from({ length: weeks }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i * 7);
    const count = ((d.getDate() * 5 + i * 3) % 10) + 3;
    return { date: `${d.getMonth() + 1}/${d.getDate()}週`, count };
  });
}

function getRangeLabel(type: RangeType, customStart: string, customEnd: string): string {
  const now = new Date(weeklyReport.weekRange.end); // anchor to mock data date
  if (type === 'week') {
    const start = new Date(weeklyReport.weekRange.start);
    const end = new Date(weeklyReport.weekRange.end);
    return `${start.getMonth() + 1}/${start.getDate()} – ${end.getMonth() + 1}/${end.getDate()}`;
  }
  if (type === 'month') {
    return `${now.getFullYear()} 年 ${now.getMonth() + 1} 月`;
  }
  if (customStart && customEnd) {
    const s = new Date(customStart);
    const e = new Date(customEnd);
    return `${s.getMonth() + 1}/${s.getDate()} – ${e.getMonth() + 1}/${e.getDate()}`;
  }
  return '自訂區間';
}

function filterCasesByRange(allCases: Case[], type: RangeType, customStart: string, customEnd: string): Case[] {
  let start: Date;
  let end: Date;

  if (type === 'week') {
    start = new Date(weeklyReport.weekRange.start);
    end = new Date(weeklyReport.weekRange.end);
    end.setHours(23, 59, 59);
  } else if (type === 'month') {
    const anchor = new Date(weeklyReport.weekRange.end);
    start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 23, 59, 59);
  } else {
    if (!customStart || !customEnd) return allCases.filter(c => c.currentStatus === 'scheduled');
    start = new Date(customStart);
    end = new Date(customEnd);
    end.setHours(23, 59, 59);
  }

  return allCases.filter(c => {
    if (c.currentStatus !== 'scheduled') return false;
    const d = new Date(c.discoveredAt);
    return d >= start && d <= end;
  });
}

// Format internal case ID for display: case-001 → WL-001
function formatCaseId(id: string): string {
  const num = id.replace(/\D/g, '');
  return `WL-${num.padStart(3, '0')}`;
}

function buildCaseAnalysis(c: Case): { sendReason: string; riskSummary: string } {
  const platformLabel = c.platform === 'Instagram' ? 'Instagram' : c.platform === 'Facebook' ? 'Facebook' : 'Threads';
  const sendReason = `帳號 @${c.suspectedAccountName} 在 ${platformLabel} 平台的相似度達 ${c.similarityScore}%，符合自動排程標準（需 ≥ 85%）。系統已建立案件並排程處理。`;
  const riskSummary = c.reasons[0] ?? '偵測到多項偽冒特徵，建議優先處理。';
  return { sendReason, riskSummary };
}

export default function ReportsCenterPage() {
  const { settings, isLoaded } = useSettings();
  const [rangeType, setRangeType] = useState<RangeType>('week');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const rangeLabel = getRangeLabel(rangeType, customStart, customEnd);
  const chartData = useMemo(
    () => getChartData(rangeType, customStart, customEnd),
    [rangeType, customStart, customEnd]
  );
  const scheduledCases = useMemo(
    () => filterCasesByRange(cases, rangeType, customStart, customEnd),
    [rangeType, customStart, customEnd]
  );

  if (!isLoaded) return <PageSkeleton />;

  const { total, scheduled, resolved } = weeklyReport.totals;

  const rangeOptions: { label: string; value: RangeType }[] = [
    { label: '本週', value: 'week' },
    { label: '本月', value: 'month' },
    { label: '自訂', value: 'custom' },
  ];

  return (
    <div className="py-6 sm:py-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          返回首頁
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">Reports Center</h1>
          <p className="text-slate-400 text-base">{settings.displayName || settings.chineseName || '使用者'}</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">時間區段</p>
          <div className="flex gap-2 flex-wrap">
            {rangeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setRangeType(opt.value)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-bold transition-all',
                  rangeType === opt.value
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom date inputs */}
          {rangeType === 'custom' && (
            <div className="flex items-center gap-3 mt-4">
              <input
                type="date"
                value={customStart}
                onChange={e => setCustomStart(e.target.value)}
                className="flex-1 bg-slate-900/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]"
              />
              <span className="text-slate-500 text-sm flex-shrink-0">至</span>
              <input
                type="date"
                value={customEnd}
                min={customStart}
                onChange={e => setCustomEnd(e.target.value)}
                className="flex-1 bg-slate-900/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]"
              />
            </div>
          )}

          {/* Current range display */}
          <p className="text-xs text-slate-500 mt-3">
            顯示範圍：<span className="text-slate-300 font-medium">{rangeLabel}</span>
          </p>
        </div>

        {/* 3 Key Metrics */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white">{total}</p>
            <p className="text-xs text-slate-400 mt-1">偵測總數</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-center">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-3xl font-black text-rose-300">{scheduled}</p>
            <p className="text-xs text-slate-400 mt-1">已排程數</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-300">{resolved}</p>
            <p className="text-xs text-slate-400 mt-1">已下架成功</p>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="mb-8 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          <p className="text-sm font-bold text-slate-300 mb-4">
            {rangeType === 'week' ? '本週' : rangeType === 'month' ? '本月' : '區間'}偵測趨勢
          </p>
          <TrendChart data={chartData} />
        </div>

        {/* Scheduled Cases */}
        {scheduledCases.length > 0 ? (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-black text-white bg-rose-500 px-2.5 py-1 rounded-full">
                {scheduledCases.length} 件已排程
              </span>
              <p className="text-sm text-slate-400">系統自動建立，等待送件處理</p>
            </div>

            <div className="space-y-3">
              {scheduledCases.map(c => {
                const { sendReason, riskSummary } = buildCaseAnalysis(c);
                return (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 hover:border-rose-400/50 transition-all"
                  >
                    {/* Case Header with ID + time */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <RiskBadge level={c.riskLevel} size="sm" />
                      <PlatformBadge platform={c.platform} size="sm" />
                      <span className="text-slate-400 text-sm font-medium">@{c.suspectedAccountName}</span>
                    </div>

                    {/* Case ID + Discovery time */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                        <Hash className="w-3 h-3 text-slate-500" />
                        <span className="text-xs font-black text-slate-300 font-mono">{formatCaseId(c.id)}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>發現於 {formatDateTime(c.discoveredAt)}</span>
                      </div>
                    </div>

                    {/* Text Analysis */}
                    <div className="space-y-2 mb-4">
                      <div className="flex gap-2">
                        <span className="text-xs font-black text-rose-400 flex-shrink-0 mt-0.5">送件原因</span>
                        <p className="text-sm text-slate-300 leading-relaxed">{sendReason}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs font-black text-slate-500 flex-shrink-0 mt-0.5">特徵摘要</span>
                        <p className="text-sm text-slate-400 leading-relaxed">{riskSummary}</p>
                      </div>
                    </div>

                    {/* Link to Case Tracker */}
                    <Link href={`/cases/${c.id}`}>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-rose-200 transition-colors">
                        <FileText className="w-3.5 h-3.5" />
                        在 Case Tracker 查看進度
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-8 p-8 rounded-2xl bg-slate-800/30 border border-slate-700/40 text-center">
            <p className="text-slate-500 text-sm">此區間內無排程案件</p>
          </div>
        )}

        {/* CTA → Case Tracker */}
        <Link href="/cases">
          <div className="group p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] cursor-pointer flex items-center justify-between">
            <div>
              <p className="font-bold text-white group-hover:text-blue-300 transition-colors">前往 Case Tracker</p>
              <p className="text-slate-400 text-sm mt-0.5">追蹤排程 · 送件 · 下架進度</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-8">
          資料截至 {weeklyReport.weekRange.end}・由 Watchmen Lite 自動生成
        </p>
      </div>
    </div>
  );
}
