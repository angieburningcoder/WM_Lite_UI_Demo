import Link from 'next/link';
import { Shield, Eye, FileCheck, AlertTriangle, Users, ChevronRight, LayoutDashboard, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FeatureCard } from '@/components/ui/Card';
import { StarField } from '@/components/ui/StarField';
import { Planet } from '@/components/ui/Planet';

export default function HomePage() {
  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'De-risk 風險偵測',
      description: '全天候巡邏社群平台，自動偵測疑似冒用您身份的帳號。',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'De-fear 有人陪你',
      description: '不只告訴你有問題，更幫你處理問題。沒事時定期回報，有事時接手代管。',
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: 'Evidence Lite',
      description: '一鍵整理證據包，讓你輕鬆向平台提交檢舉，不用自己截圖整理。',
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: 'Risk Level',
      description: '自動分級 High/Medium/Low，優先處理最緊急的威脅。',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Deterrence',
      description: '對外顯示「此身份有人保護」，讓潛在冒用者知難而退。',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden font-sans selection:bg-cyan-500/30 text-white">
      <StarField />

      {/* Background Planets */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[5%] opacity-40 animate-float" style={{ animationDuration: '20s' }}>
          <Planet size="xl" color="purple" hasRing />
        </div>
        <div className="absolute top-[60%] left-[5%] opacity-30 animate-float" style={{ animationDuration: '25s', animationDelay: '2s' }}>
          <Planet size="lg" color="cyan" />
        </div>
        <div className="absolute bottom-[10%] right-[20%] opacity-20 animate-float" style={{ animationDuration: '30s', animationDelay: '5s' }}>
          <Planet size="md" color="pink" hasRing />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 sm:py-40 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-800/80 backdrop-blur-md text-cyan-300 text-lg font-bold mb-10 shadow-[0_0_20px_rgba(34,211,238,0.3)] border-2 border-cyan-400/30 animate-float">
              <Shield className="w-6 h-6 text-yellow-300 animate-pulse" />
              <span className="tracking-wide uppercase">Watchmen Lite</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-8 animate-fade-in drop-shadow-2xl" style={{ animationDelay: '0.1s' }}>
              社群偽冒監控
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 animate-pulse drop-shadow-lg">讓你不用一個人面對</span>
            </h1>

            {/* Subheading */}
            <p className="text-2xl sm:text-3xl text-slate-100 mb-10 leading-relaxed font-bold animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Not just de-risk, but <span className="text-4xl text-yellow-300 glow-text inline-block hover:scale-110 transition-transform cursor-default">de-fear</span>.
            </p>
            <p className="text-xl text-slate-200 mb-12 max-w-3xl mx-auto animate-fade-in font-medium leading-relaxed" style={{ animationDelay: '0.3s' }}>
              你不需要獨自面對，因為現在有人在。我們隨時守護你的數位身份。
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto text-xl px-12 py-6 shadow-cyan-500/20 shadow-xl hover:-translate-y-2">
                  <LayoutDashboard className="w-7 h-7" />
                  進入監控系統
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-xl px-12 py-6 hover:-translate-y-2">
                  <Shield className="w-7 h-7" />
                  開始設定帳戶
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10 bg-slate-900/30 backdrop-blur-sm border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-6xl font-extrabold text-white mb-8 tracking-tight drop-shadow-md">
              核心價值
            </h2>
            <div className="h-2 w-32 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full mb-8"></div>
            <p className="text-slate-200 text-2xl font-medium">
              從偵測、分析、到處理，全程有人陪你
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="animate-fade-in hover:z-10" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* De-fear Message Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl p-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
            <div className="bg-slate-900 rounded-[22px] p-8 sm:p-16 text-center text-white relative overflow-hidden h-full">
              {/* Decorative elements */}
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]" />

              <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20">
                  <Shield className="w-12 h-12 text-cyan-400" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  有人在守護你
                </h2>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed font-light">
                  沒事時，我們會定期回報環境變化。
                  <br />
                  <span className="text-white font-medium">有事時，我們會幫你整理證據、接手處理。</span>
                </p>
                <p className="text-cyan-400 text-base font-semibold tracking-wider uppercase border-t border-slate-800 pt-6 px-10">
                  「你負責安心，我們負責盯守。」
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/email/weekly"
              className="group p-8 bg-slate-900/50 backdrop-blur-md rounded-[32px] border-2 border-slate-700 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 hover:-translate-y-2"
            >
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-4">
                Email 週報預覽
              </h3>
              <p className="text-slate-200 text-lg group-hover:text-white transition-colors">
                查看寄給你的週報 Email 長什麼樣子
              </p>
            </Link>

            <Link
              href="/settings"
              className="group p-8 bg-slate-900/50 backdrop-blur-md rounded-[32px] border-2 border-slate-700 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(192,132,252,0.2)] transition-all duration-300 hover:-translate-y-2"
            >
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-4">
                監控設定
              </h3>
              <p className="text-slate-200 text-lg group-hover:text-white transition-colors">
                調整你的監控關鍵字與通知頻率
              </p>
            </Link>

            <Link
              href="/cases"
              className="group p-8 bg-slate-900/50 backdrop-blur-md rounded-[32px] border-2 border-slate-700 hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <FolderOpen className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  案件追蹤
                </h3>
              </div>
              <p className="text-slate-200 text-lg group-hover:text-white transition-colors">
                查看所有偵測到的疑似偽冒帳號
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

