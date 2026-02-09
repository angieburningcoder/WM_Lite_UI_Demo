import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Watchmen Lite by Gogolook</span>
          </div>
          <p className="text-xs text-gray-400 text-center sm:text-right">
            此為 MVP Demo 版本。資料僅供展示用途，不代表真實監控結果。
          </p>
        </div>
      </div>
    </footer>
  );
}
