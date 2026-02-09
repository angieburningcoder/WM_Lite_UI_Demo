'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  Info,
  Calendar,
  RefreshCw,
  ExternalLink,
  FileText,
  Shield // Added missing import
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getAlertById, getCaseById } from '@/data/mockData';
import { formatDateTime, formatRelativeTime } from '@/lib/utils';
import { Alert } from '@/data/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

function getAlertIcon(type: Alert['type']) {
  switch (type) {
    case 'new_case':
      return <AlertTriangle className="w-6 h-6 text-red-500" />;
    case 'status_update':
      return <RefreshCw className="w-6 h-6 text-blue-500" />;
    case 'environment_change':
      return <Info className="w-6 h-6 text-amber-500" />;
    case 'weekly_summary':
      return <Calendar className="w-6 h-6 text-purple-500" />;
    default:
      return <Bell className="w-6 h-6 text-gray-500" />;
  }
}

function getAlertTypeLabel(type: Alert['type']) {
  switch (type) {
    case 'new_case':
      return '新案件通知';
    case 'status_update':
      return '狀態更新通知';
    case 'environment_change':
      return '環境變化通知';
    case 'weekly_summary':
      return '週報摘要';
    default:
      return '系統通知';
  }
}

export default function AlertDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const alert = getAlertById(id);

  if (!alert) {
    notFound();
  }

  const relatedCase = alert.caseId ? getCaseById(alert.caseId) : null;

  return (
    <div className="py-6 sm:py-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Back Navigation */}
        <Link
          href="/alerts"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回通知列表
        </Link>

        {/* Email-like Layout */}
        <Card padding="none" className="bg-slate-900/40 backdrop-blur border-slate-700/50 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm text-slate-400 font-medium">{getAlertTypeLabel(alert.type)}</span>
                  {alert.riskLevel && <RiskBadge level={alert.riskLevel} size="sm" />}
                </div>
                <h1 className="text-xl font-bold text-white mb-1">{alert.title}</h1>
                <p className="text-sm text-slate-500">
                  {formatDateTime(alert.createdAt)} · {formatRelativeTime(alert.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed mb-6 text-lg">{alert.summary}</p>

              {/* Context-specific content */}
              {alert.type === 'new_case' && relatedCase && (
                <div className="bg-slate-800/50 rounded-xl p-5 mb-6 border border-slate-700/50">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    案件摘要
                  </h3>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                      <dt className="text-slate-500 mb-1">疑似帳號</dt>
                      <dd className="font-bold text-white truncate">@{relatedCase.suspectedAccountName}</dd>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                      <dt className="text-slate-500 mb-1">平台</dt>
                      <dd className="font-medium text-white">{relatedCase.platform}</dd>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                      <dt className="text-slate-500 mb-1">相似度</dt>
                      <dd className="font-bold text-white">{relatedCase.similarityScore}%</dd>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                      <dt className="text-slate-500 mb-1">追蹤者</dt>
                      <dd className="font-medium text-white">{relatedCase.followers.toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {alert.type === 'environment_change' && (
                <div className="bg-amber-950/30 rounded-xl p-4 mb-6 border border-amber-500/30">
                  <p className="text-amber-200 text-sm">
                    此為環境觀察資訊，僅供參考。我們持續為你監控風險變化，讓你掌握最新動態。
                  </p>
                </div>
              )}

              {alert.type === 'weekly_summary' && (
                <div className="bg-purple-950/30 rounded-xl p-4 mb-6 border border-purple-500/30">
                  <p className="text-purple-200 text-sm">
                    這是你的每週監控摘要。我們每週都會為你整理重點，讓你快速了解本週狀況。
                  </p>
                </div>
              )}

              {/* De-fear message */}
              <div className="bg-blue-950/30 rounded-xl p-4 border border-blue-500/30">
                <p className="text-blue-300 font-bold mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  有人在
                </p>
                <p className="text-blue-200/80 text-sm">
                  {alert.riskLevel === 'H'
                    ? '這件事你不用慌，我們已經準備好協助你處理。'
                    : '我們持續為你盯守，有任何狀況會第一時間通知你。'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="p-6 bg-slate-950/30 border-t border-slate-700/50">
            <div className="flex flex-wrap gap-3">
              {relatedCase && (
                <>
                  <Link href={`/cases/${relatedCase.id}`}>
                    <Button className="shadow-lg shadow-blue-500/20">
                      <ExternalLink className="w-4 h-4" />
                      查看案件詳情
                    </Button>
                  </Link>
                  <Link href={`/evidence/${relatedCase.id}`}>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400">
                      <FileText className="w-4 h-4" />
                      查看證據包
                    </Button>
                  </Link>
                </>
              )}
              {alert.type === 'weekly_summary' && (
                <Link href="/report/weekly">
                  <Button className="shadow-lg shadow-purple-500/20">
                    <Calendar className="w-4 h-4" />
                    查看完整週報
                  </Button>
                </Link>
              )}
              {!relatedCase && alert.type !== 'weekly_summary' && (
                <Link href="/report/weekly">
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400">返回週報</Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
