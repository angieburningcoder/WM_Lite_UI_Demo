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
  FileText
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
    <div className="py-6 sm:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back Navigation */}
        <Link
          href="/alerts"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回通知列表
        </Link>

        {/* Email-like Layout */}
        <Card padding="none">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">{getAlertTypeLabel(alert.type)}</span>
                  {alert.riskLevel && <RiskBadge level={alert.riskLevel} size="sm" />}
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">{alert.title}</h1>
                <p className="text-sm text-gray-500">
                  {formatDateTime(alert.createdAt)} · {formatRelativeTime(alert.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">{alert.summary}</p>

              {/* Context-specific content */}
              {alert.type === 'new_case' && relatedCase && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">案件摘要</h3>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-500">疑似帳號</dt>
                      <dd className="font-medium text-gray-900">@{relatedCase.suspectedAccountName}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">平台</dt>
                      <dd className="font-medium text-gray-900">{relatedCase.platform}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">相似度</dt>
                      <dd className="font-medium text-gray-900">{relatedCase.similarityScore}%</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">追蹤者</dt>
                      <dd className="font-medium text-gray-900">{relatedCase.followers.toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {alert.type === 'environment_change' && (
                <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-100">
                  <p className="text-amber-800 text-sm">
                    此為環境觀察資訊，僅供參考。我們持續為你監控風險變化，讓你掌握最新動態。
                  </p>
                </div>
              )}

              {alert.type === 'weekly_summary' && (
                <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
                  <p className="text-purple-800 text-sm">
                    這是你的每週監控摘要。我們每週都會為你整理重點，讓你快速了解本週狀況。
                  </p>
                </div>
              )}

              {/* De-fear message */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-blue-800 font-medium mb-1">有人在</p>
                <p className="text-blue-600 text-sm">
                  {alert.riskLevel === 'H'
                    ? '這件事你不用慌，我們已經準備好協助你處理。'
                    : '我們持續為你盯守，有任何狀況會第一時間通知你。'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-wrap gap-3">
              {relatedCase && (
                <>
                  <Link href={`/cases/${relatedCase.id}`}>
                    <Button>
                      <ExternalLink className="w-4 h-4" />
                      查看案件詳情
                    </Button>
                  </Link>
                  <Link href={`/evidence/${relatedCase.id}`}>
                    <Button variant="outline">
                      <FileText className="w-4 h-4" />
                      查看證據包
                    </Button>
                  </Link>
                </>
              )}
              {alert.type === 'weekly_summary' && (
                <Link href="/report/weekly">
                  <Button>
                    <Calendar className="w-4 h-4" />
                    查看完整週報
                  </Button>
                </Link>
              )}
              {!relatedCase && alert.type !== 'weekly_summary' && (
                <Link href="/report/weekly">
                  <Button variant="outline">返回週報</Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
