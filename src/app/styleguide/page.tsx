import { Shield, Eye, AlertTriangle, Check, X, Plus, ArrowRight } from 'lucide-react';
import { Card, CardHeader, FeatureCard, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskBadge, PlatformBadge, StatusBadge } from '@/components/ui/Badge';
import { Timeline } from '@/components/ui/Timeline';
import { CopyButton } from '@/components/ui/CopyButton';

export default function StyleGuidePage() {
  const sampleTimeline = [
    { status: 'detected' as const, label: '偵測發現', timestamp: '2024-01-15T09:23:00+08:00', completed: true },
    { status: 'scheduled' as const, label: '已排程', timestamp: '2024-01-15T09:45:00+08:00', completed: true },
    { status: 'submitted' as const, label: '已送件', timestamp: '2024-01-15T10:00:00+08:00', completed: true },
    { status: 'resolved' as const, label: '已解決', timestamp: '', completed: false },
  ];

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Style Guide</h1>
          <p className="text-gray-500">
            Watchmen Lite 設計規範與元件樣式
          </p>
        </div>

        {/* Colors */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">色票 Colors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Primary */}
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-blue-600 shadow-sm" />
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-gray-500">#2563EB</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-blue-50 border border-gray-100" />
              <p className="text-sm font-medium">Primary Light</p>
              <p className="text-xs text-gray-500">#EFF6FF</p>
            </div>
            {/* Risk Colors */}
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-red-500 shadow-sm" />
              <p className="text-sm font-medium">High Risk</p>
              <p className="text-xs text-gray-500">#EF4444</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-amber-500 shadow-sm" />
              <p className="text-sm font-medium">Medium Risk</p>
              <p className="text-xs text-gray-500">#F59E0B</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-green-500 shadow-sm" />
              <p className="text-sm font-medium">Low Risk</p>
              <p className="text-xs text-gray-500">#22C55E</p>
            </div>
            {/* Neutrals */}
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-gray-900 shadow-sm" />
              <p className="text-sm font-medium">Gray 900</p>
              <p className="text-xs text-gray-500">#111827</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-gray-500 shadow-sm" />
              <p className="text-sm font-medium">Gray 500</p>
              <p className="text-xs text-gray-500">#6B7280</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-gray-100 border border-gray-200" />
              <p className="text-sm font-medium">Gray 100</p>
              <p className="text-xs text-gray-500">#F3F4F6</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-white border border-gray-200" />
              <p className="text-sm font-medium">White</p>
              <p className="text-xs text-gray-500">#FFFFFF</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-[#FAFBFC] border border-gray-200" />
              <p className="text-sm font-medium">Background</p>
              <p className="text-xs text-gray-500">#FAFBFC</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">字體 Typography</h2>
          <Card>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-500 mb-2">Font Family</p>
                <p className="text-lg">Noto Sans TC, system-ui, sans-serif</p>
              </div>
              <hr className="border-gray-100" />
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <h1 className="text-4xl font-bold text-gray-900">Heading 1</h1>
                  <span className="text-xs text-gray-500">text-4xl / font-bold</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-3xl font-bold text-gray-900">Heading 2</h2>
                  <span className="text-xs text-gray-500">text-3xl / font-bold</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Heading 3</h3>
                  <span className="text-xs text-gray-500">text-2xl / font-bold</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-xl font-semibold text-gray-900">Heading 4</h4>
                  <span className="text-xs text-gray-500">text-xl / font-semibold</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <h5 className="text-lg font-semibold text-gray-900">Heading 5</h5>
                  <span className="text-xs text-gray-500">text-lg / font-semibold</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-base text-gray-700">Body Text</p>
                  <span className="text-xs text-gray-500">text-base / text-gray-700</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm text-gray-600">Small Text</p>
                  <span className="text-xs text-gray-500">text-sm / text-gray-600</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs text-gray-500">Caption</p>
                  <span className="text-xs text-gray-500">text-xs / text-gray-500</span>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Buttons */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">按鈕 Buttons</h2>
          <Card>
            <div className="space-y-6">
              {/* Variants */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Variants</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Sizes</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">With Icons</p>
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <Plus className="w-4 h-4" />
                    新增
                  </Button>
                  <Button variant="outline">
                    查看詳情
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <CopyButton text="複製文字" label="複製" />
                </div>
              </div>

              {/* States */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">States</p>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled</Button>
                  <Button isLoading>Loading</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Badges */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">標籤 Badges</h2>
          <Card>
            <div className="space-y-6">
              {/* Risk Badges */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Risk Level</p>
                <div className="flex flex-wrap gap-3">
                  <RiskBadge level="H" />
                  <RiskBadge level="M" />
                  <RiskBadge level="L" />
                </div>
              </div>

              {/* Risk Badges - Short */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Risk Level (Short)</p>
                <div className="flex flex-wrap gap-3">
                  <RiskBadge level="H" showLabel={false} />
                  <RiskBadge level="M" showLabel={false} />
                  <RiskBadge level="L" showLabel={false} />
                </div>
              </div>

              {/* Platform Badges */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Platform</p>
                <div className="flex flex-wrap gap-3">
                  <PlatformBadge platform="Instagram" />
                  <PlatformBadge platform="Facebook" />
                  <PlatformBadge platform="Threads" />
                </div>
              </div>

              {/* Status Badges */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Status</p>
                <div className="flex flex-wrap gap-3">
                  <StatusBadge status="detected" />
                  <StatusBadge status="scheduled" />
                  <StatusBadge status="submitted" />
                  <StatusBadge status="resolved" />
                  <StatusBadge status="monitoring" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">卡片 Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader title="基本卡片" subtitle="這是副標題" />
              <p className="text-gray-600">卡片內容區域</p>
            </Card>

            <Card hover>
              <CardHeader title="可點擊卡片" subtitle="hover 有效果" />
              <p className="text-gray-600">滑鼠移上來試試</p>
            </Card>

            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Feature Card"
              description="功能說明卡片，適合展示產品特色"
            />

            <StatCard
              label="統計數字"
              value={42}
              subtext="+12% 較上週"
              trend="up"
              icon={<Eye className="w-5 h-5" />}
            />

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
              <p className="text-blue-800">
                <span className="font-semibold">提示卡片</span>
                <br />
                用於重要提示訊息
              </p>
            </Card>

            <Card className="bg-red-50 border-red-100">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">警告卡片</p>
                  <p className="text-sm text-red-600">用於警告訊息</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Lists */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">列表 Lists</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="簡單列表" />
              <ul className="space-y-3">
                {['項目一', '項目二', '項目三'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardHeader title="時間軸" />
              <Timeline items={sampleTimeline} />
            </Card>
          </div>
        </section>

        {/* Spacing */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">間距 Spacing</h2>
          <Card>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">主要間距單位：4px (0.25rem)</p>
              <div className="flex flex-wrap items-end gap-4">
                {[2, 3, 4, 5, 6, 8, 10, 12, 16].map((size) => (
                  <div key={size} className="text-center">
                    <div
                      className="bg-blue-500 rounded"
                      style={{ width: size * 4, height: size * 4 }}
                    />
                    <p className="text-xs text-gray-500 mt-2">{size * 4}px</p>
                    <p className="text-xs text-gray-400">gap-{size}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Border Radius */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">圓角 Border Radius</h2>
          <Card>
            <div className="flex flex-wrap gap-6">
              {[
                { class: 'rounded', label: 'rounded', px: '4px' },
                { class: 'rounded-md', label: 'rounded-md', px: '6px' },
                { class: 'rounded-lg', label: 'rounded-lg', px: '8px' },
                { class: 'rounded-xl', label: 'rounded-xl', px: '12px' },
                { class: 'rounded-2xl', label: 'rounded-2xl', px: '16px' },
                { class: 'rounded-full', label: 'rounded-full', px: '9999px' },
              ].map((item) => (
                <div key={item.class} className="text-center">
                  <div className={`w-16 h-16 bg-blue-500 ${item.class}`} />
                  <p className="text-xs text-gray-500 mt-2">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.px}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Icons */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">圖示 Icons</h2>
          <Card>
            <p className="text-sm text-gray-500 mb-4">使用 Lucide React 圖示庫</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
              {[
                { icon: <Shield className="w-6 h-6" />, name: 'Shield' },
                { icon: <Eye className="w-6 h-6" />, name: 'Eye' },
                { icon: <AlertTriangle className="w-6 h-6" />, name: 'AlertTriangle' },
                { icon: <Check className="w-6 h-6" />, name: 'Check' },
                { icon: <X className="w-6 h-6" />, name: 'X' },
                { icon: <Plus className="w-6 h-6" />, name: 'Plus' },
                { icon: <ArrowRight className="w-6 h-6" />, name: 'ArrowRight' },
              ].map((item) => (
                <div key={item.name} className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50">
                  <div className="text-gray-600">{item.icon}</div>
                  <span className="text-xs text-gray-500">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
