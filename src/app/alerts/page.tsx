'use client';

import Link from 'next/link';
import { Bell, AlertTriangle, Info, Calendar, ChevronRight, RefreshCw, Circle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { alerts } from '@/data/mockData';
import { formatRelativeTime, cn } from '@/lib/utils';
import { Alert } from '@/data/types';

function getAlertIcon(type: Alert['type']) {
  switch (type) {
    case 'new_case':
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case 'status_update':
      return <RefreshCw className="w-5 h-5 text-blue-500" />;
    case 'environment_change':
      return <Info className="w-5 h-5 text-amber-500" />;
    case 'weekly_summary':
      return <Calendar className="w-5 h-5 text-purple-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
}

function getAlertTypeLabel(type: Alert['type']) {
  switch (type) {
    case 'new_case':
      return '新案件';
    case 'status_update':
      return '狀態更新';
    case 'environment_change':
      return '環境變化';
    case 'weekly_summary':
      return '週報摘要';
    default:
      return '通知';
  }
}

export default function AlertsPage() {
  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="py-6 sm:py-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-40 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[90px] -z-10 animate-pulse-slow" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">即時通知 🔔</h1>
            <p className="text-slate-400 mt-2 text-lg font-medium">
              {unreadCount > 0 ? `${unreadCount} 則未讀通知` : '沒有未讀通知'}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            全部標為已讀
          </Button>
        </div>

        {/* De-fear message */}
        <Card className="mb-6 bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <p className="text-blue-100 text-base leading-relaxed">
            我們會在這裡即時通知你重要的監控發現。
            <span className="block mt-1 text-blue-200">放心，沒事的時候我們也會定期回報環境變化，讓你隨時掌握狀況。</span>
          </p>
        </Card>

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Link key={alert.id} href={`/alerts/${alert.id}`}>
              <Card
                hover
                className={cn(
                  'transition-all duration-300 group',
                  !alert.read
                    ? 'border-cyan-500/50 bg-cyan-950/30 hover:bg-cyan-900/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-600'
                )}
                padding="md"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    'flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg',
                    !alert.read ? 'bg-cyan-500/20 shadow-cyan-500/20' : 'bg-slate-800 shadow-black/20'
                  )}>
                    {getAlertIcon(alert.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-bold border',
                        !alert.read
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      )}>
                        {getAlertTypeLabel(alert.type)}
                      </span>
                      {alert.riskLevel && (
                        <RiskBadge level={alert.riskLevel} size="sm" showLabel={false} />
                      )}
                      {!alert.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                      )}
                    </div>
                    <h3 className={cn(
                      'text-lg mb-1 transition-colors',
                      !alert.read ? 'font-bold text-white group-hover:text-cyan-200' : 'font-medium text-slate-300 group-hover:text-white'
                    )}>
                      {alert.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 group-hover:text-slate-300 transition-colors">{alert.summary}</p>
                    <p className="text-xs text-slate-500 mt-3 font-medium">
                      {formatRelativeTime(alert.createdAt)}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-800">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-500 text-lg font-medium">目前沒有通知</p>
            <p className="text-slate-600 text-sm mt-2">享受片刻的寧靜吧 ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}
