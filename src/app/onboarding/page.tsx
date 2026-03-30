'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Plus, X, ChevronRight, ChevronLeft, Shield, Upload, FileText, Sparkles, Download, AlertCircle, Camera, Loader2, XCircle } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/lib/useSettings';
import { Platform } from '@/data/types';
import { cn } from '@/lib/utils';
import { defaultUserProfile } from '@/data/mockData';

const allPlatforms: Platform[] = ['Instagram', 'Facebook', 'Threads'];

const steps = [
  { id: 1, label: '基本資料', icon: '👤' },
  { id: 2, label: '關鍵字設定', icon: '🔍' },
  { id: 3, label: '文件上傳', icon: '📄' },
  { id: 4, label: '授權同意', icon: '✅' },
  { id: 5, label: '完成', icon: '🎉' },
];

const MAX_KEYWORDS = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const { settings, saveSettings } = useSettings();

  const [step, setStep] = useState(1);
  const [chineseName, setChineseName] = useState(settings.chineseName || '');
  const [englishName, setEnglishName] = useState(settings.englishName || '');
  const [email, setEmail] = useState(settings.email || '');
  const [displayName, setDisplayName] = useState(settings.displayName || '');
  const [platforms, setPlatforms] = useState<Platform[]>(settings.platforms);
  const [brandNames, setBrandNames] = useState<string[]>(settings.brandNames);
  const [newBrand, setNewBrand] = useState('');
  const [fanPages, setFanPages] = useState<{ name: string; url: string }[]>(settings.fanPages || []);
  const [newFanPageName, setNewFanPageName] = useState('');
  const [newFanPageUrl, setNewFanPageUrl] = useState('');
  const [keywords, setKeywords] = useState<string[]>(settings.monitoredKeywords);
  const [newKeyword, setNewKeyword] = useState('');
  const [loaUploaded, setLoaUploaded] = useState(false);
  const [loaDownloaded, setLoaDownloaded] = useState(false);
  const [loaFileName, setLoaFileName] = useState('');
  const [loaComplianceStatus, setLoaComplianceStatus] = useState<'idle' | 'checking' | 'passed' | 'failed'>('idle');
  const [trademarkProvided, setTrademarkProvided] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const suggestions = useMemo(() => {
    const result: string[] = [];
    if (chineseName) {
      result.push(chineseName, `${chineseName}官方`, `${chineseName}客服`, `${chineseName}工作室`);
    }
    if (englishName) {
      const lower = englishName.toLowerCase().replace(/[\s-]+/g, '');
      result.push(englishName, `${lower}_official`, `${lower}_tw`, `${lower}_backup`);
    }
    fanPages.forEach(fp => {
      if (fp.name) result.push(fp.name, `${fp.name}_official`, `${fp.name}_backup`);
    });
    brandNames.forEach(b => {
      if (b) result.push(b, `${b}官方`, `${b}_official`);
    });
    return [...new Set(result)].filter(s => !keywords.includes(s));
  }, [chineseName, englishName, fanPages, brandNames, keywords]);

  const handleAddBrand = () => {
    if (newBrand.trim() && !brandNames.includes(newBrand.trim())) {
      setBrandNames([...brandNames, newBrand.trim()]);
      setNewBrand('');
    }
  };

  const handleAddKeyword = (kw?: string) => {
    if (keywords.length >= MAX_KEYWORDS) return;
    const val = kw ?? newKeyword.trim();
    if (val && !keywords.includes(val)) {
      setKeywords([...keywords, val]);
      if (!kw) setNewKeyword('');
    }
  };

  const handleTogglePlatform = (p: Platform) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const canProceed = () => {
    if (step === 1) return chineseName.trim().length > 0 && email.trim().length > 0;
    if (step === 2) return keywords.length > 0;
    if (step === 4) return privacyConsent;
    return true;
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleComplete = () => {
    saveSettings({
      chineseName,
      englishName,
      email,
      displayName: displayName || chineseName,
      brandNames,
      fanPages,
      monitoredKeywords: keywords,
      platforms,
      hasCompletedOnboarding: true,
      onboardingCompletedAt: new Date().toISOString(),
      loaUploaded,
      trademarkProvided,
      privacyConsentAccepted: privacyConsent,
    });
    router.push('/dashboard');
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">設定你的監控帳戶</h1>
          <p className="text-slate-400">只需幾分鐘，讓我們開始守護你的身份</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
                  step > s.id
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                    : step === s.id
                      ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                )}>
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    'h-0.5 flex-1 mx-1 transition-all',
                    step > s.id ? 'bg-emerald-500' : 'bg-slate-700'
                  )} style={{ width: '40px' }} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-400 mt-3">
            {steps[step - 1].icon} {steps[step - 1].label}
            <span className="text-slate-600 ml-2">（{step} / {steps.length}）</span>
          </p>
        </div>

        {/* Step Content */}
        <Card className="mb-6 bg-slate-900/40 backdrop-blur border-slate-700/50">

          {/* Step 1: 基本資料 + 品牌 + 粉專 */}
          {step === 1 && (
            <div className="space-y-5">
              <CardHeader title="告訴我們你是誰 👤" subtitle="用來產生監測關鍵字與週報顯示" />

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">本名 / 藝名 <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  value={chineseName}
                  onChange={e => setChineseName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                  placeholder="例如：陳品安"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">英文名 / 英文藝名</label>
                <input
                  type="text"
                  value={englishName}
                  onChange={e => setEnglishName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                  placeholder="例如：Pin-An Chen"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Email <span className="text-rose-400">*</span>
                  <span className="ml-2 text-xs font-normal text-slate-500">用於接收 Watchmen 週報</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                  placeholder="例如：pinan@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">品牌名稱</label>
                {brandNames.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {brandNames.map(b => (
                      <span key={b} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded-full text-sm border border-slate-600">
                        {b}
                        <button onClick={() => setBrandNames(brandNames.filter(x => x !== b))} className="hover:text-rose-400 transition-colors">
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
                    onChange={e => setNewBrand(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddBrand()}
                    className="flex-1 px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                    placeholder="例如：PAC Studio"
                  />
                  <Button variant="outline" onClick={handleAddBrand} className="rounded-2xl">
                    <Plus className="w-4 h-4" /> 新增
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">粉專名稱與連結</label>
                {fanPages.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {fanPages.map((fp, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-2xl border border-slate-600">
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{fp.name}</p>
                          <p className="text-slate-400 text-xs truncate">{fp.url}</p>
                        </div>
                        <button
                          onClick={() => setFanPages(fanPages.filter((_, idx) => idx !== i))}
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
                    onChange={e => setNewFanPageName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                    placeholder="粉專名稱，例如：陳品安官方粉絲團"
                  />
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newFanPageUrl}
                      onChange={e => setNewFanPageUrl(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newFanPageName.trim()) {
                          setFanPages([...fanPages, { name: newFanPageName.trim(), url: newFanPageUrl.trim() }]);
                          setNewFanPageName('');
                          setNewFanPageUrl('');
                        }
                      }}
                      className="flex-1 px-4 py-3 border border-slate-700 bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
                      placeholder="粉專連結，例如：https://www.instagram.com/pinan"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (newFanPageName.trim()) {
                          setFanPages([...fanPages, { name: newFanPageName.trim(), url: newFanPageUrl.trim() }]);
                          setNewFanPageName('');
                          setNewFanPageUrl('');
                        }
                      }}
                      className="rounded-2xl flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" /> 新增
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">監測平台</label>
                <div className="grid grid-cols-3 gap-3">
                  {allPlatforms.map(p => (
                    <button
                      key={p}
                      onClick={() => handleTogglePlatform(p)}
                      className={cn(
                        'px-4 py-3 rounded-2xl border-2 text-sm font-bold transition-all',
                        platforms.includes(p)
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-slate-500'
                      )}
                    >
                      {platforms.includes(p) && <Check className="w-4 h-4 inline mr-1.5" />}
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 關鍵字設定（根據 Step 1 資料自動推薦） */}
          {step === 2 && (
            <div className="space-y-5">
              <CardHeader title="關鍵字設定 🔍" subtitle="根據你的資料自動推薦，最多選 3 個" />

              {/* Count badge */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">已選關鍵字</p>
                <span className={cn(
                  'text-sm font-bold px-3 py-1 rounded-full border',
                  keywords.length >= MAX_KEYWORDS
                    ? 'text-rose-300 bg-rose-500/10 border-rose-500/30'
                    : 'text-slate-400 bg-slate-800/60 border-slate-700'
                )}>
                  {keywords.length} / {MAX_KEYWORDS}
                </span>
              </div>

              {/* Selected keywords */}
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {keywords.map(k => (
                    <span key={k} className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-950/40 text-cyan-200 rounded-full text-sm border border-cyan-500/40">
                      {k}
                      <button onClick={() => setKeywords(keywords.filter(x => x !== k))} className="hover:text-rose-400 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {keywords.length >= MAX_KEYWORDS && (
                <p className="text-rose-400 text-xs font-medium">已達上限，請先移除一個關鍵字再新增</p>
              )}

              {/* Auto suggestions */}
              {suggestions.length > 0 ? (
                <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20">
                  <p className="text-xs text-amber-300 font-bold mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> 根據你的資料自動推薦（點擊加入）
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map(s => (
                      <button
                        key={s}
                        onClick={() => handleAddKeyword(s)}
                        disabled={keywords.length >= MAX_KEYWORDS}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border border-amber-500/30 bg-amber-500/5 text-amber-200 hover:bg-amber-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-amber-500/5"
                      >
                        <Plus className="w-3 h-3" /> {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">填寫第一步的資料後，這裡會自動產生推薦關鍵字</p>
              )}

              {/* Manual add */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={e => setNewKeyword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddKeyword()}
                  disabled={keywords.length >= MAX_KEYWORDS}
                  className={cn(
                    'flex-1 px-4 py-3 border bg-slate-800/80 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500 transition-all',
                    keywords.length >= MAX_KEYWORDS ? 'border-slate-700/50 opacity-40 cursor-not-allowed' : 'border-slate-700'
                  )}
                  placeholder={keywords.length >= MAX_KEYWORDS ? '已達 3 個上限' : '或手動輸入關鍵字'}
                />
                <Button
                  variant="outline"
                  onClick={() => handleAddKeyword()}
                  disabled={keywords.length >= MAX_KEYWORDS}
                  className="rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" /> 新增
                </Button>
              </div>

              {keywords.length === 0 && (
                <p className="text-amber-400/70 text-xs">至少選擇 1 個關鍵字才能繼續</p>
              )}
            </div>
          )}

          {/* Step 3: 文件上傳 */}
          {step === 3 && (
            <div className="space-y-6">
              <CardHeader title="身份文件 📄" subtitle="請下載 LOA 授權書、簽署後回傳，我們將代理你提交申訴" />

              {/* ── 1. 下載表單 ── */}
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">第一步・下載表單</p>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm">LOA_Watchmen_Authorization.pdf</p>
                    <p className="text-xs text-slate-400 mt-0.5">Letter of Authorization・1 頁・繁體中文</p>
                  </div>
                  <button
                    onClick={() => setLoaDownloaded(true)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-all',
                      loaDownloaded
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20'
                    )}
                  >
                    {loaDownloaded ? (
                      <><Check className="w-3.5 h-3.5" /> 已下載</>
                    ) : (
                      <><Download className="w-3.5 h-3.5" /> 下載範本</>
                    )}
                  </button>
                </div>
              </div>

              {/* ── 2. 簽署說明 ── */}
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">第二步・簽署方式</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                    <p className="text-sm font-bold text-white mb-1">✍️ 電子簽名</p>
                    <p className="text-xs text-slate-400 leading-relaxed">使用 Adobe Sign、DocuSign 等工具完成簽名後，匯出 PDF 上傳</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                    <p className="text-sm font-bold text-white mb-1">🖊️ 紙本簽名</p>
                    <p className="text-xs text-slate-400 leading-relaxed">列印後親筆簽名，拍照或掃描成 PDF / JPG 後上傳</p>
                  </div>
                </div>

                {/* Photo hints */}
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <p className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" /> 拍攝 / 掃描注意事項
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>四個角落需完整入鏡，不可裁切</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>光線充足，避免反光、陰影或過曝</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>字跡與簽名清晰可辨，禁止模糊</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>格式：PDF、JPG、PNG・檔案大小 10MB 以內</li>
                  </ul>
                </div>
              </div>

              {/* ── 3. 上傳 & 合規驗證 ── */}
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">第三步・上傳簽署文件</p>

                {loaComplianceStatus === 'passed' ? (
                  /* Passed */
                  <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-300">文件驗證通過</p>
                        <p className="text-xs text-slate-400 truncate max-w-[220px]">{loaFileName}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 pt-1 border-t border-emerald-500/20">
                      {['簽名欄位已偵測', '文件內容完整', '影像品質符合標準', '檔案格式合規'].map(item => (
                        <div key={item} className="flex items-center gap-2 text-xs text-emerald-200">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => { setLoaFileName(''); setLoaComplianceStatus('idle'); setLoaUploaded(false); }}
                      className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      重新上傳
                    </button>
                  </div>
                ) : loaComplianceStatus === 'checking' ? (
                  /* Checking */
                  <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col items-center gap-3 text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    <div>
                      <p className="font-bold text-white text-sm">驗證中...</p>
                      <p className="text-xs text-slate-400 mt-1">系統正在檢查文件合規性，請稍候</p>
                    </div>
                  </div>
                ) : loaComplianceStatus === 'failed' ? (
                  /* Failed */
                  <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-5 h-5 text-rose-400" />
                      </div>
                      <div>
                        <p className="font-bold text-rose-300">驗證未通過</p>
                        <p className="text-xs text-slate-400">請修正以下問題後重新上傳</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 pt-1 border-t border-rose-500/20">
                      {['影像模糊，請重新拍攝', '簽名欄位未偵測到'].map(item => (
                        <div key={item} className="flex items-center gap-2 text-xs text-rose-300">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => { setLoaFileName(''); setLoaComplianceStatus('idle'); }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-rose-500/20 hover:bg-rose-500/30 px-3 py-2 rounded-xl transition-all border border-rose-500/30"
                    >
                      <Upload className="w-3.5 h-3.5" /> 重新上傳
                    </button>
                  </div>
                ) : loaFileName ? (
                  /* File selected, ready to verify */
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-600/60 space-y-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <p className="text-sm text-white truncate flex-1">{loaFileName}</p>
                      <button onClick={() => setLoaFileName('')} className="text-slate-500 hover:text-rose-400 transition-colors flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setLoaComplianceStatus('checking');
                        setTimeout(() => { setLoaComplianceStatus('passed'); setLoaUploaded(true); }, 2000);
                      }}
                      className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                      開始驗證合規性
                    </button>
                  </div>
                ) : (
                  /* Upload idle */
                  <label className="block cursor-pointer">
                    <div className="p-8 rounded-2xl border-2 border-dashed border-slate-600/60 hover:border-slate-500 bg-slate-800/20 hover:bg-slate-800/40 transition-all flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-slate-700/50 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">點擊上傳或拖曳檔案至此</p>
                        <p className="text-xs text-slate-500 mt-1">PDF、JPG、PNG・最大 10MB</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) setLoaFileName(f.name);
                        e.target.value = '';
                      }}
                    />
                  </label>
                )}
              </div>

              {/* ── Trademark (optional) ── */}
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">商標 / 版權資料（選填）</p>
                <div
                  onClick={() => setTrademarkProvided(!trademarkProvided)}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all',
                    trademarkProvided
                      ? 'border-emerald-500 bg-emerald-950/30'
                      : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', trademarkProvided ? 'bg-emerald-500/20' : 'bg-slate-700/50')}>
                    <FileText className={cn('w-5 h-5', trademarkProvided ? 'text-emerald-400' : 'text-slate-500')} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">商標或版權文件</p>
                    <p className="text-xs text-slate-400 mt-0.5">有助於強化申訴效力（非必填）</p>
                  </div>
                  {trademarkProvided ? <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" /> : <Plus className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                </div>
              </div>

              <p className="text-xs text-slate-600 text-center">Demo 模式・檔案不會實際上傳至伺服器</p>
            </div>
          )}

          {/* Step 4: 授權同意 */}
          {step === 4 && (
            <div className="space-y-5">
              <CardHeader title="隱私與授權同意 ✅" subtitle="開始監控前請確認以下條款" />
              <div className="bg-slate-800/50 rounded-2xl p-5 space-y-3 text-sm text-slate-300 leading-relaxed border border-slate-700/50">
                <p><span className="font-bold text-white">服務範圍</span>：Watchmen Lite 會根據你設定的關鍵字，監測相關社群平台上的疑似冒名帳號。</p>
                <p><span className="font-bold text-white">資料使用</span>：監測資料僅用於提供服務，不會對外分享或販售。</p>
                <p><span className="font-bold text-white">代管服務</span>：選擇代管時，我們將以你的名義代為提交檢舉申請，需要你提供必要的授權文件。</p>
                <p><span className="font-bold text-white">Demo 說明</span>：目前為 Demo 版本，不會實際進行監控或申訴。</p>
              </div>
              <button
                onClick={() => setPrivacyConsent(!privacyConsent)}
                className={cn(
                  'w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all',
                  privacyConsent
                    ? 'border-cyan-500 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'border-slate-700 bg-slate-800/30 hover:border-slate-500'
                )}
              >
                <div className={cn('w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0', privacyConsent ? 'border-cyan-500 bg-cyan-500' : 'border-slate-600 bg-slate-800')}>
                  {privacyConsent && <Check className="w-3.5 h-3.5 text-black font-bold" />}
                </div>
                <span className={cn('font-bold', privacyConsent ? 'text-cyan-300' : 'text-slate-200')}>
                  我已閱讀並同意上述服務條款與隱私政策
                </span>
              </button>
            </div>
          )}

          {/* Step 5: 完成 */}
          {step === 5 && (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <Check className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white mb-2">設定完成！</h2>
                <p className="text-slate-300 text-lg">
                  歡迎加入，{displayName || chineseName || '使用者'}！
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  我們已記錄你的監控設定，現在可以進入儀表板查看監控狀況。
                </p>
              </div>
              <div className="bg-slate-800/60 rounded-2xl p-5 text-left space-y-2 text-sm border border-slate-700/50">
                <p className="text-slate-300"><span className="text-slate-500">監測關鍵字：</span>{keywords.length} 組</p>
                <p className="text-slate-300"><span className="text-slate-500">監測平台：</span>{platforms.join('、') || '未選擇'}</p>
                <p className="text-slate-300"><span className="text-slate-500">LOA 授權書：</span>{loaUploaded ? '已上傳 ✓' : '未上傳'}</p>
                <p className="text-slate-300"><span className="text-slate-500">商標資料：</span>{trademarkProvided ? '已提供 ✓' : '未提供'}</p>
              </div>
              <Button onClick={handleComplete} size="lg" className="w-full shadow-lg shadow-cyan-500/20">
                進入儀表板
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </Card>

        {/* Navigation */}
        {step < 5 && (
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              上一步
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {step === 4 ? '查看摘要' : '下一步'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
