'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, X, Check, RotateCcw, ChevronDown } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/lib/useSettings';
import { Platform, NotificationFrequency, TrademarkInfo } from '@/data/types';
import { cn } from '@/lib/utils';
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
    updatePlatforms,
    updateNotificationFrequency,
    resetSettings,
  } = useSettings();

  const [localChineseName, setLocalChineseName] = useState('');
  const [localEnglishName, setLocalEnglishName] = useState('');
  const [newFanPageName, setNewFanPageName] = useState('');
  const [newFanPageUrl, setNewFanPageUrl] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tmExpanded, setTmExpanded] = useState(false);
  const [tmNameChinese, setTmNameChinese] = useState('');
  const [tmNameEnglish, setTmNameEnglish] = useState('');
  const [tmTerritory, setTmTerritory] = useState('');
  const [tmNumber, setTmNumber] = useState('');
  const [tmDatabaseUrl, setTmDatabaseUrl] = useState('');
  const [tmStatus, setTmStatus] = useState<'registered' | 'pending'>('registered');

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

  const handleAddTrademark = () => {
    if (!tmNameChinese.trim() && !tmNameEnglish.trim()) return;
    const existing = settings.trademarks || [];
    saveSettings({ trademarks: [...existing, {
      nameChinese: tmNameChinese.trim(),
      nameEnglish: tmNameEnglish.trim(),
      registrationTerritory: tmTerritory.trim(),
      registrationNumber: tmNumber.trim(),
      databaseUrl: tmDatabaseUrl.trim(),
      status: tmStatus,
    }], trademarkProvided: true });
    setTmNameChinese('');
    setTmNameEnglish('');
    setTmTerritory('');
    setTmNumber('');
    setTmDatabaseUrl('');
    setTmStatus('registered');
    showSaved();
  };

  const handleRemoveTrademark = (index: number) => {
    const updated = (settings.trademarks || []).filter((_, i) => i !== index);
    saveSettings({ trademarks: updated, trademarkProvided: updated.length > 0 });
    showSaved();
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  // 關鍵字自動推薦邏輯（keyword suggestion engine）：
  // 根據使用者填入的中文名、英文名、品牌名、粉專名，自動產生常見冒名變體關鍵字，
  // 例如：「陳品安」→「陳品安官方」、「陳品安客服」；「PinAn」→「pinan_official」、「real_pinan」。
  // updateKeywords() 會將選中的關鍵字存入 useSettings（localStorage），並傳給後端監控引擎。
  // 如需重新啟用關鍵字設定 UI，恢復此 useMemo 與對應的 Card 即可。
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
  void suggestions; // 保留供工程師參考，UI 暫不開放使用者編輯關鍵字

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
            💡 填寫完畢後點擊下方「儲存設定」，我們團隊會收到你的資料並在下一個工作天內更新你的監控範圍與設定。
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

        {/* Trademarks */}
        <Card className="mb-6 bg-slate-900/40 backdrop-blur border-slate-700/50">
          <CardHeader title="商標資料 ™️" subtitle="補充或追加商標資訊，有助於強化申訴效力" />

          {/* Existing entries */}
          {(settings.trademarks || []).length > 0 && (
            <div className="space-y-2 mb-4">
              {(settings.trademarks || []).map((tm: TrademarkInfo, i: number) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 bg-slate-800 rounded-2xl border border-slate-600">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold">
                      {tm.nameChinese || tm.nameEnglish}
                      {tm.nameChinese && tm.nameEnglish && (
                        <span className="text-slate-400 font-normal"> / {tm.nameEnglish}</span>
                      )}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {[tm.registrationTerritory, tm.registrationNumber].filter(Boolean).join('・')}
                      {tm.status === 'registered'
                        ? <span className="ml-2 text-emerald-400">已註冊</span>
                        : <span className="ml-2 text-amber-400">申請中</span>
                      }
                    </p>
                    {tm.databaseUrl && (
                      <p className="text-slate-500 text-xs truncate mt-0.5">{tm.databaseUrl}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveTrademark(i)}
                    className="hover:text-rose-400 transition-colors flex-shrink-0 text-slate-500 bg-white/10 rounded-full p-0.5 hover:bg-white/20 mt-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add form toggle */}
          <button
            onClick={() => setTmExpanded(!tmExpanded)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left',
              tmExpanded
                ? 'border-cyan-500/50 bg-slate-800/50'
                : 'border-dashed border-slate-700 hover:border-slate-500 bg-slate-800/20'
            )}
          >
            <Plus className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-sm text-slate-400 flex-1">新增商標</span>
            <ChevronDown className={cn('w-4 h-4 text-slate-500 transition-transform', tmExpanded && 'rotate-180')} />
          </button>

          {/* Inline add form */}
          {tmExpanded && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={tmNameChinese}
                  onChange={e => setTmNameChinese(e.target.value)}
                  className="px-3 py-2.5 border border-slate-700 bg-slate-900/60 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                  placeholder="商標名稱（中文）"
                />
                <input
                  type="text"
                  value={tmNameEnglish}
                  onChange={e => setTmNameEnglish(e.target.value)}
                  className="px-3 py-2.5 border border-slate-700 bg-slate-900/60 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                  placeholder="商標名稱（英文）"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={tmTerritory}
                  onChange={e => setTmTerritory(e.target.value)}
                  className="px-3 py-2.5 border border-slate-700 bg-slate-900/60 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                  placeholder="商標註冊地（例如：台灣）"
                />
                <input
                  type="text"
                  value={tmNumber}
                  onChange={e => setTmNumber(e.target.value)}
                  className="px-3 py-2.5 border border-slate-700 bg-slate-900/60 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                  placeholder="商標註冊號碼"
                />
              </div>
              <input
                type="url"
                value={tmDatabaseUrl}
                onChange={e => setTmDatabaseUrl(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-700 bg-slate-900/60 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                placeholder="官方商標資料庫連結（例如 TIPO cloud）"
              />
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-400 flex-shrink-0">商標狀態</p>
                <div className="flex gap-2">
                  {(['registered', 'pending'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setTmStatus(s)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
                        tmStatus === s
                          ? s === 'registered'
                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                            : 'border-amber-500 bg-amber-950/40 text-amber-300'
                          : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-500'
                      )}
                    >
                      {s === 'registered' ? '已註冊' : '申請中'}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={handleAddTrademark}
                  disabled={!tmNameChinese.trim() && !tmNameEnglish.trim()}
                  className="ml-auto rounded-xl text-xs py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" /> 新增
                </Button>
              </div>
            </div>
          )}
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
          <CardHeader title="通知頻率 🔔" subtitle="每週一發送監控週報" />
          <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-cyan-500 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <div className="w-6 h-6 rounded-full border-2 border-cyan-500 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)] flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-black font-bold" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg text-cyan-300">週報</p>
              <p className="text-sm text-slate-400 mt-1">每週一發送週報</p>
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="mb-4">
          <Button
            onClick={handleSubmit}
            className="w-full py-4 text-base font-bold rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
          >
            <Check className="w-5 h-5" />
            儲存設定
          </Button>
        </div>

        {/* Submitted Banner */}
        {submitted && (
          <Card className="mb-4 bg-emerald-900/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-300 font-bold text-sm">設定已送出！</p>
                <p className="text-emerald-200/70 text-sm mt-0.5">
                  我們已收到你的監控設定資料，團隊將在下一個工作天內完成更新，屆時你的監控範圍與通知設定將生效。
                </p>
              </div>
            </div>
          </Card>
        )}

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
