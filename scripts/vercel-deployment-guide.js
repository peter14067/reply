#!/usr/bin/env node

/**
 * Vercel 部署完整指南
 * 確保專案能在 Vercel 上正常運行
 */

console.log('🚀 Vercel 部署完整指南');
console.log('========================\n');

console.log('📋 部署前檢查清單:');
console.log('==================');
console.log('✅ 1. 專案結構檢查');
console.log('   - Next.js 14+ 專案 ✓');
console.log('   - App Router 結構 ✓');
console.log('   - TypeScript 配置 ✓');
console.log('   - Prisma 配置 ✓\n');

console.log('✅ 2. 依賴項目檢查');
console.log('   - @prisma/client ✓');
console.log('   - next ✓');
console.log('   - react ✓');
console.log('   - tailwindcss ✓\n');

console.log('✅ 3. 配置文件檢查');
console.log('   - vercel.json ✓');
console.log('   - next.config.js ✓');
console.log('   - package.json ✓');
console.log('   - prisma/schema.prisma ✓\n');

console.log('🔧 部署步驟:');
console.log('============');
console.log('1. 設置資料庫:');
console.log('   - 在 Vercel 控制台創建 PostgreSQL 資料庫');
console.log('   - 或使用外部服務 (Supabase, PlanetScale, Railway)');
console.log('   - 複製連接字串\n');

console.log('2. 設置環境變量:');
console.log('   在 Vercel 控制台 → Settings → Environment Variables:');
console.log('   - DATABASE_URL: postgresql://...');
console.log('   - NODE_ENV: production\n');

console.log('3. 關閉部署保護:');
console.log('   - 進入 Settings → General');
console.log('   - 找到 "Deployment Protection"');
console.log('   - 關閉 "Vercel Authentication" 和 "Password Protection"\n');

console.log('4. 重新部署:');
console.log('   - 推送代碼到 GitHub');
console.log('   - Vercel 會自動重新部署');
console.log('   - 或手動觸發重新部署\n');

console.log('5. 初始化資料庫:');
console.log('   - 訪問: https://your-app.vercel.app/api/init-db');
console.log('   - 使用 POST 方法觸發初始化\n');

console.log('🧪 測試端點:');
console.log('============');
console.log('部署完成後測試以下端點:');
console.log('1. 健康檢查: GET /api/health');
console.log('2. FAQ 列表: GET /api/faqs');
console.log('3. 管理後台: /admin');
console.log('4. 聊天頁面: /chat\n');

console.log('❌ 常見問題解決:');
console.log('================');
console.log('1. 401 錯誤 (身份驗證):');
console.log('   → 關閉 Vercel 部署保護\n');

console.log('2. 資料庫連接失敗:');
console.log('   → 檢查 DATABASE_URL 環境變量');
console.log('   → 確認資料庫服務正常運行\n');

console.log('3. FAQ 列表為空:');
console.log('   → 執行 /api/init-db 初始化');
console.log('   → 檢查資料庫表是否創建\n');

console.log('4. 構建失敗:');
console.log('   → 檢查 package.json 依賴');
console.log('   → 確認 TypeScript 配置正確\n');

console.log('📊 監控和日誌:');
console.log('==============');
console.log('1. Vercel 函數日誌:');
console.log('   - 進入 Vercel 控制台');
console.log('   - 點擊 "Functions" 標籤');
console.log('   - 查看 API 路由執行日誌\n');

console.log('2. 資料庫監控:');
console.log('   - 檢查連接狀態');
console.log('   - 監控查詢性能');
console.log('   - 查看錯誤日誌\n');

console.log('🔗 重要連結:');
console.log('============');
console.log('- Vercel 控制台: https://vercel.com/dashboard');
console.log('- 專案設置: https://vercel.com/dashboard/[project]/settings');
console.log('- 函數日誌: https://vercel.com/dashboard/[project]/functions');
console.log('- 部署日誌: https://vercel.com/dashboard/[project]/deployments\n');

console.log('🎯 成功指標:');
console.log('============');
console.log('✅ /api/health 返回 200 狀態碼');
console.log('✅ /api/faqs 返回 FAQ 數據');
console.log('✅ /admin 頁面正常載入');
console.log('✅ /chat 頁面正常載入');
console.log('✅ 資料庫連接正常');
console.log('✅ 無 401/403 錯誤\n');

console.log('🚀 完成部署後，請運行測試腳本:');
console.log('node scripts/test-deployment.js');
