import { Card } from '@/app/components/Card'

export default function About() {
  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">關於我們</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">技術棧</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>前端：</strong> Next.js 14, React 18, TypeScript</li>
              <li>• <strong>樣式：</strong> Tailwind CSS</li>
              <li>• <strong>後端：</strong> Next.js API Routes</li>
              <li>• <strong>開發工具：</strong> ESLint, PostCSS</li>
            </ul>
          </Card>
          
          <Card>
            <h2 className="text-xl font-semibold mb-4">專案特色</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• 全端 TypeScript 支援</li>
              <li>• 現代化 UI/UX 設計</li>
              <li>• 響應式佈局</li>
              <li>• 模組化組件架構</li>
              <li>• 內建 API 路由</li>
            </ul>
          </Card>
        </div>

        <Card className="mt-6">
          <h2 className="text-xl font-semibold mb-4">開始開發</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              這個專案使用 Next.js 14 的 App Router 架構，提供完整的前後端解決方案。
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">快速開始：</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>執行 <code className="bg-white px-1 rounded">npm install</code> 安裝依賴</li>
                <li>執行 <code className="bg-white px-1 rounded">npm run dev</code> 啟動開發伺服器</li>
                <li>開啟 <code className="bg-white px-1 rounded">http://localhost:3000</code> 查看應用程式</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
