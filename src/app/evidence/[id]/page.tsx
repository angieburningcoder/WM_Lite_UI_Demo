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
  Download,
  Printer,
  Clock
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { RiskBadge, PlatformBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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
    <div className="py-6 sm:py-8 print:py-0 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Back Navigation */}
        <Link
          href={`/cases/${caseData.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 no-print transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回案件詳情
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/30 backdrop-blur-sm shadow-lg shadow-blue-500/10">
              <Folder className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Evidence Lite</h1>
              <p className="text-slate-400 text-lg">證據包 #{caseData.id.split('-')[1]}</p>
            </div>
          </div>
          <div className="flex gap-2 no-print">
            <Button variant="outline" size="sm" onClick={handlePrint} className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400">
              <Printer className="w-4 h-4" />
              列印 PDF
            </Button>
            <Button variant="outline" size="sm" onClick={generateHTMLDownload} className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-400">
              <Download className="w-4 h-4" />
              下載 HTML
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="mb-6 print-avoid-break bg-slate-900/40 backdrop-blur border-slate-700/50">
          <CardHeader title="基本摘要 📋" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
              <p className="text-sm text-slate-400 mb-1">目標身份</p>
              <p className="font-bold text-white text-lg">陳品安</p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
              <p className="text-sm text-slate-400 mb-1">疑似帳號</p>
              <p className="font-bold text-white text-lg truncate">@{caseData.suspectedAccountName}</p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
              <p className="text-sm text-slate-400 mb-2">平台</p>
              <PlatformBadge platform={caseData.platform} size="sm" />
            </div>
            <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
              <p className="text-sm text-slate-400 mb-2">風險等級</p>
              <RiskBadge level={caseData.riskLevel} size="sm" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/50 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>發現時間：{formatDateTime(caseData.discoveredAt)}</span>
          </div>
        </Card>

        {/* Evidence Items */}
        <Card className="mb-6 print-avoid-break bg-slate-900/40 backdrop-blur border-slate-700/50">
          <CardHeader
            title="證據項目 📸"
            subtitle="截圖與相關資料"
          />
          {caseData.evidence.snapshots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caseData.evidence.snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/80 transition-colors border border-slate-700/50"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <Image className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-200 text-sm mb-1">
                      {snapshot.type === 'profile' && '個人檔案截圖'}
                      {snapshot.type === 'bio' && '個人簡介截圖'}
                      {snapshot.type === 'post' && '貼文截圖'}
                      {snapshot.type === 'story' && '限時動態截圖'}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-2">{snapshot.description}</p>
                    <p className="text-xs text-slate-500 mt-2 font-mono">
                      {formatDateTime(snapshot.capturedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Image className="w-12 h-12 mx-auto mb-3 text-slate-700" />
              <p>此案件尚無截圖證據</p>
            </div>
          )}
        </Card>

        {/* Checklist */}
        <Card className="mb-6 print-avoid-break bg-slate-900/40 backdrop-blur border-slate-700/50">
          <CardHeader
            title="冒充指標檢核 ✅"
            subtitle="系統自動分析結果"
          />
          <div className="space-y-3">
            {caseData.evidence.checklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${item.detected
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-800/30 border-slate-700/30'
                  }`}
              >
                {item.detected ? (
                  <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-bold text-sm mb-0.5 ${item.detected ? 'text-rose-400' : 'text-slate-400'}`}>
                    {item.item}
                  </p>
                  <p className={`text-sm ${item.detected ? 'text-rose-300/80' : 'text-slate-500'}`}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* De-fear Footer */}
        <Card className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 border-blue-500/30 no-print shadow-lg shadow-blue-500/10">
          <div className="text-center py-4">
            <p className="text-blue-200 font-bold text-lg mb-2">
              證據已整理完成，你不用自己一個個截圖整理 😤
            </p>
            <p className="text-sm text-blue-300 mb-6">
              如需我們協助提交檢舉，請前往案件詳情頁選擇「交給我們處理」。
            </p>
            <div className="flex justify-center gap-3">
              <Link href={`/cases/${caseData.id}`}>
                <Button size="sm" className="shadow-lg shadow-blue-500/20">返回案件詳情</Button>
              </Link>
              <Link href="/report/weekly">
                <Button variant="outline" size="sm" className="border-slate-500 text-slate-300 hover:text-white hover:bg-slate-800">返回週報</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
