'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, X, Check, RotateCcw } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/lib/useSettings';
import { Platform, NotificationFrequency, DelegationPreference } from '@/data/types';
import { cn } from '@/lib/utils';

const allPlatforms: Platform[] = ['Instagram', 'Facebook', 'TikTok', 'Twitter'];

const frequencyOptions: { value: NotificationFrequency; label: string; description: string }[] = [
  { value: 'immediate', label: '立即通知', description: '有新發現立即發送通知' },
  { value: 'daily', label: '每日摘要', description: '每天傍晚發送當日摘要' },
  { value: 'weekly', label: '週報', description: '每週一發送週報' },
];

const delegationOptions: { value: DelegationPreference; label: string; description: string }[] = [
  { value: 'self_only', label: '只要教學', description: '我想自己處理，請給我步驟指引' },
  { value: 'delegate_when_needed', label: '需要時代管', description: '遇到複雜狀況時，請幫我處理' },
];

export default function SettingsPage() {
  const {
    settings,
    isLoaded,
    saveSettings,
    updateDisplayName,
    updateKeywords,
    updatePlatforms,
    updateNotificationFrequency,
    updateDelegationPreference,
    resetSettings,
  } = useSettings();

  const [localName, setLocalName] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setLocalName(settings.displayName);
    }
  }, [isLoaded, settings.displayName]);

  const handleSaveName = () => {
    updateDisplayName(localName);
    showSaved();
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !settings.monitoredKeywords.includes(newKeyword.trim())) {
      updateKeywords([...settings.monitoredKeywords, newKeyword.trim()]);
      setNewKeyword('');
      showSaved();
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    updateKeywords(settings.monitoredKeywords.filter((k) => k !== keyword));
    showSaved();
  };

  const handleTogglePlatform = (platform: Platform) => {
    if (settings.platforms.includes(platform)) {
      updatePlatforms(settings.platforms.filter((p) => p !== platform));
    } else {
      updatePlatforms([...settings.platforms, platform]);
    }
    showSaved();
  };

  const handleFrequencyChange = (frequency: NotificationFrequency) => {
    updateNotificationFrequency(frequency);
    showSaved();
  };

  const handleDelegationChange = (preference: DelegationPreference) => {
    updateDelegationPreference(preference);
    showSaved();
  };

  const handleReset = () => {
    resetSettings();
    setLocalName('陳品安');
    showSaved();
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isLoaded) {
    return (
      <div className="py-6 sm:py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-40 bg-gray-200 rounded" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">監控設定</h1>
            <p className="text-gray-500 mt-1">自訂你的監控範圍與偏好</p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <Check className="w-4 h-4" />
              已儲存
            </div>
          )}
        </div>

        {/* Info Banner */}
        <Card className="mb-6 bg-blue-50 border-blue-100">
          <p className="text-blue-800 text-sm">
            設定會儲存在你的瀏覽器中（localStorage），週報會根據這些設定顯示對應內容。
            這是 Demo 版本，不會實際影響監控範圍。
          </p>
        </Card>

        {/* Display Name */}
        <Card className="mb-6">
          <CardHeader title="顯示名稱" subtitle="在週報中顯示的稱呼" />
          <div className="flex gap-3">
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="輸入名稱"
            />
            <Button onClick={handleSaveName}>
              <Save className="w-4 h-4" />
              儲存
            </Button>
          </div>
        </Card>

        {/* Monitored Keywords */}
        <Card className="mb-6">
          <CardHeader
            title="監測關鍵字"
            subtitle="我們會監測包含這些關鍵字的帳號"
          />
          <div className="flex flex-wrap gap-2 mb-4">
            {settings.monitoredKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="新增關鍵字（品牌名、人名等）"
            />
            <Button variant="outline" onClick={handleAddKeyword}>
              <Plus className="w-4 h-4" />
              新增
            </Button>
          </div>
        </Card>

        {/* Platforms */}
        <Card className="mb-6">
          <CardHeader title="監測平台" subtitle="選擇要監控的社群平台" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allPlatforms.map((platform) => {
              const isSelected = settings.platforms.includes(platform);
              return (
                <button
                  key={platform}
                  onClick={() => handleTogglePlatform(platform)}
                  className={cn(
                    'px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all',
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  )}
                >
                  {isSelected && <Check className="w-4 h-4 inline mr-1.5" />}
                  {platform}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Notification Frequency */}
        <Card className="mb-6">
          <CardHeader title="通知頻率" subtitle="選擇接收通知的頻率" />
          <div className="space-y-3">
            {frequencyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFrequencyChange(option.value)}
                className={cn(
                  'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                  settings.notificationFrequency === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                    settings.notificationFrequency === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  )}
                >
                  {settings.notificationFrequency === option.value && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <div>
                  <p
                    className={cn(
                      'font-medium',
                      settings.notificationFrequency === option.value
                        ? 'text-blue-700'
                        : 'text-gray-900'
                    )}
                  >
                    {option.label}
                  </p>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Delegation Preference */}
        <Card className="mb-6">
          <CardHeader
            title="代管偏好"
            subtitle="遇到問題時，你希望我們如何協助"
          />
          <div className="space-y-3">
            {delegationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDelegationChange(option.value)}
                className={cn(
                  'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                  settings.delegationPreference === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                    settings.delegationPreference === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  )}
                >
                  {settings.delegationPreference === option.value && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <div>
                  <p
                    className={cn(
                      'font-medium',
                      settings.delegationPreference === option.value
                        ? 'text-blue-700'
                        : 'text-gray-900'
                    )}
                  >
                    {option.label}
                  </p>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Reset */}
        <Card className="border-dashed">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">重設為預設值</p>
              <p className="text-sm text-gray-500">清除所有自訂設定</p>
            </div>
            <Button variant="ghost" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
              重設
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
