# Watchmen Lite

社群偽冒監控 MVP Demo - **Not just de-risk, but de-fear.**

> 你不是沒用，是沒有人幫你。現在有人在。

## 產品定位

Watchmen Lite 不只是「防偽冒工具」，而是「替你分擔恐懼的防偽冒代理人」。

- **De-risk**: 全天候巡邏偵測
- **De-fear**: 有人陪你處理與代管
- **Evidence Lite**: 證據包一鍵整理
- **Risk Level**: H/M/L 自動分級
- **Deterrence**: 對外顯示「此身份有人保護」

## 快速開始

### 安裝

```bash
npm install
```

### 開發

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看。

### 建置

```bash
npm run build
npm start
```

## 頁面路由

| 路由 | 說明 |
|------|------|
| `/` | Landing / Demo 入口頁 |
| `/report/weekly` | 週報主頁：本週監控報告 |
| `/cases/[id]` | 單一案件詳情 |
| `/evidence/[id]` | Evidence Lite 證據包 |
| `/alerts` | 即時通知列表 |
| `/alerts/[id]` | 通知詳情 |
| `/email/weekly` | Gmail 週報 Email 預覽 |
| `/settings` | 使用者設定（localStorage 模擬） |
| `/styleguide` | 設計規範與元件樣式 |

## 技術棧

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Data**: Mock JSON (無後端、無 API)

## 專案結構

```
src/
├── app/                    # App Router 頁面
│   ├── alerts/            # 通知相關頁面
│   ├── cases/             # 案件詳情頁面
│   ├── email/             # Email 預覽頁面
│   ├── evidence/          # 證據包頁面
│   ├── report/            # 週報頁面
│   ├── settings/          # 設定頁面
│   ├── styleguide/        # Style Guide 頁面
│   ├── layout.tsx         # Root Layout
│   ├── page.tsx           # Landing Page
│   └── globals.css        # Global Styles
├── components/
│   ├── cases/             # 案件相關元件
│   ├── charts/            # 圖表元件
│   ├── layout/            # 布局元件 (Header, Footer)
│   └── ui/                # UI 元件 (Button, Card, Badge...)
├── data/
│   ├── types.ts           # TypeScript 型別定義
│   └── mockData.ts        # Mock 資料
└── lib/
    ├── utils.ts           # 工具函數
    └── useSettings.ts     # Settings Hook (localStorage)
```

## 設計規範

### 色票

- **Primary**: #2563EB (Gogolook 風格科技藍)
- **High Risk**: #EF4444
- **Medium Risk**: #F59E0B
- **Low Risk**: #22C55E
- **Background**: #FAFBFC

### 字體

- Noto Sans TC (繁體中文)
- System Font Stack

### 設計關鍵字

- 日系簡約、留白、低彩度背景
- 清楚字級層級
- 卡片圓角、柔和陰影
- 手機優先 (Mobile First)

## 功能特色

### 週報頁面 (`/report/weekly`)
- 本週總覽 Summary Card
- 趨勢圖（近 7 天事件數折線圖）
- 風險環境訂閱卡
- 疑似偽冒清單（可 filter H/M/L）
- De-fear 模組（盯守時數展示）
- 支援列印 PDF

### 案件詳情 (`/cases/[id]`)
- 狀態時間線
- 風險分析說明
- 建議行動（自行處理 / 代管）
- Deterrence 威嚇標記

### 證據包 (`/evidence/[id]`)
- 基本摘要
- 證據項目列表
- 冒充指標檢核清單
- 一鍵複製檢舉材料
- 下載 HTML / 列印 PDF

### Email 預覽 (`/email/weekly`)
- Email 週報預覽
- Copy Subject / HTML / Plain Text

### 設定頁面 (`/settings`)
- 顯示名稱
- 監測關鍵字
- 平台選擇
- 通知頻率
- 代管偏好
- 資料儲存於 localStorage

## De-fear 文案設計

UI 中內建溫暖、像保全/代理人的語氣：

- 「本週我們替你盯守，讓你不用一個人面對。」
- 「這件事你不用慌，我們已經把材料整理好。」
- 「你負責安心，我們負責盯守。」
- 「有人在守護你」

## License

MIT
