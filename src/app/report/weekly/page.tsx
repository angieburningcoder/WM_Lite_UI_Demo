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
    <div className="py-6 sm:py-8 print:py-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              本週監控週報
            </h1>
            <p className="text-gray-500 mt-1">
              {weekRange} {isLoaded && `・${settings.displayName}`}
            </p>
          </div>
          <div className="flex gap-2 no-print">
            <Link href="/email/weekly">
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4" />
                Email 預覽
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Download className="w-4 h-4" />
              下載 PDF
            </Button>
          </div>
        </div>

        {/* De-fear Opening Message */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <p className="text-blue-800 leading-relaxed">
            <span className="font-semibold">本週我們替你盯守，讓你不用一個人面對。</span>
            <br className="sm:hidden" />
            <span className="text-blue-600">
              {weeklyReport.totals.high > 0
                ? `偵測到 ${weeklyReport.totals.high} 件高風險事件需要優先處理。`
                : '本週沒有高風險偽冒，但我們仍持續觀察風險環境變化。'}
            </span>
          </p>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard
            label="本週偵測"
            value={weeklyReport.totals.total}
            subtext="疑似偽冒帳號"
            icon={<Activity className="w-5 h-5" />}
          />
          <StatCard
            label="高風險"
            value={weeklyReport.totals.high}
            subtext="需優先處理"
            icon={<ArrowUp className="w-5 h-5 text-red-500" />}
          />
          <StatCard
            label="中風險"
            value={weeklyReport.totals.medium}
            subtext="建議觀察"
            icon={<Minus className="w-5 h-5 text-amber-500" />}
          />
          <StatCard
            label="低風險"
            value={weeklyReport.totals.low}
            subtext="持續監控"
            icon={<ArrowDown className="w-5 h-5 text-green-500" />}
          />
        </div>

        {/* Priority Action Card */}
        {weeklyReport.totals.high > 0 && (
          <Card className="mb-6 border-red-100 bg-red-50/30 print-avoid-break">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">優先處理建議</h3>
                <p className="text-sm text-gray-600">
                  案件 #{cases[0].id.split('-')[1]} ({cases[0].suspectedAccountName}) 相似度達 {cases[0].similarityScore}%，
                  且已有可疑行為跡象。建議優先查看證據包並採取行動。
                </p>
                <div className="flex gap-2 mt-3">
                  <Link href={`/cases/${cases[0].id}`}>
                    <Button size="sm">查看詳情</Button>
                  </Link>
                  <Link href={`/evidence/${cases[0].id}`}>
                    <Button variant="outline" size="sm">查看證據包</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Trend Chart */}
        <Card className="mb-6 print-avoid-break">
          <CardHeader title="偵測趨勢" subtitle="近 7 天事件數量" />
          <TrendChart data={weeklyReport.trend} />
        </Card>

        {/* Environment Signals */}
        <Card className="mb-6 print-avoid-break">
          <CardHeader
            title="風險環境訂閱"
            subtitle="幫你掌握環境變化，不錯過重要趨勢"
          />
          <div className="space-y-3">
            {weeklyReport.environmentSignals.map((signal) => (
              <div
                key={signal.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getTrendIcon(signal.trend)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">{signal.title}</h4>
                    {signal.value && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {signal.value}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{signal.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            * 環境資訊僅供參考，不代表實際偵測結果或承諾。趨勢數據來自公開資訊彙整。
          </p>
        </Card>

        {/* Cases List */}
        <Card className="mb-6" padding="none">
          <div className="p-4 sm:p-5 border-b border-gray-100">
            <CardHeader
              title="疑似偽冒清單"
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
          <div className="p-4 sm:p-5">
            <CaseList
              cases={filteredCases}
              emptyMessage="太好了！目前沒有符合此風險等級的案件。"
            />
          </div>
        </Card>

        {/* De-fear Module */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white print-avoid-break">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold mb-2">有人在</h3>
              <p className="text-blue-100 mb-1">
                本週由 Watchmen Lite 協助你盯守：
                <span className="font-bold text-white"> {weeklyReport.watchHours} 小時</span>
              </p>
              <p className="text-blue-200 text-sm">
                如果你願意，我們可以替你跑檢舉流程。
              </p>
            </div>
            <div className="flex-shrink-0 no-print">
              <Link href="/settings">
                <Button variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
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
