# Watchmen Lite Demo — 完整程式碼整理（供 GPT Review 用）

> 請根據下方的新規格建議，幫我優化這份 Next.js demo 專案。

---

## 一、專案概述

**Watchmen Lite** 是一個身份監控服務的 Demo，主要功能：
- 幫助個人/品牌監控社群媒體上的冒名帳號（Instagram / Facebook / Threads）
- 提供風險分級（H/M/L）、證據整理（Evidence Lite）、代管申訴（Delegation）
- 主打「De-fear」體驗：讓用戶放心，不恐慌

**Tech Stack:**
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Recharts 3
- Lucide React

**完全使用 Mock Data（無後端）**，設定存在 localStorage。

---

## 二、目錄結構

```
src/
├── app/
│   ├── page.tsx                  # 首頁 Landing
│   ├── layout.tsx                # 根 Layout
│   ├── report/weekly/page.tsx    # 週報頁
│   ├── cases/[id]/page.tsx       # 案件詳情
│   ├── evidence/[id]/page.tsx    # 證據包
│   ├── alerts/page.tsx           # 通知列表
│   ├── alerts/[id]/page.tsx      # 通知詳情
│   ├── email/weekly/page.tsx     # Email 預覽
│   ├── settings/page.tsx         # 設定頁（含定價試算）
│   ├── styleguide/page.tsx       # Design System 展示
│   ├── globals.css               # 全域樣式（Dark Space Theme）
│   └── not-found.tsx
├── components/
│   ├── layout/Header.tsx
│   ├── layout/Footer.tsx
│   ├── ui/Button.tsx
│   ├── ui/Card.tsx
│   ├── ui/Badge.tsx
│   ├── ui/CopyButton.tsx
│   ├── ui/Timeline.tsx
│   ├── ui/FilterTabs.tsx
│   ├── ui/StarField.tsx
│   ├── ui/Planet.tsx
│   ├── charts/TrendChart.tsx
│   └── cases/CaseCard.tsx
├── data/
│   ├── types.ts
│   └── mockData.ts
└── lib/
    ├── utils.ts
    └── useSettings.ts
```

---

## 三、完整原始碼

### `src/data/types.ts`

```typescript
// Watchmen Lite - Type Definitions

export type RiskLevel = 'H' | 'M' | 'L';
export type Platform = 'Instagram' | 'Facebook' | 'Threads';
export type CaseStatus = 'detected' | 'evidence_prepared' | 'action_suggested' | 'handled' | 'monitoring';
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly';
export type DelegationPreference = 'self_only' | 'delegate_when_needed';

export interface UserProfile {
  displayName: string;
  chineseName: string;
  englishName: string;
  brandNames: string[];
  monitoredKeywords: string[];
  platforms: Platform[];
  timezone: string;
  notificationFrequency: NotificationFrequency;
  delegationPreference: DelegationPreference;
}

export interface StatusTimelineItem {
  status: CaseStatus;
  label: string;
  timestamp: string;
  completed: boolean;
}

export interface Evidence {
  snapshots: {
    id: string;
    type: 'profile' | 'post' | 'bio' | 'story';
    url: string;
    capturedAt: string;
    description: string;
  }[];
  checklist: {
    id: string;
    item: string;
    detected: boolean;
    detail: string;
  }[];
  reportTextBlock: string;
}

export interface Case {
  id: string;
  platform: Platform;
  suspectedAccountName: string;
  suspectedDisplayName: string;
  suspectedUrl: string;
  similarityScore: number;
  followers: number;
  discoveredAt: string;
  riskLevel: RiskLevel;
  reasons: string[];
  statusTimeline: StatusTimelineItem[];
  recommendedActions: {
    type: 'self' | 'delegate';
    steps: string[];
    sla?: string;
    requiredInfo?: string[];
  }[];
  evidence: Evidence;
}

export interface Alert {
  id: string;
  type: 'new_case' | 'status_update' | 'environment_change' | 'weekly_summary';
  title: string;
  summary: string;
  riskLevel: RiskLevel | null;
  createdAt: string;
  caseId?: string;
  read: boolean;
}

export interface EnvironmentSignal {
  id: string;
  category: 'mention_trend' | 'pattern_change' | 'platform_risk';
  title: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  value?: string;
}

export interface WeeklyReport {
  weekRange: { start: string; end: string; };
  totals: { total: number; high: number; medium: number; low: number; };
  trend: { date: string; count: number; }[];
  environmentSignals: EnvironmentSignal[];
  topCases: string[];
  watchHours: number;
}
```

---

### `src/lib/utils.ts`

```typescript
import { RiskLevel } from '@/data/types';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return '剛剛';
  if (diffMins < 60) return `${diffMins} 分鐘前`;
  if (diffHours < 24) return `${diffHours} 小時前`;
  if (diffDays < 7) return `${diffDays} 天前`;
  return formatDate(dateString);
}

export function getRiskLevelInfo(level: RiskLevel) {
  const info = {
    H: { label: '高風險', shortLabel: 'H', color: 'bg-red-50 text-red-700 border-red-200', dotColor: 'bg-red-500', description: '需要立即處理' },
    M: { label: '中風險', shortLabel: 'M', color: 'bg-amber-50 text-amber-700 border-amber-200', dotColor: 'bg-amber-500', description: '建議關注觀察' },
    L: { label: '低風險', shortLabel: 'L', color: 'bg-green-50 text-green-700 border-green-200', dotColor: 'bg-green-500', description: '持續監控中' },
  };
  return info[level];
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    Instagram: 'instagram', Facebook: 'facebook', Threads: 'at-sign',
  };
  return icons[platform] || 'globe';
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

export function formatNumber(num: number): string { return num.toLocaleString('zh-TW'); }

export function getWeekRangeString(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.getMonth() + 1}/${startDate.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

---

### `src/lib/useSettings.ts`

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile, Platform, NotificationFrequency, DelegationPreference } from '@/data/types';
import { defaultUserProfile } from '@/data/mockData';

const STORAGE_KEY = 'watchmen-lite-settings';

export function useSettings() {
  const [settings, setSettings] = useState<UserProfile>(defaultUserProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultUserProfile, ...parsed });
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    setIsLoaded(true);
  }, []);

  const saveSettings = useCallback((newSettings: Partial<UserProfile>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings]);

  const updateDisplayName = useCallback((name: string) => saveSettings({ displayName: name }), [saveSettings]);
  const updateKeywords = useCallback((keywords: string[]) => saveSettings({ monitoredKeywords: keywords }), [saveSettings]);
  const updatePlatforms = useCallback((platforms: Platform[]) => saveSettings({ platforms }), [saveSettings]);
  const updateNotificationFrequency = useCallback((frequency: NotificationFrequency) => saveSettings({ notificationFrequency: frequency }), [saveSettings]);
  const updateChineseName = useCallback((name: string) => saveSettings({ chineseName: name }), [saveSettings]);
  const updateEnglishName = useCallback((name: string) => saveSettings({ englishName: name }), [saveSettings]);
  const updateBrandNames = useCallback((brands: string[]) => saveSettings({ brandNames: brands }), [saveSettings]);
  const updateDelegationPreference = useCallback((preference: DelegationPreference) => saveSettings({ delegationPreference: preference }), [saveSettings]);
  const resetSettings = useCallback(() => {
    setSettings(defaultUserProfile);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { console.error('Failed to reset settings:', e); }
  }, []);

  return {
    settings, isLoaded, saveSettings,
    updateDisplayName, updateKeywords, updatePlatforms, updateNotificationFrequency,
    updateChineseName, updateEnglishName, updateBrandNames, updateDelegationPreference,
    resetSettings,
  };
}
```

---

### `src/app/settings/page.tsx`（含定價試算）

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, X, Check, RotateCcw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSettings } from '@/lib/useSettings';
import { Platform, NotificationFrequency, DelegationPreference } from '@/data/types';
import { cn } from '@/lib/utils';

const allPlatforms: Platform[] = ['Instagram', 'Facebook', 'Threads'];

const frequencyOptions = [
  { value: 'immediate' as NotificationFrequency, label: '立即通知', description: '有新發現立即發送通知' },
  { value: 'daily' as NotificationFrequency, label: '每日摘要', description: '每天傍晚發送當日摘要' },
  { value: 'weekly' as NotificationFrequency, label: '週報', description: '每週一發送週報' },
];

const delegationOptions = [
  { value: 'self_only' as DelegationPreference, label: '只要教學', description: '我想自己處理偽冒案件，請給我步驟指引', priceNote: '' },
  { value: 'delegate_when_needed' as DelegationPreference, label: '想要 Watchmen 幫我代管', description: '遇到複雜偽冒情況時，請直接幫我處理', priceNote: '+NT$599/月' },
];

// 定價邏輯：
// 基本月費: NT$300
// 關鍵字: +NT$99/組
// 平台: +NT$299/個
// 品牌: +NT$299/個
// 代管: +NT$599/月
// 年繳: 月費 × 10（省 2 個月）

export default function SettingsPage() {
  const { settings, isLoaded, saveSettings, updateDisplayName, updateChineseName,
    updateEnglishName, updateBrandNames, updateKeywords, updatePlatforms,
    updateNotificationFrequency, updateDelegationPreference, resetSettings } = useSettings();

  const [localName, setLocalName] = useState('');
  const [localChineseName, setLocalChineseName] = useState('');
  const [localEnglishName, setLocalEnglishName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [saved, setSaved] = useState(false);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const BASE_PRICE = 300;
  const KEYWORD_PRICE = 99;
  const PLATFORM_PRICE = 299;
  const BRAND_PRICE = 299;
  const DELEGATION_PRICE = 599;

  const keywordCount = settings.monitoredKeywords.length;
  const platformCount = settings.platforms.length;
  const brandCount = settings.brandNames.length;
  const isDelegate = settings.delegationPreference === 'delegate_when_needed';
  const delegationPrice = isDelegate ? DELEGATION_PRICE : 0;

  const monthlyPrice = BASE_PRICE + (keywordCount * KEYWORD_PRICE) + (platformCount * PLATFORM_PRICE) + (brandCount * BRAND_PRICE) + delegationPrice;
  const yearlyPrice = monthlyPrice * 10;

  useEffect(() => {
    if (isLoaded) {
      setLocalName(settings.displayName);
      setLocalChineseName(settings.chineseName);
      setLocalEnglishName(settings.englishName);
    }
  }, [isLoaded, settings.displayName, settings.chineseName, settings.englishName]);

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleSaveName = () => { updateDisplayName(localName); showSaved(); };
  const handleSaveChineseName = () => { updateChineseName(localChineseName); showSaved(); };
  const handleSaveEnglishName = () => { updateEnglishName(localEnglishName); showSaved(); };

  const handleAddBrand = () => {
    if (newBrand.trim() && !settings.brandNames.includes(newBrand.trim())) {
      updateBrandNames([...settings.brandNames, newBrand.trim()]);
      setNewBrand(''); showSaved();
    }
  };
  const handleRemoveBrand = (brand: string) => { updateBrandNames(settings.brandNames.filter(b => b !== brand)); showSaved(); };
  const handleAddKeyword = () => {
    if (newKeyword.trim() && !settings.monitoredKeywords.includes(newKeyword.trim())) {
      updateKeywords([...settings.monitoredKeywords, newKeyword.trim()]);
      setNewKeyword(''); showSaved();
    }
  };
  const handleRemoveKeyword = (keyword: string) => { updateKeywords(settings.monitoredKeywords.filter(k => k !== keyword)); showSaved(); };
  const handleTogglePlatform = (platform: Platform) => {
    if (settings.platforms.includes(platform)) updatePlatforms(settings.platforms.filter(p => p !== platform));
    else updatePlatforms([...settings.platforms, platform]);
    showSaved();
  };
  const handleFrequencyChange = (frequency: NotificationFrequency) => { updateNotificationFrequency(frequency); showSaved(); };
  const handleDelegationChange = (preference: DelegationPreference) => { updateDelegationPreference(preference); showSaved(); };
  const handleReset = () => { resetSettings(); setLocalName('陳品安'); setLocalChineseName('陳品安'); setLocalEnglishName('Pin-An Chen'); showSaved(); };

  function generateSuggestions(): string[] {
    const suggestions: string[] = [];
    const cn = settings.chineseName;
    const en = settings.englishName;
    if (cn) { suggestions.push(cn, `${cn}官方`, `${cn}客服`, `${cn}工作室`, `${cn}粉絲團`, `${cn}代言`, `${cn}合作`); }
    if (en) {
      const lower = en.toLowerCase().replace(/[\s-]+/g, '');
      suggestions.push(en, `${lower}_official`, `${lower}_tw`, `${lower}_backup`, `real_${lower}`);
    }
    settings.brandNames.forEach(brand => {
      if (brand) suggestions.push(brand, `${brand}官方`, `${brand}_official`, `${brand}_backup`);
    });
    return [...new Set(suggestions)].filter(s => !settings.monitoredKeywords.includes(s));
  }

  const handleAddSuggestion = (keyword: string) => { updateKeywords([...settings.monitoredKeywords, keyword]); showSaved(); };

  // ... JSX (省略，結構如下)
  // 1. 身份資料卡：顯示名稱、中文名、英文名、品牌名稱
  // 2. 監測關鍵字卡：tag chips + 新增 + 自動推薦
  // 3. 監測平台卡：checkbox 選擇
  // 4. 通知頻率卡：radio 選擇
  // 5. 代管偏好卡：radio 選擇
  // 6. 方案估算卡：即時計算月費/年費
  // 7. 重設卡
}
```

---

### `src/app/report/weekly/page.tsx`（週報）

```typescript
'use client';
// 週報主頁：
// - 頂部 Header（週期、用戶名）
// - De-fear 開場訊息
// - Summary Stats（total / H / M / L）
// - Priority Action Card（高風險案件緊急提示）
// - 趨勢圖（7天 Area Chart）
// - 環境風險訂閱（EnvironmentSignals）
// - 案件清單（FilterTabs + CaseList）
// - De-fear Footer（「有人在」模塊）

// 關鍵邏輯：
// - 從 mockData 讀取 weeklyReport, cases
// - useSettings() 取得用戶名稱
// - FilterTabs 控制 H/M/L 篩選
// - window.print() 支援 PDF 輸出

// 主要狀態：filter: 'all' | 'H' | 'M' | 'L'
```

---

### `src/app/cases/[id]/page.tsx`（案件詳情）

```typescript
'use client';
// 案件詳情頁：
// - 風險等級 + 平台 Badge
// - De-fear 訊息（僅高風險顯示）
// - 處理進度 Timeline（4 步驟）
// - 風險分析（reasons 列表）
// - 建議行動（自行處理 / 交給我們）
// - 側欄：帳號資訊（相似度、追蹤者、發現時間）
// - 側欄：Deterrence Badge（HTML 複製 / 聲明文案複製）
// - 側欄：緊急聯繫

// 威嚇標記 HTML:
// <div style="...background:#EFF6FF;border:1px solid #BFDBFE;">
//   <svg>shield</svg>
//   <span>此身份由 Watchmen Lite 監控保護</span>
// </div>
```

---

### `src/app/evidence/[id]/page.tsx`（證據包）

```typescript
'use client';
// 證據包頁面：
// - 基本摘要（目標身份、疑似帳號、平台、風險等級）
// - 證據項目（截圖列表）
// - 冒充指標檢核（checklist ✓/○）
// - 一鍵複製檢舉材料（reportTextBlock）
// - 下載 HTML（generateHTMLDownload()）
// - 列印 PDF（window.print()）
```

---

### `src/app/alerts/page.tsx`（通知列表）

```typescript
'use client';
// 通知列表頁：
// - 未讀數顯示
// - De-fear 說明文案
// - Alert 卡片列表：
//   - new_case → AlertTriangle (紅)
//   - status_update → RefreshCw (藍)
//   - environment_change → Info (琥珀)
//   - weekly_summary → Calendar (紫)
// - 未讀卡片有 cyan glow 效果 + 脈衝點
// - 點擊導航至 /alerts/[id]
```

---

## 四、定價邏輯摘要

```
月費 = NT$300（基本）
     + 關鍵字數量 × NT$99
     + 平台數量 × NT$299
     + 品牌名稱數量 × NT$299
     + （選擇代管 ? NT$599 : 0）

年費 = 月費 × 10（相當於省 2 個月）
```

---

## 五、資料流向

```
mockData.ts
  ├── defaultUserProfile → useSettings() → localStorage
  ├── cases[] → getCaseById() / getCasesByRiskLevel() → pages
  ├── alerts[] → AlertsPage / AlertDetailPage
  ├── weeklyReport → WeeklyReportPage
  └── environmentSignals → WeeklyReportPage (內嵌在 weeklyReport)
```

---

## 六、路由對應

| 路由 | 頁面 |
|------|------|
| `/` | Landing |
| `/report/weekly` | 週報 |
| `/cases/[id]` | 案件詳情 |
| `/evidence/[id]` | 證據包 |
| `/alerts` | 通知列表 |
| `/alerts/[id]` | 通知詳情 |
| `/email/weekly` | Email 預覽 |
| `/settings` | 設定 + 定價 |
| `/styleguide` | Design System |

---

## 七、UI 元件清單

| 元件 | 說明 |
|------|------|
| `Button` | variants: primary/secondary/outline/ghost/danger |
| `Card` / `CardHeader` / `StatCard` / `FeatureCard` | 卡片容器 |
| `RiskBadge` / `StatusBadge` / `PlatformBadge` | 狀態標籤 |
| `CopyButton` | 複製按鈕（帶回饋動畫） |
| `Timeline` | 案件狀態時間軸 |
| `FilterTabs` | 分頁篩選器 |
| `TrendChart` | Recharts Area Chart |
| `CaseCard` / `CaseList` | 案件列表卡片 |
| `StarField` | 動畫星空背景 |
| `Planet` | 裝飾星球元素 |

---

## 八、值得注意的現有問題 / 可優化點

1. **`generateSuggestions()` 在每次 render 都呼叫兩次**（JSX 中重複呼叫）
2. **`useSettings` 的 `saveSettings` 依賴 `settings` 但用 useCallback**，可能有 stale closure 問題
3. **定價常數（BASE_PRICE 等）直接寫在 page component 裡**，沒有集中管理
4. **Mock data 的 `cases[0]` 在週報頁 hardcode** 當作高風險案件展示，不夠彈性
5. **`deterrenceText` 中的帳號 `@pinan_official` 是 hardcode**，應從 settings 讀取
6. **設定頁面中 `handleReset` 的預設值（'陳品安' 等）是重複的**，應從 defaultUserProfile 讀取
7. **缺少 loading skeleton 的統一元件**，各頁面各自處理
8. **`cn()` utility 是自己寫的簡化版**，缺少 clsx/tailwind-merge 的邏輯，無法處理衝突 class

---

*以上為完整程式碼概覽。請根據你提供的新規格，針對上述架構給出具體優化建議。*
