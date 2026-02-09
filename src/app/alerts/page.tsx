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
    <div className="py-6 sm:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">即時通知</h1>
            <p className="text-gray-500 mt-1">
              {unreadCount > 0 ? `${unreadCount} 則未讀通知` : '沒有未讀通知'}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            全部標為已讀
          </Button>
        </div>

        {/* De-fear message */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <p className="text-blue-800 text-sm">
            我們會在這裡即時通知你重要的監控發現。放心，沒事的時候我們也會定期回報環境變化。
          </p>
        </Card>

        {/* Alerts List */}
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Link key={alert.id} href={`/alerts/${alert.id}`}>
              <Card
                hover
                className={cn(
                  'transition-all',
                  !alert.read && 'border-blue-200 bg-blue-50/30'
                )}
                padding="sm"
              >
                <div className="flex items-start gap-3">
                  {/* Unread indicator */}
                  <div className="flex-shrink-0 mt-1">
                    {!alert.read && (
                      <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
                    )}
                    {alert.read && <div className="w-2 h-2" />}
                  </div>

                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">
                        {getAlertTypeLabel(alert.type)}
                      </span>
                      {alert.riskLevel && (
                        <RiskBadge level={alert.riskLevel} size="sm" showLabel={false} />
                      )}
                    </div>
                    <h3 className={cn(
                      'font-medium text-gray-900 mb-1',
                      !alert.read && 'font-semibold'
                    )}>
                      {alert.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{alert.summary}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatRelativeTime(alert.createdAt)}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">目前沒有通知</p>
          </div>
        )}
      </div>
    </div>
  );
}
