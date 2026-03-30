'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, X, Check, RotateCcw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/lib/useSettings';
import { Platform, NotificationFrequency } from '@/data/types';
import { cn } from '@/lib/utils';
import { BRAND_PRICE } from '@/lib/pricing';
import { defaultUserProfile } from '@/data/mockData';

const allPlatforms: Platform[] = ['Instagram', 'Facebook', 'Threads'];

const frequencyOptions: { value: NotificationFrequency; label: string; description: string }[] = [
  { value: 'immediate', label: '立即通知', description: '有新發現立即發送通知' },
  { value: 'daily', label: '每日摘要', description: '每天傍晚發送當日摘要' },
  { value: 'weekly', label: '週報', description: '每週一發送週報' },
];

export default function SettingsPage() {
  const {
    settings,
    isLoaded,
    saveSettings,
    updateChineseName,
    updateEnglishName,
    updateBrandNames,
    updateFanPages,
    updateKeywords,
    updatePlatforms,
    updateNotificationFrequency,
    resetSettings,
  } = useSettings();

  const [localChineseName, setLocalChineseName] = useState('');
  const [localEnglishName, setLocalEnglishName] = useState('');
  const [newFanPageName, setNewFanPageName] = useState('');
  const [newFanPageUrl, setNewFanPageUrl] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [saved, setSaved] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const keywordCount = settings.monitoredKeywords.length;

  useEffect(() => {
    if (isLoaded) {
      setLocalChineseName(settings.chineseName);
      setLocalEnglishName(settings.englishName);
    }
  }, [isLoaded, settings.chineseName, settings.englishName]);

  const handleSaveChineseName = () => {
    updateChineseName(localChineseName);
    showSaved();
  };

  const handleSaveEnglishName = () => {
    updateEnglishName(localEnglishName);
    showSaved();
  };

  const handleAddFanPage = () => {
    if (!newFanPageName.trim()) return;
    updateFanPages([...(settings.fanPages || []), { name: newFanPageName.trim(), url: newFanPageUrl.trim() }]);
    setNewFanPageName('');
    setNewFanPageUrl('');
    showSaved();
  };

  const handleRemoveFanPage = (index: number) => {
    updateFanPages((settings.fanPages || []).filter((_, i) => i !== index));
    showSaved();
  };

  const handleAddBrand = () => {
    if (newBrand.trim() && !settings.brandNames.includes(newBrand.trim())) {
      updateBrandNames([...settings.brandNames, newBrand.trim()]);
      setNewBrand('');
      showSaved();
    }
  };

  const handleRemoveBrand = (brand: string) => {
    updateBrandNames(settings.brandNames.filter((b) => b !== brand));
    showSaved();
  };

  const MAX_KEYWORDS = 3;

  const handleAddKeyword = () => {
    if (settings.monitoredKeywords.length >= MAX_KEYWORDS) return;
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

  const handleReset = () => {
    resetSettings();
    setLocalChineseName(defaultUserProfile.chineseName);
    setLocalEnglishName(defaultUserProfile.englishName);
    showSaved();
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Memoized keyword suggestions based on Chinese name, English name, brand names, and fan pages
  const suggestions = useMemo(() => {
    const result: string[] = [];
    const chName = settings.chineseName;
    const enName = settings.englishName;
    if (chName) {
      result.push(chName, `${chName}官方`, `${chName}客服`, `${chName}工作室`, `${chName}粉絲團`, `${chName}代言`, `${chName}合作`);
    }
    if (enName) {
      const lower = enName.toLowerCase().replace(/[\s-]+/g, '');
      result.push(enName, `${lower}_official`, `${lower}_tw`, `${lower}_backup`, `real_${lower}`);
    }
    (settings.fanPages || []).forEach(fp => {
      if (fp.name) result.push(fp.name, `${fp.name}_official`, `${fp.name}_backup`, `real_${fp.name}`);
    });
    settings.brandNames.forEach(brand => {
      if (brand) result.push(brand, `${brand}官方`, `${brand}_official`, `${brand}_backup`);
    });
    return [...new Set(result)].filter(s => !settings.monitoredKeywords.includes(s));
  }, [settings.chineseName, settings.englishName, settings.fanPages, settings.brandNames, settings.monitoredKeywords]);

  const handleAddSuggestion = (keyword: string) => {
    if (settings.monitoredKeywords.length >= MAX_KEYWORDS) return;
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

        {/* Identity Info */}
        <Card className="mb-6 bg-slate-900/40 backdrop-blur border-slate-700/50">
          <CardHeader title="告訴我們你是誰 👤" subtitle="這些資訊用於產生監測關鍵字，填得越完整越精準" />

          {/* Chinese Name */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-300 mb-2">本名 / 藝名</label>
            <input
              type="text"
              value={localChineseName}
              onChange={(e) => setLocalChineseName(e.target.value)}
              onBlur={handleSaveChineseName}
              className="w-full px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 transition-all shadow-inner"
              placeholder="例如：陳品安"
            />
          </div>

          {/* English Name */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-300 mb-2">英文名 / 英文藝名</label>
            <input
              type="text"
              value={localEnglishName}
              onChange={(e) => setLocalEnglishName(e.target.value)}
              onBlur={handleSaveEnglishName}
              className="w-full px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 transition-all shadow-inner"
              placeholder="例如：Pin-An Chen"
            />
          </div>

          {/* Brand Names */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-300">品牌名稱</label>
              <span className="text-xs text-slate-500">每個品牌 +NT${BRAND_PRICE}/月</span>
            </div>
            {settings.brandNames.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {settings.brandNames.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full text-sm border border-slate-600 shadow-lg shadow-black/20 hover:scale-105 transition-transform"
                  >
                    {brand}
                    <button
                      onClick={() => handleRemoveBrand(brand)}
                      className="hover:text-rose-400 transition-colors bg-white/10 rounded-full p-0.5 hover:bg-white/20"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <input
                type="text"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
                className="flex-1 px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 transition-all shadow-inner"
                placeholder="例如：PAC Studio"
              />
              <Button variant="outline" onClick={handleAddBrand} className="rounded-2xl border-slate-600 hover:border-cyan-500 hover:text-cyan-400">
                <Plus className="w-4 h-4" />
                新增
              </Button>
            </div>
          </div>

          {/* Fan Pages */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">粉專名稱與連結</label>
            {(settings.fanPages || []).length > 0 && (
              <div className="space-y-2 mb-3">
                {(settings.fanPages || []).map((fp, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-2xl border border-slate-600">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{fp.name}</p>
                      {fp.url && <p className="text-slate-400 text-xs truncate">{fp.url}</p>}
                    </div>
                    <button
                      onClick={() => handleRemoveFanPage(i)}
                      className="hover:text-rose-400 transition-colors flex-shrink-0 bg-white/10 rounded-full p-0.5 hover:bg-white/20"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <input
                type="text"
                value={newFanPageName}
                onChange={(e) => setNewFanPageName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 transition-all shadow-inner"
                placeholder="粉專名稱，例如：陳品安官方粉絲團"
              />
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newFanPageUrl}
                  onChange={(e) => setNewFanPageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFanPage()}
                  className="flex-1 px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 transition-all shadow-inner"
                  placeholder="粉專連結，例如：https://www.instagram.com/pinan"
                />
                <Button variant="outline" onClick={handleAddFanPage} className="rounded-2xl border-slate-600 hover:border-cyan-500 hover:text-cyan-400 flex-shrink-0">
                  <Plus className="w-4 h-4" />
                  新增
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Monitored Keywords */}
        <Card className="mb-6 bg-slate-900/40 backdrop-blur border-slate-700/50">
          <div className="flex items-start justify-between mb-1">
            <CardHeader
              title="監測關鍵字 🔍"
              subtitle="我們會監測包含這些關鍵字的帳號"
            />
            <span className={cn(
              'text-sm font-bold px-3 py-1 rounded-full border flex-shrink-0 mt-1',
              keywordCount >= MAX_KEYWORDS
                ? 'text-rose-300 bg-rose-500/10 border-rose-500/30'
                : 'text-slate-400 bg-slate-800/60 border-slate-700'
            )}>
              {keywordCount} / {MAX_KEYWORDS}
            </span>
          </div>
          {keywordCount >= MAX_KEYWORDS && (
            <p className="text-rose-400 text-xs font-medium mb-3">已達上限，請先移除一個關鍵字再新增</p>
          )}
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
              disabled={keywordCount >= MAX_KEYWORDS}
              className={cn(
                'flex-1 px-4 py-3 border bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 transition-all shadow-inner',
                keywordCount >= MAX_KEYWORDS ? 'border-slate-700/50 opacity-40 cursor-not-allowed' : 'border-slate-700'
              )}
              placeholder={keywordCount >= MAX_KEYWORDS ? '已達 3 個關鍵字上限' : '新增關鍵字（品牌名、人名等）'}
            />
            <Button
              variant="outline"
              onClick={handleAddKeyword}
              disabled={keywordCount >= MAX_KEYWORDS}
              className="rounded-2xl border-slate-600 hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-600 disabled:hover:text-current"
            >
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
                  根據你的中文名、英文名與品牌名稱，自動產生常見冒名變體，點擊即可加入監控
                </p>
                {suggestions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleAddSuggestion(suggestion)}
                        disabled={keywordCount >= MAX_KEYWORDS}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-amber-500/30 bg-amber-500/5 text-amber-200 hover:bg-amber-500/20 hover:border-amber-400 transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-amber-500/5 disabled:hover:border-amber-500/30"
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
