import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-slate-950/30 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 hover:text-slate-400 transition-colors">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Watchmen Lite by Gogolook</span>
          </div>
          <p className="text-xs text-slate-600 text-center sm:text-right">
            此為 MVP Demo 版本。資料僅供展示用途，不代表真實監控結果。
          </p>
        </div>
      </div>
    </footer>
  );
}
