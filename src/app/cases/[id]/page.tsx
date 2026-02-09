'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Users,
  Shield,
  Copy,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { RiskBadge, PlatformBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Timeline } from '@/components/ui/Timeline';
import { CopyButton } from '@/components/ui/CopyButton';
import { getCaseById } from '@/data/mockData';
import { formatDateTime, formatNumber, getRiskLevelInfo } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CaseDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const caseData = getCaseById(id);

  if (!caseData) {
    notFound();
  }

  const riskInfo = getRiskLevelInfo(caseData.riskLevel);

  // Deterrence badge code
  const deterrenceBadgeHTML = `<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;font-family:system-ui,sans-serif;">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  <span style="color:#1E40AF;font-size:12px;font-weight:500;">此身份由 Watchmen Lite 監控保護</span>
</div>`;

  const deterrenceText = `此帳號/品牌由 Watchmen Lite 監控保護。如您發現任何冒用或詐騙行為，請與官方管道確認。官方帳號：@pinan_official`;

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back Navigation */}
        <Link
          href="/report/weekly"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回週報
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <RiskBadge level={caseData.riskLevel} />
              <PlatformBadge platform={caseData.platform} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              @{caseData.suspectedAccountName}
            </h1>
            <p className="text-gray-500">{caseData.suspectedDisplayName}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/evidence/${caseData.id}`}>
              <Button>
                <FileText className="w-4 h-4" />
                查看證據包
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.open(caseData.suspectedUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              查看帳號
            </Button>
          </div>
        </div>

        {/* De-fear message for high risk */}
        {caseData.riskLevel === 'H' && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-800 mb-1">這件事你不用慌</p>
                <p className="text-sm text-blue-600">
                  我們已經把證據材料整理好了。你可以選擇自行處理，或是讓我們代為處理。
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <Card>
              <CardHeader title="處理進度" />
              <Timeline items={caseData.statusTimeline} />
            </Card>

            {/* Risk Analysis */}
            <Card>
              <CardHeader
                title="風險分析"
                subtitle={`為何判定為${riskInfo.label}`}
              />
              <ul className="space-y-3">
                {caseData.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${riskInfo.dotColor}`} />
                    <p className="text-gray-700">{reason}</p>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Recommended Actions */}
            <Card>
              <CardHeader title="建議行動" subtitle="選擇最適合你的處理方式" />
              <div className="space-y-4">
                {caseData.recommendedActions.map((action, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      action.type === 'delegate'
                        ? 'border-blue-200 bg-blue-50/50'
                        : 'border-gray-100 bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {action.type === 'delegate' ? (
                        <>
                          <Users className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-gray-900">交給我們處理</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            推薦
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 text-gray-500" />
                          <h4 className="font-semibold text-gray-900">自行處理</h4>
                        </>
                      )}
                    </div>

                    <ol className="space-y-2 mb-3">
                      {action.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center mt-0.5">
                            {stepIndex + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>

                    {action.sla && (
                      <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
                        <Clock className="w-4 h-4" />
                        {action.sla}
                      </div>
                    )}

                    {action.requiredInfo && action.requiredInfo.length > 0 && (
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">需要你提供：</span>
                        {action.requiredInfo.join('、')}
                      </div>
                    )}

                    {action.type === 'delegate' && (
                      <Button className="mt-4" size="sm">
                        選擇代管處理
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader title="帳號資訊" />
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">相似度分數</dt>
                  <dd className="text-2xl font-bold text-gray-900">{caseData.similarityScore}%</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">追蹤者數量</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatNumber(caseData.followers)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">發現時間</dt>
                  <dd className="text-sm text-gray-700">
                    {formatDateTime(caseData.discoveredAt)}
                  </dd>
                </div>
              </dl>
            </Card>

            {/* Deterrence Badge */}
            <Card>
              <CardHeader
                title="Deterrence 威嚇標記"
                subtitle="讓冒用者知難而退"
              />
              <div className="space-y-4">
                {/* Preview */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-800">
                      此身份由 Watchmen Lite 監控保護
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <CopyButton
                    text={deterrenceBadgeHTML}
                    label="複製 HTML Badge"
                    variant="outline"
                    size="sm"
                    className="w-full"
                  />
                  <CopyButton
                    text={deterrenceText}
                    label="複製聲明文案"
                    variant="outline"
                    size="sm"
                    className="w-full"
                  />
                </div>

                <p className="text-xs text-gray-400">
                  可將此標記放置於您的官方頁面或個人簡介，提醒他人此身份受保護。
                </p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-amber-50 border-amber-100">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900 mb-1">需要緊急處理？</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    如果發現此帳號正在進行詐騙活動，建議立即採取行動。
                  </p>
                  <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                    聯繫支援團隊
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
