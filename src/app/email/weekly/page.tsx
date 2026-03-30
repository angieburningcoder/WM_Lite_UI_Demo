'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, Mail, FileText } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/Badge';
import { weeklyReport, cases } from '@/data/mockData';
import { getWeekRangeString, copyToClipboard } from '@/lib/utils';
import { useSettings } from '@/lib/useSettings';

export default function EmailWeeklyPage() {
  const { settings, isLoaded } = useSettings();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const weekRange = getWeekRangeString(weeklyReport.weekRange.start, weeklyReport.weekRange.end);
  const topCases = weeklyReport.topCases.map((id) => cases.find((c) => c.id === id)).filter(Boolean);
  const displayName = isLoaded ? settings.displayName : '使用者';

  const handleCopy = async (text: string, item: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(null), 2000);
    }
  };

  const emailSubject = `[Watchmen Lite] ${weekRange} 週報：本週偵測到 ${weeklyReport.totals.total} 個疑似帳號`;

  const emailPlainText = `
Watchmen Lite 週報
${weekRange}

${displayName}，你好！

本週我們替你盯守，讓你不用一個人面對。

📊 本週摘要
- 偵測帳號數：${weeklyReport.totals.total}
- 高風險：${weeklyReport.totals.high}
- 中風險：${weeklyReport.totals.medium}
- 低風險：${weeklyReport.totals.low}

${weeklyReport.totals.high > 0 ? `
⚠️ 需優先處理
${topCases
  .filter((c) => c?.riskLevel === 'H')
  .map((c) => `- @${c?.suspectedAccountName} (${c?.platform}) - 相似度 ${c?.similarityScore}%`)
  .join('\n')}
` : '✅ 本週沒有高風險案件，但我們仍持續為你監控。'}

👉 查看完整報告：https://watchmen.lite/report/weekly

---
Watchmen Lite by Gogolook
此為系統自動發送，資料僅供參考。
`.trim();

  const emailHTML = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563EB,#1D4ED8);padding:32px;text-align:center;">
              <img src="https://via.placeholder.com/40x40/FFFFFF/2563EB?text=W" alt="Watchmen" style="width:40px;height:40px;border-radius:8px;margin-bottom:16px;">
              <h1 style="margin:0;color:#FFFFFF;font-size:24px;font-weight:bold;">Watchmen Lite 週報</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${weekRange}</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 32px 16px;">
              <p style="margin:0;color:#374151;font-size:16px;line-height:1.6;">
                ${displayName}，你好！<br><br>
                <strong style="color:#1F2937;">本週我們替你盯守，讓你不用一個人面對。</strong>
              </p>
            </td>
          </tr>

          <!-- Summary Stats -->
          <tr>
            <td style="padding:16px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:24px;text-align:center;border-right:1px solid #E5E7EB;">
                    <p style="margin:0;font-size:32px;font-weight:bold;color:#1F2937;">${weeklyReport.totals.total}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">偵測帳號</p>
                  </td>
                  <td style="padding:24px;text-align:center;border-right:1px solid #E5E7EB;">
                    <p style="margin:0;font-size:32px;font-weight:bold;color:#DC2626;">${weeklyReport.totals.high}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">高風險</p>
                  </td>
                  <td style="padding:24px;text-align:center;border-right:1px solid #E5E7EB;">
                    <p style="margin:0;font-size:32px;font-weight:bold;color:#D97706;">${weeklyReport.totals.medium}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">中風險</p>
                  </td>
                  <td style="padding:24px;text-align:center;">
                    <p style="margin:0;font-size:32px;font-weight:bold;color:#059669;">${weeklyReport.totals.low}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">低風險</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Top Cases -->
          ${weeklyReport.totals.high > 0 ? `
          <tr>
            <td style="padding:16px 32px;">
              <h2 style="margin:0 0 16px;font-size:18px;color:#1F2937;">需優先處理</h2>
              ${topCases
                .filter((c) => c?.riskLevel === 'H')
                .map((c) => `
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FEF2F2;border:1px solid #FECACA;border-radius:8px;margin-bottom:12px;">
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#991B1B;">@${c?.suspectedAccountName}</p>
                    <p style="margin:0;font-size:12px;color:#B91C1C;">${c?.platform} · 相似度 ${c?.similarityScore}%</p>
                  </td>
                </tr>
              </table>
                `)
                .join('')}
            </td>
          </tr>
          ` : `
          <tr>
            <td style="padding:16px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;">
                <tr>
                  <td style="padding:16px;text-align:center;">
                    <p style="margin:0;font-size:14px;color:#166534;">✅ 本週沒有高風險案件，我們仍持續為你監控。</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `}

          <!-- CTA -->
          <tr>
            <td style="padding:24px 32px;text-align:center;">
              <a href="https://watchmen.lite/report/weekly" style="display:inline-block;padding:14px 32px;background-color:#2563EB;color:#FFFFFF;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
                查看完整報告
              </a>
            </td>
          </tr>

          <!-- De-fear Footer -->
          <tr>
            <td style="padding:24px 32px;background-color:#EFF6FF;text-align:center;">
              <p style="margin:0;font-size:14px;color:#1E40AF;">
                「你負責安心，我們負責盯守。」
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;text-align:center;border-top:1px solid #E5E7EB;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;">
                Watchmen Lite by Gogolook<br>
                此為系統自動發送的週報，資料僅供參考。
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back Navigation */}
        <Link
          href="/report/weekly"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回週報
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
              📧 以下為系統每週寄出的 Email 預覽
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">週報 Email 預覽</h1>
            <p className="text-gray-500 mt-1">這封信是用戶每週收到的監控摘要</p>
          </div>
        </div>

        {/* Copy Actions */}
        <Card className="mb-6">
          <CardHeader title="複製 Email 內容" subtitle="選擇需要的格式" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleCopy(emailSubject, 'subject')}
            >
              {copiedItem === 'subject' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copiedItem === 'subject' ? '已複製！' : 'Copy Subject'}
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleCopy(emailHTML, 'html')}
            >
              {copiedItem === 'html' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copiedItem === 'html' ? '已複製！' : 'Copy HTML'}
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => handleCopy(emailPlainText, 'plain')}
            >
              {copiedItem === 'plain' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copiedItem === 'plain' ? '已複製！' : 'Copy Plain Text'}
            </Button>
          </div>
        </Card>

        {/* Subject Preview */}
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">主旨</span>
          </div>
          <p className="font-medium text-gray-900">{emailSubject}</p>
        </Card>

        {/* Email Preview */}
        <Card padding="none" className="overflow-hidden">
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Email 預覽</span>
            </div>
          </div>
          <div
            className="bg-gray-100 p-4 sm:p-8"
            dangerouslySetInnerHTML={{ __html: emailHTML }}
          />
        </Card>

        {/* Plain Text Preview */}
        <Card className="mt-6">
          <CardHeader title="純文字版本" subtitle="給不支援 HTML 的 Email 客戶端" />
          <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
            {emailPlainText}
          </pre>
        </Card>
      </div>
    </div>
  );
}
