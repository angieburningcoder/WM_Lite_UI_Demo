import { UserProfile, Case, Alert, WeeklyReport, EnvironmentSignal } from './types';

// Default User Profile
export const defaultUserProfile: UserProfile = {
  displayName: '陳品安',
  monitoredKeywords: ['陳品安', 'Pin-An Chen', 'pinan_official'],
  platforms: ['Instagram', 'Facebook'],
  timezone: 'Asia/Taipei',
  notificationFrequency: 'daily',
  delegationPreference: 'delegate_when_needed',
};

// Environment Signals
export const environmentSignals: EnvironmentSignal[] = [
  {
    id: 'env-1',
    category: 'mention_trend',
    title: '品牌提及趨勢',
    description: '本週社群中提及您品牌/名稱的次數較上週增加 23%，建議留意是否有異常使用。',
    trend: 'up',
    value: '+23%',
  },
  {
    id: 'env-2',
    category: 'pattern_change',
    title: '相似冒名模式變化',
    description: '近期偵測到新的冒名手法：使用「底線+數字」組合的帳號名稱變體增加。',
    trend: 'up',
    value: '新模式',
  },
  {
    id: 'env-3',
    category: 'platform_risk',
    title: 'Instagram 風險環境',
    description: 'Instagram 平台本月偽冒帳號舉報量較上月成長 15%，平台審核時間約 3-5 個工作天。',
    trend: 'stable',
    value: '中等風險',
  },
];

// Cases Data (12 cases with H/M/L distribution)
export const cases: Case[] = [
  {
    id: 'case-001',
    platform: 'Instagram',
    suspectedAccountName: 'pinan_0fficial',
    suspectedDisplayName: '陳品安｜官方',
    suspectedUrl: 'https://instagram.com/pinan_0fficial',
    similarityScore: 94,
    followers: 2847,
    discoveredAt: '2024-01-15T09:23:00+08:00',
    riskLevel: 'H',
    reasons: [
      '帳號名稱與您的官方帳號相似度達 94%（使用數字 0 替代字母 o）',
      '個人簡介複製您的官方介紹文字',
      '已發布 3 則貼文，內容疑似抄襲您的原創內容',
      '帳號連結導向可疑的外部網站',
    ],
    statusTimeline: [
      { status: 'detected', label: '偵測發現', timestamp: '2024-01-15T09:23:00+08:00', completed: true },
      { status: 'evidence_prepared', label: '證據整理完成', timestamp: '2024-01-15T09:45:00+08:00', completed: true },
      { status: 'action_suggested', label: '建議行動', timestamp: '2024-01-15T10:00:00+08:00', completed: true },
      { status: 'handled', label: '處理完成', timestamp: '', completed: false },
    ],
    recommendedActions: [
      {
        type: 'self',
        steps: [
          '前往 Instagram 檢舉頁面，選擇「冒充他人」類別',
          '上傳您的身份證明文件（如官方帳號截圖、商業登記證明）',
          '填寫說明，附上我們整理的證據摘要',
        ],
      },
      {
        type: 'delegate',
        steps: [
          '我們將代為提交完整的檢舉申請',
          '追蹤平台處理進度',
          '若需要補充資料，我們會即時通知您',
        ],
        sla: '預計 1-2 個工作天內完成提交',
        requiredInfo: ['您的官方帳號連結', '授權同意書（線上簽署）'],
      },
    ],
    evidence: {
      snapshots: [
        { id: 'snap-1', type: 'profile', url: '/mock/profile-1.png', capturedAt: '2024-01-15T09:23:00+08:00', description: '疑似帳號的個人檔案頁面截圖' },
        { id: 'snap-2', type: 'bio', url: '/mock/bio-1.png', capturedAt: '2024-01-15T09:23:00+08:00', description: '個人簡介內容截圖，顯示與您相似的文案' },
        { id: 'snap-3', type: 'post', url: '/mock/post-1.png', capturedAt: '2024-01-15T09:25:00+08:00', description: '疑似抄襲的貼文內容' },
      ],
      checklist: [
        { id: 'chk-1', item: '帳號名稱相似度', detected: true, detail: '使用數字 0 替代字母 o，相似度 94%' },
        { id: 'chk-2', item: '頭像相似', detected: true, detail: '使用與您相同的頭像圖片' },
        { id: 'chk-3', item: '個人簡介抄襲', detected: true, detail: '複製您的官方介紹文字' },
        { id: 'chk-4', item: '可疑外部連結', detected: true, detail: '連結導向未知的第三方網站' },
        { id: 'chk-5', item: '粉絲異常增長', detected: false, detail: '粉絲數量目前屬於正常範圍' },
      ],
      reportTextBlock: `檢舉說明：

本人 陳品安 為 Instagram 官方帳號 @pinan_official 之持有人。

發現疑似冒充帳號：@pinan_0fficial
- 帳號使用數字「0」替代字母「o」，與本人官方帳號高度相似
- 頭像直接使用本人照片
- 個人簡介抄襲本人官方介紹
- 帳號連結導向可疑第三方網站

此帳號明顯意圖冒充本人身份，可能對本人粉絲造成混淆或詐騙風險。

懇請平台儘速審核並移除該冒充帳號。

附件：官方帳號證明、帳號比對截圖、相似度分析報告`,
    },
  },
  {
    id: 'case-002',
    platform: 'Facebook',
    suspectedAccountName: '陳品安工作室',
    suspectedDisplayName: '陳品安工作室 - 官方粉專',
    suspectedUrl: 'https://facebook.com/pinan.studio.fake',
    similarityScore: 87,
    followers: 1523,
    discoveredAt: '2024-01-14T14:30:00+08:00',
    riskLevel: 'H',
    reasons: [
      '粉專名稱使用您的真名，並加上「工作室」誤導為官方',
      '發布內容聲稱代理您的商業合作',
      '私訊回覆中要求匯款至個人帳戶',
      '已有用戶回報遭到詐騙',
    ],
    statusTimeline: [
      { status: 'detected', label: '偵測發現', timestamp: '2024-01-14T14:30:00+08:00', completed: true },
      { status: 'evidence_prepared', label: '證據整理完成', timestamp: '2024-01-14T15:00:00+08:00', completed: true },
      { status: 'action_suggested', label: '建議行動', timestamp: '2024-01-14T15:30:00+08:00', completed: true },
      { status: 'handled', label: '處理完成', timestamp: '', completed: false },
    ],
    recommendedActions: [
      {
        type: 'self',
        steps: [
          '前往 Facebook 檢舉頁面，選擇「假冒」類別',
          '提供您的身份證明',
          '附上受害者回報的對話截圖',
        ],
      },
      {
        type: 'delegate',
        steps: [
          '我們將協助整理完整證據包',
          '代為提交緊急檢舉',
          '必要時協助通報相關單位',
        ],
        sla: '高風險案件優先處理，24 小時內完成提交',
        requiredInfo: ['您的官方粉專連結', '身份證明文件', '授權同意書'],
      },
    ],
    evidence: {
      snapshots: [
        { id: 'snap-4', type: 'profile', url: '/mock/fb-profile-1.png', capturedAt: '2024-01-14T14:30:00+08:00', description: '疑似粉專的封面與頭像' },
        { id: 'snap-5', type: 'post', url: '/mock/fb-post-1.png', capturedAt: '2024-01-14T14:35:00+08:00', description: '聲稱代理商業合作的貼文' },
      ],
      checklist: [
        { id: 'chk-6', item: '名稱冒用', detected: true, detail: '使用您的真名建立粉專' },
        { id: 'chk-7', item: '商業詐騙跡象', detected: true, detail: '要求匯款至個人帳戶' },
        { id: 'chk-8', item: '受害者回報', detected: true, detail: '已收到用戶詐騙回報' },
        { id: 'chk-9', item: '官方標記缺失', detected: true, detail: '無任何官方認證標記' },
      ],
      reportTextBlock: `緊急檢舉 - 詐騙粉專

檢舉對象：「陳品安工作室 - 官方粉專」
粉專連結：facebook.com/pinan.studio.fake

此粉專冒用本人「陳品安」名義：
1. 聲稱為本人官方工作室
2. 以商業合作名義要求匯款
3. 已有用戶回報遭詐騙

本人從未授權成立任何「工作室」粉專，此為詐騙行為。
請緊急處理以防止更多用戶受害。`,
    },
  },
  {
    id: 'case-003',
    platform: 'Instagram',
    suspectedAccountName: 'pinan.life',
    suspectedDisplayName: 'Pin-An 生活日記',
    suspectedUrl: 'https://instagram.com/pinan.life',
    similarityScore: 72,
    followers: 856,
    discoveredAt: '2024-01-13T11:00:00+08:00',
    riskLevel: 'M',
    reasons: [
      '帳號名稱包含您的英文名「pinan」',
      '部分貼文轉載您的公開內容',
      '未見明顯詐騙行為，但可能造成混淆',
    ],
    statusTimeline: [
      { status: 'detected', label: '偵測發現', timestamp: '2024-01-13T11:00:00+08:00', completed: true },
      { status: 'evidence_prepared', label: '證據整理完成', timestamp: '2024-01-13T11:30:00+08:00', completed: true },
      { status: 'action_suggested', label: '建議行動', timestamp: '2024-01-13T12:00:00+08:00', completed: false },
      { status: 'handled', label: '處理完成', timestamp: '', completed: false },
    ],
    recommendedActions: [
      {
        type: 'self',
        steps: [
          '持續觀察帳號動態',
          '若發現進一步侵權行為再進行檢舉',
          '可考慮私訊要求移除轉載內容',
        ],
      },
      {
        type: 'delegate',
        steps: [
          '我們將持續監控此帳號',
          '若風險升級將立即通知您',
        ],
        sla: '列入觀察名單，每日監控',
      },
    ],
    evidence: {
      snapshots: [
        { id: 'snap-6', type: 'profile', url: '/mock/profile-2.png', capturedAt: '2024-01-13T11:00:00+08:00', description: '疑似帳號個人檔案' },
      ],
      checklist: [
        { id: 'chk-10', item: '名稱相似', detected: true, detail: '使用 pinan 作為帳號名稱一部分' },
        { id: 'chk-11', item: '內容轉載', detected: true, detail: '轉載您的公開貼文' },
        { id: 'chk-12', item: '詐騙行為', detected: false, detail: '目前未發現詐騙跡象' },
      ],
      reportTextBlock: `觀察中帳號回報

帳號：@pinan.life
目前狀態：中度風險，持續觀察中

發現問題：
- 帳號名稱使用「pinan」關鍵字
- 有轉載公開內容的行為

目前未達檢舉標準，建議持續監控。`,
    },
  },
  {
    id: 'case-004',
    platform: 'Instagram',
    suspectedAccountName: 'chen.pinan.tw',
    suspectedDisplayName: '品安在台灣',
    suspectedUrl: 'https://instagram.com/chen.pinan.tw',
    similarityScore: 68,
    followers: 423,
    discoveredAt: '2024-01-12T16:45:00+08:00',
    riskLevel: 'M',
    reasons: [
      '帳號名稱組合包含您的姓名拼音',
      '帳號內容主題與您無直接關聯',
      '可能為同名者，但需持續觀察',
    ],
    statusTimeline: [
      { status: 'detected', label: '偵測發現', timestamp: '2024-01-12T16:45:00+08:00', completed: true },
      { status: 'evidence_prepared', label: '證據整理完成', timestamp: '2024-01-12T17:00:00+08:00', completed: true },
      { status: 'action_suggested', label: '建議行動', timestamp: '', completed: false },
      { status: 'handled', label: '處理完成', timestamp: '', completed: false },
    ],
    recommendedActions: [
      {
        type: 'self',
        steps: [
          '目前無需行動',
          '若發現冒用您身份的跡象再處理',
        ],
      },
    ],
    evidence: {
      snapshots: [],
      checklist: [
        { id: 'chk-13', item: '名稱包含關鍵字', detected: true, detail: '包含 pinan 拼音' },
        { id: 'chk-14', item: '冒充行為', detected: false, detail: '未發現冒充跡象' },
      ],
      reportTextBlock: '此帳號目前判定為低風險，可能為同名者，持續觀察中。',
    },
  },
  {
    id: 'case-005',
    platform: 'Facebook',
    suspectedAccountName: 'pinan.fans',
    suspectedDisplayName: '陳品安粉絲團',
    suspectedUrl: 'https://facebook.com/pinan.fans.unofficial',
    similarityScore: 78,
    followers: 2100,
    discoveredAt: '2024-01-11T09:15:00+08:00',
    riskLevel: 'M',
    reasons: [
      '以「粉絲團」名義建立，但未標明非官方',
      '轉載您的公開內容並加上自己的評論',
      '未見詐騙行為，但可能讓用戶誤認為官方管道',
    ],
    statusTimeline: [
      { status: 'detected', label: '偵測發現', timestamp: '2024-01-11T09:15:00+08:00', completed: true },
      { status: 'evidence_prepared', label: '證據整理完成', timestamp: '2024-01-11T10:00:00+08:00', completed: true },
      { status: 'action_suggested', label: '建議行動', timestamp: '2024-01-11T10:30:00+08:00', completed: true },
      { status: 'handled', label: '處理完成', timestamp: '', completed: false },
    ],
    recommendedActions: [
      {
        type: 'self',
        steps: [
          '可私訊要求加上「非官方」標示',
          '若對方不配合再考慮檢舉',
        ],
      },
      {
        type: 'delegate',
        steps: [
          '我們可代為發送正式通知函',
          '要求對方明確標示非官方身份',
        ],
        sla: '3 個工作天內完成溝通',
      },
    ],
    evidence: {
      snapshots: [
        { id: 'snap-7', type: 'profile', url: '/mock/fb-profile-2.png', capturedAt: '2024-01-11T09:15:00+08:00', description: '粉絲團首頁' },
      ],
      checklist: [
        { id: 'chk-15', item: '使用您的名稱', detected: true, detail: '粉專名稱包含您的姓名' },
        { id: 'chk-16', item: '未標明非官方', detected: true, detail: '缺少非官方聲明' },
        { id: 'chk-17', item: '轉載內容', detected: true, detail: '轉載您的公開貼文' },
      ],
      reportTextBlock: `建議通知函內容：

您好，

本人 陳品安 注意到您經營的「陳品安粉絲團」粉絲專頁。

感謝您對本人的支持，但為避免其他用戶誤認為官方管道，
懇請您在粉專介紹中加入「非官方粉絲建立」等說明文字。

如有任何問題，歡迎與本人官方帳號聯繫。

謝謝您的配合。`,
    },
  },
  {
    id: 'case-006',
    platform: 'Instagram',
    suspectedAccountName: 'pinanchen_backup',
    suspectedDisplayName: '品安備用',
    suspectedUrl: 'https://instagram.com/pinanchen_backup',
    similarityScore: 91,
    followers: 156,
    discoveredAt: '2024-01-10T20:30:00+08:00',
    riskLevel: 'H',
    reasons: [
      '以「備用帳號」名義建立，暗示與您有關',
      '頭像使用您的照片',
      '已開始向粉絲發送私訊',
      '私訊內容尚待確認是否涉及詐騙',
    ],
    statusTimeline: [
      { status: 'detected', label: '偵測發現', timestamp: '2024-01-10T20:30:00+08:00', completed: true },
      { status: 'evidence_prepared', label: '證據整理完成', timestamp: '2024-01-10T21:00:00+08:00', completed: true },
      { status: 'action_suggested', label: '建議行動', timestamp: '2024-01-10T21:30:00+08:00', completed: true },
      { status: 'handled', label: '處理完成', timestamp: '', completed: false },
    ],
    recommendedActions: [
      {
        type: 'delegate',
        steps: [
          '建議優先由我們處理',
          '立即提交檢舉並追蹤',
          '同時在您的官方帳號發布警告聲明',
        ],
        sla: '24 小時內完成檢舉提交',
        requiredInfo: ['確認非您建立的帳號', '授權聲明'],
      },
    ],
    evidence: {
      snapshots: [
        { id: 'snap-8', type: 'profile', url: '/mock/profile-3.png', capturedAt: '2024-01-10T20:30:00+08:00', description: '疑似備用帳號檔案' },
      ],
      checklist: [
        { id: 'chk-18', item: '聲稱備用帳號', detected: true, detail: '帳號名稱暗示為您的備用' },
        { id: 'chk-19', item: '使用您的照片', detected: true, detail: '頭像盜用您的照片' },
        { id: 'chk-20', item: '主動私訊粉絲', detected: true, detail: '已開始發送私訊' },
      ],
      reportTextBlock: `緊急檢舉 - 備用帳號冒充

帳號：@pinanchen_backup
該帳號聲稱為本人「備用帳號」，但本人從未建立任何備用帳號。

危險跡象：
- 使用本人照片作為頭像
- 主動向本人粉絲發送私訊
- 意圖明顯為冒充詐騙

請緊急處理此冒充帳號。`,
    },
  },
  {
    id: 'case-007',
    platform: 'TikTok',
    suspectedAccountName: 'pinan_official_tw',
    suspectedDisplayName: '陳品安官方TikTok',
    suspectedUrl: 'https://tiktok.com/@pinan_official_tw',
    similarityScore: 85,
    followers: 3200,
    discoveredAt: '2024-01-09T15:00:00+08:00',
    riskLevel: 'M',
    reasons: [
      '使用「official」官方字樣',
      '影片內容轉載自您的其他平台',
      '尚未發現詐騙行為',
    ],
    statusTimeline: [
      { status: 'detected', label: '偵測發現', timestamp: '2024-01-09T15:00:00+08:00', completed: true },
      { status: 'evidence_prepared', label: '證據整理完成', timestamp: '2024-01-09T16:00:00+08:00', completed: true },
      { status: 'action_suggested', label: '建議行動', timestamp: '', completed: false },
      { status: 'handled', label: '處理完成', timestamp: '', completed: false },
    ],
    recommendedActions: [
      {
        type: 'self',
        steps: [
          '確認您是否有計畫經營 TikTok',
          '若否，可進行版權申訴',
        ],
      },
    ],
    evidence: {
      snapshots: [],
      checklist: [
        { id: 'chk-21', item: '使用 official 字樣', detected: true, detail: '帳號名稱包含 official' },
        { id: 'chk-22', item: '轉載內容', detected: true, detail: '影片轉載自其他平台' },
      ],
      reportTextBlock: '此帳號使用 official 字樣，建議確認您的 TikTok 經營計畫後再決定處理方式。',
    },
  },
  {
    id: 'case-008',
    platform: 'Instagram',
    suspectedAccountName: 'pinan_daily',
    suspectedDisplayName: '品安日常',
    suspectedUrl: 'https://instagram.com/pinan_daily',
    similarityScore: 65,
    followers: 289,
    discoveredAt: '2024-01-08T10:20:00+08:00',
    riskLevel: 'L',
    reasons: [
      '帳號名稱包含「pinan」關鍵字',
      '內容與您無直接關聯',
      '可能為巧合命名',
    ],
    statusTimeline: [
      { status: 'detected', label: '偵測發現', timestamp: '2024-01-08T10:20:00+08:00', completed: true },
      { status: 'monitoring', label: '持續監控', timestamp: '2024-01-08T10:30:00+08:00', completed: true },
    ],
    recommendedActions: [
      {
        type: 'self',
        steps: ['目前無需行動，我們將持續監控'],
      },
    ],
    evidence: {
      snapshots: [],
      checklist: [
        { id: 'chk-23', item: '名稱包含關鍵字', detected: true, detail: '包含 pinan' },
        { id: 'chk-24', item: '與您相關', detected: false, detail: '內容無關' },
      ],
      reportTextBlock: '低風險帳號，持續觀察中。',
    },
  },
  {
    id: 'case-009',
    platform: 'Facebook',
    suspectedAccountName: 'real.pinan',
    suspectedDisplayName: 'Real 品安',
    suspectedUrl: 'https://facebook.com/real.pinan',
    similarityScore: 75,
    followers: 178,
    discoveredAt: '2024-01-07T18:45:00+08:00',
    riskLevel: 'L',
    reasons: [
      '使用「Real」字樣暗示真實性',
      '帳號建立時間較短',
      '目前活動量低',
    ],
    statusTimeline: [
      { status: 'detected', label: '偵測發現', timestamp: '2024-01-07T18:45:00+08:00', completed: true },
      { status: 'monitoring', label: '持續監控', timestamp: '2024-01-07T19:00:00+08:00', completed: true },
    ],
    recommendedActions: [
      {
        type: 'self',
        steps: ['列入觀察名單'],
      },
    ],
    evidence: {
      snapshots: [],
      checklist: [
        { id: 'chk-25', item: '使用 Real 字樣', detected: true, detail: '帳號名稱包含 Real' },
      ],
      reportTextBlock: '低風險，持續監控中。',
    },
  },
  {
    id: 'case-010',
    platform: 'Instagram',
    suspectedAccountName: 'pinan.beauty',
    suspectedDisplayName: '品安美妝',
    suspectedUrl: 'https://instagram.com/pinan.beauty',
    similarityScore: 62,
    followers: 1205,
    discoveredAt: '2024-01-06T14:00:00+08:00',
    riskLevel: 'L',
    reasons: [
      '名稱包含 pinan 但加上不同主題',
      '經營美妝內容，與您的領域不同',
      '可能為巧合或不同的品牌',
    ],
    statusTimeline: [
      { status: 'detected', label: '偵測發現', timestamp: '2024-01-06T14:00:00+08:00', completed: true },
      { status: 'monitoring', label: '持續監控', timestamp: '2024-01-06T14:15:00+08:00', completed: true },
    ],
    recommendedActions: [
      {
        type: 'self',
        steps: ['無需處理，非冒充風險'],
      },
    ],
    evidence: {
      snapshots: [],
      checklist: [
        { id: 'chk-26', item: '名稱包含關鍵字', detected: true, detail: '包含 pinan' },
        { id: 'chk-27', item: '不同領域', detected: true, detail: '美妝領域' },
      ],
      reportTextBlock: '判定為非冒充帳號，但列入監控清單。',
    },
  },
  {
    id: 'case-011',
    platform: 'Twitter',
    suspectedAccountName: 'pinan_tw',
    suspectedDisplayName: 'PinAn Taiwan',
    suspectedUrl: 'https://twitter.com/pinan_tw',
    similarityScore: 70,
    followers: 542,
    discoveredAt: '2024-01-05T11:30:00+08:00',
    riskLevel: 'L',
    reasons: [
      '使用 pinan 加上地區標示',
      '帳號內容為一般推文',
      '無明顯冒充跡象',
    ],
    statusTimeline: [
      { status: 'detected', label: '偵測發現', timestamp: '2024-01-05T11:30:00+08:00', completed: true },
      { status: 'monitoring', label: '持續監控', timestamp: '2024-01-05T11:45:00+08:00', completed: true },
    ],
    recommendedActions: [
      {
        type: 'self',
        steps: ['目前無需行動'],
      },
    ],
    evidence: {
      snapshots: [],
      checklist: [
        { id: 'chk-28', item: '名稱相似', detected: true, detail: '使用 pinan_tw' },
      ],
      reportTextBlock: '低風險帳號。',
    },
  },
  {
    id: 'case-012',
    platform: 'Instagram',
    suspectedAccountName: 'chen_pinan_art',
    suspectedDisplayName: '陳品安藝術',
    suspectedUrl: 'https://instagram.com/chen_pinan_art',
    similarityScore: 58,
    followers: 89,
    discoveredAt: '2024-01-04T09:00:00+08:00',
    riskLevel: 'L',
    reasons: [
      '使用您的姓名拼音',
      '藝術創作帳號',
      '可能為同名創作者',
    ],
    statusTimeline: [
      { status: 'detected', label: '偵測發現', timestamp: '2024-01-04T09:00:00+08:00', completed: true },
      { status: 'monitoring', label: '持續監控', timestamp: '2024-01-04T09:15:00+08:00', completed: true },
    ],
    recommendedActions: [
      {
        type: 'self',
        steps: ['無需處理'],
      },
    ],
    evidence: {
      snapshots: [],
      checklist: [
        { id: 'chk-29', item: '姓名相似', detected: true, detail: '使用 chen_pinan' },
        { id: 'chk-30', item: '不同領域', detected: true, detail: '藝術創作' },
      ],
      reportTextBlock: '可能為同名創作者，非冒充風險。',
    },
  },
];

// Alerts Data
export const alerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'new_case',
    title: '發現高風險冒充帳號',
    summary: '偵測到新的高風險帳號 @pinan_0fficial，與您的官方帳號高度相似，建議優先處理。',
    riskLevel: 'H',
    createdAt: '2024-01-15T09:25:00+08:00',
    caseId: 'case-001',
    read: false,
  },
  {
    id: 'alert-002',
    type: 'new_case',
    title: '發現疑似詐騙粉專',
    summary: '「陳品安工作室」粉專已有用戶回報詐騙，需緊急處理。',
    riskLevel: 'H',
    createdAt: '2024-01-14T14:35:00+08:00',
    caseId: 'case-002',
    read: false,
  },
  {
    id: 'alert-003',
    type: 'status_update',
    title: '證據包已備妥',
    summary: '案件 #001 的證據資料已整理完成，可查看證據包。',
    riskLevel: null,
    createdAt: '2024-01-15T09:50:00+08:00',
    caseId: 'case-001',
    read: true,
  },
  {
    id: 'alert-004',
    type: 'environment_change',
    title: '品牌提及趨勢上升',
    summary: '本週社群中提及您品牌的次數較上週增加 23%，建議留意。',
    riskLevel: null,
    createdAt: '2024-01-13T10:00:00+08:00',
    read: true,
  },
  {
    id: 'alert-005',
    type: 'new_case',
    title: '發現備用帳號冒充',
    summary: '帳號 @pinanchen_backup 聲稱為您的備用帳號，已開始私訊粉絲。',
    riskLevel: 'H',
    createdAt: '2024-01-10T20:35:00+08:00',
    caseId: 'case-006',
    read: true,
  },
  {
    id: 'alert-006',
    type: 'new_case',
    title: '偵測到中風險帳號',
    summary: '@pinan.life 轉載您的公開內容，建議持續觀察。',
    riskLevel: 'M',
    createdAt: '2024-01-13T11:05:00+08:00',
    caseId: 'case-003',
    read: true,
  },
  {
    id: 'alert-007',
    type: 'weekly_summary',
    title: '上週監控摘要',
    summary: '上週共偵測到 5 個疑似帳號，其中 2 個為高風險。查看完整週報。',
    riskLevel: null,
    createdAt: '2024-01-08T09:00:00+08:00',
    read: true,
  },
  {
    id: 'alert-008',
    type: 'environment_change',
    title: 'Instagram 審核時間更新',
    summary: 'Instagram 平台近期審核時間約 3-5 個工作天，較上月略有延長。',
    riskLevel: null,
    createdAt: '2024-01-07T14:00:00+08:00',
    read: true,
  },
];

// Weekly Report Data
export const weeklyReport: WeeklyReport = {
  weekRange: {
    start: '2024-01-08',
    end: '2024-01-14',
  },
  totals: {
    total: 12,
    high: 3,
    medium: 4,
    low: 5,
  },
  trend: [
    { date: '01/08', count: 2 },
    { date: '01/09', count: 1 },
    { date: '01/10', count: 3 },
    { date: '01/11', count: 1 },
    { date: '01/12', count: 2 },
    { date: '01/13', count: 1 },
    { date: '01/14', count: 2 },
  ],
  environmentSignals,
  topCases: ['case-001', 'case-002', 'case-006'],
  watchHours: 168,
};

// Helper function to get case by ID
export function getCaseById(id: string): Case | undefined {
  return cases.find(c => c.id === id);
}

// Helper function to get alert by ID
export function getAlertById(id: string): Alert | undefined {
  return alerts.find(a => a.id === id);
}

// Helper function to filter cases by risk level
export function getCasesByRiskLevel(level: 'H' | 'M' | 'L' | 'all'): Case[] {
  if (level === 'all') return cases;
  return cases.filter(c => c.riskLevel === level);
}
