'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, X, Check, RotateCcw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/lib/useSettings';
import { Platform, NotificationFrequency, DelegationPreference } from '@/data/types';
import { cn } from '@/lib/utils';

const allPlatforms: Platform[] = ['Instagram', 'Facebook', 'Threads'];

const frequencyOptions: { value: NotificationFrequency; label: string; description: string }[] = [
  { value: 'immediate', label: '立即通知', description: '有新發現立即發送通知' },
  { value: 'daily', label: '每日摘要', description: '每天傍晚發送當日摘要' },
  { value: 'weekly', label: '週報', description: '每週一發送週報' },
];

const delegationOptions: { value: DelegationPreference; label: string; description: string; priceNote: string }[] = [
  { value: 'self_only', label: '只要教學', description: '我想自己處理偽冒案件，請給我步驟指引', priceNote: '' },
  { value: 'delegate_when_needed', label: '想要 Watchmen 幫我代管', description: '遇到複雜偽冒情況時，請直接幫我處理', priceNote: '+NT$200/月起' },
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
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Pricing calculation
  const BASE_PRICE = 300;
  const KEYWORD_PRICE = 99;
  const PLATFORM_PRICE = 299;
  const DELEGATION_BASE = 200;

  const keywordCount = settings.monitoredKeywords.length;
  const platformCount = settings.platforms.length;
  const isDelegate = settings.delegationPreference === 'delegate_when_needed';

  // Delegation: NT$200 base + 50% per extra platform (1平台=200, 2=300, 3=400)
  const delegationPrice = isDelegate
    ? Math.round(DELEGATION_BASE * (1 + (platformCount - 1) * 0.5))
    : 0;

  const monthlyPrice = BASE_PRICE + (keywordCount * KEYWORD_PRICE) + (platformCount * PLATFORM_PRICE) + delegationPrice;
  const yearlyPrice = monthlyPrice * 10;

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

  // Generate keyword suggestions based on display name and existing keywords
  function generateSuggestions(): string[] {
    const name = settings.displayName;
    if (!name) return [];

    const suggestions: string[] = [];

    // Chinese name variations
    suggestions.push(name);
    suggestions.push(`${name}官方`);
    suggestions.push(`${name}客服`);
    suggestions.push(`${name}工作室`);
    suggestions.push(`${name}粉絲團`);

    // Try to find English name from existing keywords
    const englishKeyword = settings.monitoredKeywords.find(k => /^[A-Za-z\s-]+$/.test(k));
    if (englishKeyword) {
      const lower = englishKeyword.toLowerCase().replace(/[\s-]+/g, '');
      suggestions.push(englishKeyword);
      suggestions.push(`${lower}_official`);
      suggestions.push(`${lower}_tw`);
      suggestions.push(`${lower}_backup`);
      suggestions.push(`real_${lower}`);
    }

    // Try to find brand/handle from existing keywords (contains underscore or dot)
    const handleKeyword = settings.monitoredKeywords.find(k => /[_.]/.test(k) && !/^(real_|.*_official$|.*_tw$|.*_backup$)/.test(k));
    if (handleKeyword) {
      suggestions.push(handleKeyword);
      suggestions.push(`${handleKeyword}_backup`);
      suggestions.push(`${handleKeyword}0`);
    }

    // Common impersonation suffixes for Chinese name
    suggestions.push(`${name}代言`);
    suggestions.push(`${name}合作`);

    // Deduplicate and filter out already-added keywords
    return [...new Set(suggestions)].filter(s => !settings.monitoredKeywords.includes(s));
  }

  const handleAddSuggestion = (keyword: string) => {
    updateKeywords([...settings.monitoredKeywords, keyword]);
    showSaved();
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
    <div className="py-6 sm:py-8 relative">
      {/* Background Elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">監控設定 ⚙️</h1>
            <p className="text-slate-400 mt-1 text-lg">自訂你的監控範圍與偏好</p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold animate-bounce-slow">
              <Check className="w-5 h-5 bg-emerald-500/20 rounded-full p-0.5" />
              已儲存
            </div>
          )}
        </div>

        {/* Info Banner */}
        <Card className="mb-6 bg-blue-900/20 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <p className="text-blue-200 text-sm font-medium">
            💡 設定會儲存在你的瀏覽器中（localStorage），週報會根據這些設定顯示對應內容。
            這是 Demo 版本，不會實際影響監控範圍。
          </p>
        </Card>

        {/* Display Name */}
        <Card className="mb-6 bg-slate-900/40 backdrop-blur border-slate-700/50">
          <CardHeader title="顯示名稱 👤" subtitle="在週報中顯示的稱呼" />
          <div className="flex gap-3">
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 transition-all shadow-inner"
              placeholder="輸入名稱"
            />
            <Button onClick={handleSaveName} className="rounded-2xl shadow-lg shadow-cyan-500/20">
              <Save className="w-4 h-4" />
              儲存
            </Button>
          </div>
        </Card>

        {/* Monitored Keywords */}
        <Card className="mb-6 bg-slate-900/40 backdrop-blur border-slate-700/50">
          <CardHeader
            title="監測關鍵字 🔍"
            subtitle="我們會監測包含這些關鍵字的帳號"
          />
          <div className="flex flex-wrap gap-2 mb-5">
            {settings.monitoredKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full text-sm border border-slate-600 shadow-lg shadow-black/20 hover:scale-105 transition-transform"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:text-rose-400 transition-colors bg-white/10 rounded-full p-0.5 hover:bg-white/20"
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
              className="flex-1 px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 transition-all shadow-inner"
              placeholder="新增關鍵字（品牌名、人名等）"
            />
            <Button variant="outline" onClick={handleAddKeyword} className="rounded-2xl border-slate-600 hover:border-cyan-500 hover:text-cyan-400">
              <Plus className="w-4 h-4" />
              新增
            </Button>
          </div>

          {/* Auto Suggest */}
          <div className="mt-4">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              自動推薦關鍵字
              {showSuggestions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showSuggestions && (
              <div className="mt-3 bg-slate-800/60 rounded-2xl p-4">
                <p className="text-slate-400 text-xs mb-3">
                  根據「{settings.displayName}」自動產生的常見冒名變體，點擊即可加入監控
                </p>
                {generateSuggestions().length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {generateSuggestions().map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleAddSuggestion(suggestion)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-amber-500/30 bg-amber-500/5 text-amber-200 hover:bg-amber-500/20 hover:border-amber-400 transition-all hover:scale-105"
                      >
                        <Plus className="w-3 h-3" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">所有推薦關鍵字都已加入</p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Platforms */}
        <Card className="mb-6 bg-slate-900/40 backdrop-blur border-slate-700/50">
          <CardHeader title="監測平台 📱" subtitle="選擇要監控的社群平台" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allPlatforms.map((platform) => {
              const isSelected = settings.platforms.includes(platform);
              return (
                <button
                  key={platform}
                  onClick={() => handleTogglePlatform(platform)}
                  className={cn(
                    'px-4 py-4 rounded-2xl border-2 text-sm font-bold transition-all duration-300 transform hover:scale-[1.02]',
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-500 hover:text-slate-200'
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
        <Card className="mb-6 bg-slate-900/40 backdrop-blur border-slate-700/50">
          <CardHeader title="通知頻率 🔔" subtitle="選擇接收通知的頻率" />
          <div className="space-y-3">
            {frequencyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFrequencyChange(option.value)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300',
                  settings.notificationFrequency === option.value
                    ? 'border-cyan-500 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                    settings.notificationFrequency === option.value
                      ? 'border-cyan-500 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'border-slate-600 bg-slate-800'
                  )}
                >
                  {settings.notificationFrequency === option.value && (
                    <Check className="w-3.5 h-3.5 text-black font-bold" />
                  )}
                </div>
                <div>
                  <p
                    className={cn(
                      'font-bold text-lg',
                      settings.notificationFrequency === option.value
                        ? 'text-cyan-300'
                        : 'text-slate-200'
                    )}
                  >
                    {option.label}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Delegation Preference */}
        <Card className="mb-6 bg-slate-900/40 backdrop-blur border-slate-700/50">
          <CardHeader
            title="代管偏好 🤝"
            subtitle="遇到問題時，你希望我們如何協助"
          />
          <div className="space-y-3">
            {delegationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDelegationChange(option.value)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300',
                  settings.delegationPreference === option.value
                    ? 'border-purple-500 bg-purple-950/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                    settings.delegationPreference === option.value
                      ? 'border-purple-500 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                      : 'border-slate-600 bg-slate-800'
                  )}
                >
                  {settings.delegationPreference === option.value && (
                    <Check className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={cn(
                        'font-bold text-lg',
                        settings.delegationPreference === option.value
                          ? 'text-purple-300'
                          : 'text-slate-200'
                      )}
                    >
                      {option.label}
                    </p>
                    {option.priceNote && (
                      <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                        {option.priceNote}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Pricing Estimate */}
        <Card className="mb-6 bg-gradient-to-br from-cyan-950/60 to-slate-900/60 backdrop-blur border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <CardHeader
            title="方案估算 💰"
            subtitle="根據你的監控設定，即時估算每月費用"
          />

          {/* Price Display */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-slate-400 text-lg">NT$</span>
              <span className="text-5xl font-black text-white tracking-tight">{monthlyPrice.toLocaleString()}</span>
              <span className="text-slate-400 text-lg">/月</span>
            </div>
            <p className="text-cyan-300/80 text-sm mt-2">
              年繳 NT${yearlyPrice.toLocaleString()}/年（省 2 個月）
            </p>
          </div>

          {/* Breakdown Toggle */}
          <button
            onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
            className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors mb-4"
          >
            查看費用明細
            {showPriceBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Breakdown Details */}
          {showPriceBreakdown && (
            <div className="bg-slate-800/60 rounded-2xl p-4 space-y-3 text-sm mb-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">基本月費</span>
                <span className="text-white font-bold">NT$ {BASE_PRICE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">
                  關鍵字監控 × {keywordCount}
                  <span className="text-slate-500 ml-1">（每組 NT${KEYWORD_PRICE}）</span>
                </span>
                <span className="text-white font-bold">NT$ {(keywordCount * KEYWORD_PRICE).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">
                  平台監控 × {platformCount}
                  <span className="text-slate-500 ml-1">（每個 NT${PLATFORM_PRICE}）</span>
                </span>
                <span className="text-white font-bold">NT$ {(platformCount * PLATFORM_PRICE).toLocaleString()}</span>
              </div>
              {isDelegate && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">
                    代管服務
                    <span className="text-slate-500 ml-1">（{platformCount} 個平台）</span>
                  </span>
                  <span className="text-purple-300 font-bold">NT$ {delegationPrice.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                <span className="text-white font-bold">合計 /月</span>
                <span className="text-cyan-300 font-black text-lg">NT$ {monthlyPrice.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Hint */}
          <p className="text-center text-slate-500 text-xs">
            調整上方的關鍵字、平台或代管偏好，費用會即時更新
          </p>
        </Card>

        {/* Reset */}
        <Card className="border-dashed border-slate-700 bg-transparent hover:border-slate-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">重設為預設值</p>
              <p className="text-sm text-slate-500">清除所有自訂設定</p>
            </div>
            <Button variant="ghost" onClick={handleReset} className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">
              <RotateCcw className="w-4 h-4" />
              重設
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
