'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Folder,
  Image,
  FileText,
  CheckCircle,
  XCircle,
  Copy,
  Download,
  Printer,
  Clock
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { RiskBadge, PlatformBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { getCaseById } from '@/data/mockData';
import { formatDateTime } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EvidencePage({ params }: PageProps) {
  const { id } = use(params);
  const caseData = getCaseById(id);

  if (!caseData) {
    notFound();
  }

  const handlePrint = () => {
    window.print();
  };

  const generateHTMLDownload = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>Evidence Lite - ${caseData.suspectedAccountName}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    h1 { color: #1F2937; }
    .meta { color: #6B7280; margin-bottom: 24px; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
    .checklist-item { display: flex; gap: 8px; margin-bottom: 8px; }
    .checked { color: #059669; }
    .unchecked { color: #9CA3AF; }
    .report-text { background: #F9FAFB; padding: 16px; border-radius: 8px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Evidence Lite 證據包</h1>
  <div class="meta">
    <p>目標帳號：@${caseData.suspectedAccountName}</p>
    <p>平台：${caseData.platform}</p>
    <p>產生時間：${new Date().toLocaleString('zh-TW')}</p>
  </div>

  <div class="section">
    <div class="section-title">檢核清單</div>
    ${caseData.evidence.checklist
      .map(
        (item) => `
    <div class="checklist-item">
      <span class="${item.detected ? 'checked' : 'unchecked'}">${item.detected ? '✓' : '○'}</span>
      <span>${item.item}：${item.detail}</span>
    </div>`
      )
      .join('')}
  </div>

  <div class="section">
    <div class="section-title">檢舉材料文字</div>
    <div class="report-text">${caseData.evidence.reportTextBlock}</div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evidence-${caseData.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-6 sm:py-8 print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Navigation */}
        <Link
          href={`/cases/${caseData.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 no-print"
        >
          <ArrowLeft className="w-4 h-4" />
          返回案件詳情
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Folder className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Evidence Lite</h1>
              <p className="text-gray-500">證據包 #{caseData.id.split('-')[1]}</p>
            </div>
          </div>
          <div className="flex gap-2 no-print">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              列印 PDF
            </Button>
            <Button variant="outline" size="sm" onClick={generateHTMLDownload}>
              <Download className="w-4 h-4" />
              下載 HTML
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="mb-6 print-avoid-break">
          <CardHeader title="基本摘要" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">目標身份</p>
              <p className="font-medium text-gray-900">陳品安</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">疑似帳號</p>
              <p className="font-medium text-gray-900">@{caseData.suspectedAccountName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">平台</p>
              <PlatformBadge platform={caseData.platform} size="sm" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">風險等級</p>
              <RiskBadge level={caseData.riskLevel} size="sm" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>發現時間：{formatDateTime(caseData.discoveredAt)}</span>
          </div>
        </Card>

        {/* Evidence Items */}
        <Card className="mb-6 print-avoid-break">
          <CardHeader
            title="證據項目"
            subtitle="截圖與相關資料"
          />
          {caseData.evidence.snapshots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caseData.evidence.snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm mb-1">
                      {snapshot.type === 'profile' && '個人檔案截圖'}
                      {snapshot.type === 'bio' && '個人簡介截圖'}
                      {snapshot.type === 'post' && '貼文截圖'}
                      {snapshot.type === 'story' && '限時動態截圖'}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">{snapshot.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDateTime(snapshot.capturedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>此案件尚無截圖證據</p>
            </div>
          )}
        </Card>

        {/* Checklist */}
        <Card className="mb-6 print-avoid-break">
          <CardHeader
            title="冒充指標檢核"
            subtitle="系統自動分析結果"
          />
          <div className="space-y-3">
            {caseData.evidence.checklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  item.detected ? 'bg-red-50' : 'bg-gray-50'
                }`}
              >
                {item.detected ? (
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium text-sm ${item.detected ? 'text-red-700' : 'text-gray-500'}`}>
                    {item.item}
                  </p>
                  <p className={`text-sm ${item.detected ? 'text-red-600' : 'text-gray-400'}`}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Report Text Block */}
        <Card className="mb-6 print-avoid-break">
          <CardHeader
            title="一鍵複製檢舉材料"
            subtitle="整合成可直接貼給平台的文字"
            action={
              <CopyButton
                text={caseData.evidence.reportTextBlock}
                label="複製檢舉文字"
                variant="primary"
                size="sm"
              />
            }
          />
          <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-700 whitespace-pre-wrap">
            {caseData.evidence.reportTextBlock}
          </div>
        </Card>

        {/* De-fear Footer */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 no-print">
          <div className="text-center">
            <p className="text-blue-800 font-medium mb-2">
              證據已整理完成，你不用自己一個個截圖整理
            </p>
            <p className="text-sm text-blue-600">
              如需我們協助提交檢舉，請前往案件詳情頁選擇「交給我們處理」。
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <Link href={`/cases/${caseData.id}`}>
                <Button size="sm">返回案件詳情</Button>
              </Link>
              <Link href="/report/weekly">
                <Button variant="outline" size="sm">返回週報</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
