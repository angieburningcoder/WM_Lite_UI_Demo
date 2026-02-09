import Link from 'next/link';
import { Shield, Eye, FileCheck, AlertTriangle, Users, ChevronRight, FileText, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FeatureCard } from '@/components/ui/Card';

export default function HomePage() {
  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'De-risk 風險偵測',
      description: '全天候巡邏社群平台，自動偵測疑似冒用您身份的帳號。',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'De-fear 有人陪你',
      description: '不只告訴你有問題，更幫你處理問題。沒事時定期回報，有事時接手代管。',
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: 'Evidence Lite',
      description: '一鍵整理證據包，讓你輕鬆向平台提交檢舉，不用自己截圖整理。',
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Risk Level',
      description: '自動分級 High / Medium / Low，優先處理最緊急的威脅。',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Deterrence',
      description: '對外顯示「此身份有人保護」，讓潛在冒用者知難而退。',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Watchmen Lite
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              社群偽冒監控
              <br />
              <span className="text-blue-600">讓你不用一個人面對</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 mb-4 leading-relaxed">
              Not just de-risk, but <span className="font-semibold text-gray-800">de-fear</span>.
            </p>
            <p className="text-base text-gray-500 mb-8">
              你不是沒用，是沒有人幫你。現在有人在。
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/report/weekly">
                <Button size="lg" className="w-full sm:w-auto">
                  <FileText className="w-5 h-5" />
                  看本週監控週報
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/alerts">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Bell className="w-5 h-5" />
                  看即時通知
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30" />
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              核心價值
            </h2>
            <p className="text-gray-600">
              從偵測、分析、到處理，全程有人陪你
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* De-fear Message Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-center text-white shadow-xl">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                有人在守護你
              </h2>
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                沒事時，我們會定期回報環境變化。
                <br />
                有事時，我們會幫你整理證據、接手處理。
              </p>
              <p className="text-blue-200 text-sm">
                「你負責安心，我們負責盯守。」
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/email/weekly"
              className="group p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                Email 週報預覽
              </h3>
              <p className="text-sm text-gray-500">
                查看寄給你的週報 Email 長什麼樣子
              </p>
            </Link>

            <Link
              href="/settings"
              className="group p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                監控設定
              </h3>
              <p className="text-sm text-gray-500">
                自訂監測關鍵字、平台、通知頻率
              </p>
            </Link>

            <Link
              href="/styleguide"
              className="group p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                Style Guide
              </h3>
              <p className="text-sm text-gray-500">
                查看設計規範與元件樣式
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
