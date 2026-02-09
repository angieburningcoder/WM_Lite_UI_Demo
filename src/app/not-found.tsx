import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">找不到頁面</h1>
        <p className="text-gray-500 mb-8">
          抱歉，你要找的頁面不存在或已被移除。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button>
              <Home className="w-4 h-4" />
              返回首頁
            </Button>
          </Link>
          <Link href="/report/weekly">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4" />
              返回週報
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
