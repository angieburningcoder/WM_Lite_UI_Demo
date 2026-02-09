'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Mail,
  Shield,
  Clock,
  Download,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import { Card, CardHeader, StatCard } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { TrendChart } from '@/components/charts/TrendChart';
import { CaseList } from '@/components/cases/CaseCard';
import { weeklyReport, cases, getCasesByRiskLevel } from '@/data/mockData';
import { getWeekRangeString, formatNumber } from '@/lib/utils';
import { useSettings } from '@/lib/useSettings';
import { RiskLevel } from '@/data/types';

export default function WeeklyReportPage() {
  const [filter, setFilter] = useState<'all' | RiskLevel>('all');
  const { settings, isLoaded } = useSettings();

  const filteredCases = getCasesByRiskLevel(filter);
  const weekRange = getWeekRangeString(weeklyReport.weekRange.start, weeklyReport.weekRange.end);

  const filterOptions = [
    { value: 'all', label: '全部', count: weeklyReport.totals.total },
    { value: 'H', label: '高風險', count: weeklyReport.totals.high },
    { value: 'M', label: '中風險', count: weeklyReport.totals.medium },
    { value: 'L', label: '低風險', count: weeklyReport.totals.low },
  ];

  const handlePrint = () => {
    window.print();
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="py-6 sm:py-8 print:py-0 relative overflow-hidden">
      {/* Background Blobs for Liveliness */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-bounce-slow" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              本週監控週報 🚀
            </h1>
            <p className="text-slate-300 mt-2 text-lg font-medium">
              {weekRange} {isLoaded && `・${settings.displayName}`}
            </p>
          </div>
          <div className="flex gap-2 no-print">
            <Link href="/email/weekly">
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform bg-slate-800/50 backdrop-blur border-slate-600">
                <Mail className="w-4 h-4 text-cyan-400" />
                Email 預覽
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handlePrint} className="hover:scale-105 transition-transform bg-slate-800/50 backdrop-blur border-slate-600">
              <Download className="w-4 h-4 text-purple-400" />
              下載 PDF
            </Button>
          </div>
        </div>

        {/* De-fear Opening Message */}
        <Card className="mb-6 bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:scale-[1.01] transition-all duration-300">
          <p className="text-blue-100 leading-relaxed text-lg">
            <span className="font-bold text-white text-xl block mb-2">👋 Hi, 本週我們替你盯守！</span>
            <span className="text-blue-200">
              {weeklyReport.totals.high > 0
                ? `小心！偵測到 ${weeklyReport.totals.high} 件高風險事件需要優先處理。`
                : '太棒了！本週沒有高風險偽冒，但我們仍持續觀察風險環境變化。'}
            </span>
          </p>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard
            label="本週偵測"
            value={weeklyReport.totals.total}
            subtext="疑似偽冒帳號"
            icon={<Activity className="w-6 h-6 text-cyan-400" />}
            className="bg-slate-800/40 backdrop-blur hover:bg-slate-800/60 border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10"
          />
          <StatCard
            label="高風險"
            value={weeklyReport.totals.high}
            subtext="需優先處理"
            icon={<ArrowUp className="w-6 h-6 text-rose-500" />}
            className="bg-slate-800/40 backdrop-blur hover:bg-slate-800/60 border-slate-700/50 hover:border-rose-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-500/10"
          />
          <StatCard
            label="中風險"
            value={weeklyReport.totals.medium}
            subtext="建議觀察"
            icon={<Minus className="w-6 h-6 text-amber-500" />}
            className="bg-slate-800/40 backdrop-blur hover:bg-slate-800/60 border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10"
          />
          <StatCard
            label="低風險"
            value={weeklyReport.totals.low}
            subtext="持續監控"
            icon={<ArrowDown className="w-6 h-6 text-emerald-500" />}
            className="bg-slate-800/40 backdrop-blur hover:bg-slate-800/60 border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10"
          />
        </div>

        {/* Priority Action Card */}
        {weeklyReport.totals.high > 0 && (
          <Card className="mb-6 border-rose-500 bg-rose-950/30 print-avoid-break shadow-[0_0_20px_rgba(244,63,94,0.2)] animate-pulse-slow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-500/30">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-white mb-2">優先處理建議 🚨</h3>
                <p className="text-base text-rose-100 mb-4">
                  案件 #{cases[0].id.split('-')[1]} ({cases[0].suspectedAccountName}) 相似度達 {cases[0].similarityScore}%，
                  且已有可疑行為跡象。建議優先查看證據包並採取行動。
                </p>
                <div className="flex gap-3">
                  <Link href={`/cases/${cases[0].id}`}>
                    <Button size="sm" variant="danger" className="shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40">查看詳情</Button>
                  </Link>
                  <Link href={`/evidence/${cases[0].id}`}>
                    <Button variant="outline" size="sm" className="border-rose-400 text-rose-300 hover:bg-rose-900/40 hover:text-white">查看證據包</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Trend Chart */}
        <Card className="mb-6 print-avoid-break bg-slate-900/40 backdrop-blur border-slate-700/50 hover:border-purple-500/30 transition-all duration-500">
          <CardHeader title="偵測趨勢 📈" subtitle="近 7 天事件數量" />
          <TrendChart data={weeklyReport.trend} />
        </Card>

        {/* Environment Signals */}
        <Card className="mb-6 print-avoid-break bg-slate-900/40 backdrop-blur border-slate-700/50">
          <CardHeader
            title="風險環境訂閱 🌍"
            subtitle="幫你掌握環境變化，不錯過重要趨勢"
          />
          <div className="space-y-3">
            {weeklyReport.environmentSignals.map((signal) => (
              <div
                key={signal.id}
                className="flex items-start gap-3 p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-700/80 transition-all duration-300 border border-slate-700/50 hover:border-cyan-500/30 hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getTrendIcon(signal.trend)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-100 text-base">{signal.title}</h4>
                    {signal.value && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                        {signal.value}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300">{signal.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 px-2">
            * 環境資訊僅供參考，不代表實際偵測結果或承諾。趨勢數據來自公開資訊彙整。
          </p>
        </Card>

        {/* Cases List */}
        <Card className="mb-6 bg-slate-900/40 backdrop-blur border-slate-700/50" padding="none">
          <div className="p-4 sm:p-6 border-b border-slate-700/50">
            <CardHeader
              title="疑似偽冒清單 📋"
              subtitle={`共 ${filteredCases.length} 筆符合條件`}
              className="mb-0"
            />
            <div className="mt-4 no-print">
              <FilterTabs
                options={filterOptions}
                value={filter}
                onChange={(v) => setFilter(v as 'all' | RiskLevel)}
              />
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <CaseList
              cases={filteredCases}
              emptyMessage="🎉 太好了！目前沒有符合此風險等級的案件。"
            />
          </div>
        </Card>

        {/* De-fear Module */}
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white print-avoid-break border-none shadow-[0_0_40px_rgba(79,70,229,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] transform translate-x-1/3 -translate-y-1/3" />
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md shadow-inner border border-white/30 rotate-3">
              <Shield className="w-10 h-10 drop-shadow-md" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-black mb-2">有人在。</h3>
              <p className="text-blue-100 mb-1 text-lg">
                本週由 Watchmen Lite 協助你盯守：
                <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg ml-1"> {weeklyReport.watchHours} 小時</span>
              </p>
              <p className="text-blue-200 text-sm">
                如果你願意，我們可以替你跑檢舉流程。
              </p>
            </div>
            <div className="flex-shrink-0 no-print">
              <Link href="/settings">
                <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur shadow-lg">
                  <Clock className="w-4 h-4" />
                  設定代管偏好
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
