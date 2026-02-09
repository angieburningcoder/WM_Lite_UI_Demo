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
    <div className="py-6 sm:py-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Back Navigation */}
        <Link
          href="/report/weekly"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
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
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
              @{caseData.suspectedAccountName}
            </h1>
            <p className="text-slate-400 text-lg">{caseData.suspectedDisplayName}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/evidence/${caseData.id}`}>
              <Button className="shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                <FileText className="w-4 h-4" />
                查看證據包
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.open(caseData.suspectedUrl, '_blank')}
              className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400"
            >
              <ExternalLink className="w-4 h-4" />
              查看帳號
            </Button>
          </div>
        </div>

        {/* De-fear message for high risk */}
        {caseData.riskLevel === 'H' && (
          <Card className="mb-6 bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] animate-pulse-slow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-blue-500/30">
                <Shield className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <p className="font-bold text-xl text-white mb-2">這件事你不用慌 🛡️</p>
                <p className="text-base text-blue-100 leading-relaxed">
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
            <Card className="bg-slate-900/40 backdrop-blur border-slate-700/50">
              <CardHeader title="處理進度 ⏱️" />
              <Timeline items={caseData.statusTimeline} />
            </Card>

            {/* Risk Analysis */}
            <Card className="bg-slate-900/40 backdrop-blur border-slate-700/50">
              <CardHeader
                title="風險分析 🔍"
                subtitle={`為何判定為${riskInfo.label}`}
              />
              <ul className="space-y-3">
                {caseData.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                    <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 animate-pulse ${riskInfo.dotColor}`} />
                    <p className="text-slate-200">{reason}</p>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Recommended Actions */}
            <Card className="bg-slate-900/40 backdrop-blur border-slate-700/50">
              <CardHeader title="建議行動 ⚡" subtitle="選擇最適合你的處理方式" />
              <div className="space-y-4">
                {caseData.recommendedActions.map((action, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 ${action.type === 'delegate'
                        ? 'border-blue-500/50 bg-blue-900/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:border-blue-400 hover:bg-blue-900/30'
                        : 'border-slate-700 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {action.type === 'delegate' ? (
                        <>
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Users className="w-5 h-5 text-blue-400" />
                          </div>
                          <h4 className="font-bold text-lg text-white">交給我們處理</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold animate-bounce-slow">
                            推薦
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="p-2 bg-slate-700/50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-slate-400" />
                          </div>
                          <h4 className="font-bold text-lg text-white">自行處理</h4>
                        </>
                      )}
                    </div>

                    <ol className="space-y-3 mb-4">
                      {action.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3 text-sm text-slate-300">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center mt-0.5 border border-slate-600">
                            {stepIndex + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>

                    {action.sla && (
                      <div className="flex items-center gap-2 text-sm text-blue-300 mb-3 font-medium bg-blue-900/30 w-fit px-3 py-1 rounded-full border border-blue-500/30">
                        <Clock className="w-4 h-4" />
                        {action.sla}
                      </div>
                    )}

                    {action.requiredInfo && action.requiredInfo.length > 0 && (
                      <div className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="font-bold text-slate-300 block mb-1">需要你提供：</span>
                        {action.requiredInfo.join('、')}
                      </div>
                    )}

                    {action.type === 'delegate' && (
                      <Button className="mt-5 w-full sm:w-auto shadow-lg shadow-blue-500/20" size="sm">
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
            <Card className="bg-slate-900/40 backdrop-blur border-slate-700/50">
              <CardHeader title="帳號資訊 📊" />
              <dl className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                  <dt className="text-sm text-slate-400 mb-1">相似度分數</dt>
                  <dd className="text-3xl font-black text-white">{caseData.similarityScore}%</dd>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                  <dt className="text-sm text-slate-400 mb-1">追蹤者數量</dt>
                  <dd className="text-xl font-bold text-white">
                    {formatNumber(caseData.followers)}
                  </dd>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                  <dt className="text-sm text-slate-400 mb-1">發現時間</dt>
                  <dd className="text-sm text-slate-200 font-medium">
                    {formatDateTime(caseData.discoveredAt)}
                  </dd>
                </div>
              </dl>
            </Card>

            {/* Deterrence Badge */}
            <Card className="bg-slate-900/40 backdrop-blur border-slate-700/50">
              <CardHeader
                title="Deterrence 威嚇標記 🛑"
                subtitle="讓冒用者知難而退"
              />
              <div className="space-y-4">
                {/* Preview */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-500 mb-2">預覽效果：</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/20 border border-blue-500/30 rounded-lg backdrop-blur-sm">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-blue-300">
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
                    className="w-full border-slate-600 text-slate-300 hover:text-white hover:border-slate-400"
                  />
                  <CopyButton
                    text={deterrenceText}
                    label="複製聲明文案"
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-600 text-slate-300 hover:text-white hover:border-slate-400"
                  />
                </div>

                <p className="text-xs text-slate-500">
                  可將此標記放置於您的官方頁面或個人簡介，提醒他人此身份受保護。
                </p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-amber-950/20 border-amber-500/30">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-500/10 rounded-lg flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-500 mb-1 text-lg">需要緊急處理？</h4>
                  <p className="text-sm text-amber-200/80 mb-4 leading-relaxed">
                    如果發現此帳號正在進行詐騙活動，建議立即採取行動。
                  </p>
                  <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-900/30 hover:text-amber-200 w-full">
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
