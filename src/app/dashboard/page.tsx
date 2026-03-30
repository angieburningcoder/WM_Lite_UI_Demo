'use client';

import Link from 'next/link';
import { Shield, AlertTriangle, ChevronRight, FileText, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useSettings } from '@/lib/useSettings';
import { cases, weeklyReport } from '@/data/mockData';

// Rulebase: derive word summary from data
function buildWordSummary(
  displayName: string,
  total: number,
  scheduled: number,
  resolved: number
): { headline: string; body: string; isAlert: boolean } {
  if (scheduled > 0) {
    return {
      headline: `${displayName}，本週有 ${scheduled} 件案件已自動排程送件`,
      body: `系統本週共偵測到 ${total} 個疑似冒名帳號，其中 ${scheduled} 件符合送件標準，已自動建立案件並排程處理。${resolved > 0 ? `另有 ${resolved} 件已成功下架。` : ''}請前往案件清單確認進度。`,
      isAlert: true,
    };
  }
  return {
    headline: `${displayName}，你的帳號本週安全無虞`,
    body: `系統本週共偵測到 ${total} 個疑似帳號，經評估均不符合送件標準，目前列入持續監控。${resolved > 0 ? `累計已有 ${resolved} 件成功下架。` : ''}你不用擔心，我們會持續守護你。`,
    isAlert: false,
  };
}

export default function DashboardPage() {
  const { settings, isLoaded } = useSettings();

  if (!isLoaded) return <PageSkeleton />;

  const scheduledCases = cases.filter(c => c.currentStatus === 'scheduled');
  const { total, scheduled, resolved } = weeklyReport.totals;
  const displayName = settings.displayName || settings.chineseName || '使用者';
  const summary = buildWordSummary(displayName, total, scheduled, resolved);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-8 sm:py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">

        {/* Onboarding Banner */}
        {!settings.hasCompletedOnboarding && (
          <div className="mb-8 flex items-start gap-3 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-amber-300 font-bold text-sm">尚未完成帳戶設定</p>
              <p className="text-amber-200/70 text-xs mt-0.5">完成後系統才能開始為你建立監控規則</p>
            </div>
            <Link href="/onboarding">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex-shrink-0">
                立即設定
              </Button>
            </Link>
          </div>
        )}

        {/* Shield Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
            summary.isAlert
              ? 'bg-rose-500/20 border border-rose-500/40 shadow-rose-500/20'
              : 'bg-blue-500/20 border border-blue-500/40 shadow-blue-500/20'
          }`}>
            {summary.isAlert
              ? <AlertTriangle className="w-8 h-8 text-rose-400" />
              : <Shield className="w-8 h-8 text-blue-400" />
            }
          </div>
        </div>

        {/* Word Summary */}
        <div className="text-center mb-10">
          <h1 className={`text-2xl sm:text-3xl font-black mb-4 leading-tight ${
            summary.isAlert ? 'text-white' : 'text-white'
          }`}>
            {summary.headline}
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-xl mx-auto">
            {summary.body}
          </p>
        </div>

        {/* 2 CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reports Center CTA */}
          <Link href="/report/weekly">
            <div className="group p-6 rounded-2xl bg-slate-800/50 backdrop-blur border border-slate-700/60 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(147,51,234,0.15)] cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="font-bold text-white text-lg mb-1 group-hover:text-purple-300 transition-colors">Reports Center</p>
              <p className="text-slate-400 text-sm">查看偵測週報 · 趨勢分析 · 排程案件</p>
            </div>
          </Link>

          {/* Case Tracker CTA */}
          <Link href="/cases">
            <div className={`group p-6 rounded-2xl backdrop-blur border transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
              summary.isAlert
                ? 'bg-rose-950/30 border-rose-500/50 hover:bg-rose-950/50 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                : 'bg-slate-800/50 border-slate-700/60 hover:border-blue-500/50 hover:bg-slate-800/80 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  summary.isAlert ? 'bg-rose-500/20' : 'bg-blue-500/10'
                }`}>
                  <FolderOpen className={`w-5 h-5 ${summary.isAlert ? 'text-rose-400' : 'text-blue-400'}`} />
                </div>
                {summary.isAlert && scheduledCases.length > 0 && (
                  <span className="text-xs font-black text-white bg-rose-500 px-2 py-0.5 rounded-full">
                    {scheduledCases.length} 件待確認
                  </span>
                )}
                {!summary.isAlert && (
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
              <p className={`font-bold text-lg mb-1 transition-colors ${
                summary.isAlert ? 'text-rose-300' : 'text-white group-hover:text-blue-300'
              }`}>Case Tracker</p>
              <p className="text-slate-400 text-sm">追蹤排程 · 送件 · 下架進度</p>
            </div>
          </Link>
        </div>

        {/* De-fear footer note */}
        <p className="text-center text-slate-600 text-sm mt-8">
          「你負責安心，我們負責盯守。」
        </p>
      </div>
    </div>
  );
}
