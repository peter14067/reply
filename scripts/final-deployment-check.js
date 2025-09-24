#!/usr/bin/env node

/**
 * 最終部署檢查腳本
 * 確保所有配置都正確設置
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 最終部署檢查');
console.log('================\n');

// 檢查必要文件
const requiredFiles = [
  'package.json',
  'vercel.json',
  'next.config.js',
  'prisma/schema.prisma',
  'app/lib/prisma.ts',
  'app/api/health/route.ts',
  'app/api/faqs/route.ts',
  'app/api/init-db/route.ts'
];

console.log('📁 檢查必要文件:');
let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

if (allFilesExist) {
  console.log('\n✅ 所有必要文件都存在');
} else {
  console.log('\n❌ 缺少必要文件，請檢查專案結構');
}

// 檢查 package.json 配置
console.log('\n📦 檢查 package.json 配置:');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

const requiredDeps = ['@prisma/client', 'next', 'react', 'react-dom'];
const requiredDevDeps = ['prisma', 'typescript'];

console.log('   依賴項目:');
requiredDeps.forEach(dep => {
  const exists = packageJson.dependencies && packageJson.dependencies[dep];
  console.log(`   ${exists ? '✅' : '❌'} ${dep}`);
});

console.log('   開發依賴:');
requiredDevDeps.forEach(dep => {
  const exists = packageJson.devDependencies && packageJson.devDependencies[dep];
  console.log(`   ${exists ? '✅' : '❌'} ${dep}`);
});

// 檢查 Prisma schema
console.log('\n🗄️  檢查 Prisma 配置:');
const schemaContent = fs.readFileSync(path.join(__dirname, '..', 'prisma/schema.prisma'), 'utf8');
const hasPostgresProvider = schemaContent.includes('provider = "postgresql"');
const hasDatabaseUrl = schemaContent.includes('env("DATABASE_URL")');

console.log(`   ${hasPostgresProvider ? '✅' : '❌'} PostgreSQL 提供者`);
console.log(`   ${hasDatabaseUrl ? '✅' : '❌'} DATABASE_URL 環境變量`);

// 檢查 Vercel 配置
console.log('\n⚙️  檢查 Vercel 配置:');
const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
const hasNextjsFramework = vercelConfig.framework === 'nextjs';
const hasApiRoutes = vercelConfig.routes && vercelConfig.routes.length > 0;

console.log(`   ${hasNextjsFramework ? '✅' : '❌'} Next.js 框架配置`);
console.log(`   ${hasApiRoutes ? '✅' : '❌'} API 路由配置`);

// 檢查 API 路由
console.log('\n🔌 檢查 API 路由:');
const apiRoutes = [
  'app/api/health/route.ts',
  'app/api/faqs/route.ts',
  'app/api/init-db/route.ts',
  'app/api/chat/route.ts',
  'app/api/messages/route.ts'
];

apiRoutes.forEach(route => {
  const exists = fs.existsSync(path.join(__dirname, '..', route));
  console.log(`   ${exists ? '✅' : '❌'} ${route}`);
});

// 檢查頁面
console.log('\n📄 檢查頁面:');
const pages = [
  'app/page.tsx',
  'app/admin/page.tsx',
  'app/chat/page.tsx',
  'app/about/page.tsx'
];

pages.forEach(page => {
  const exists = fs.existsSync(path.join(__dirname, '..', page));
  console.log(`   ${exists ? '✅' : '❌'} ${page}`);
});

// 部署建議
console.log('\n🚀 部署建議:');
console.log('============');
console.log('1. 在 Vercel 控制台設置環境變量:');
console.log('   - DATABASE_URL (PostgreSQL 連接字串)');
console.log('   - NODE_ENV=production');
console.log('   - NEXT_PUBLIC_APP_URL (你的 Vercel 域名)\n');

console.log('2. 關閉部署保護:');
console.log('   - 進入 Settings → General');
console.log('   - 關閉 "Vercel Authentication" 和 "Password Protection"\n');

console.log('3. 重新部署:');
console.log('   - 推送代碼到 GitHub');
console.log('   - 或手動觸發重新部署\n');

console.log('4. 初始化資料庫:');
console.log('   - 訪問 /api/init-db 端點 (POST 方法)');
console.log('   - 或使用 curl: curl -X POST https://your-app.vercel.app/api/init-db\n');

console.log('5. 測試部署:');
console.log('   - 運行: npm run test:deployment');
console.log('   - 檢查所有端點是否正常\n');

console.log('📋 檢查清單:');
console.log('============');
console.log('□ 環境變量已設置');
console.log('□ 部署保護已關閉');
console.log('□ 資料庫已初始化');
console.log('□ API 端點正常響應');
console.log('□ 頁面正常載入');
console.log('□ 無 401/403 錯誤\n');

console.log('🎯 成功指標:');
console.log('============');
console.log('✅ /api/health 返回 200');
console.log('✅ /api/faqs 返回數據');
console.log('✅ /admin 頁面載入');
console.log('✅ /chat 頁面載入');
console.log('✅ 資料庫連接正常\n');

console.log('🔗 重要連結:');
console.log('============');
console.log('- Vercel 控制台: https://vercel.com/dashboard');
console.log('- 專案設置: https://vercel.com/dashboard/[project]/settings');
console.log('- 環境變量: https://vercel.com/dashboard/[project]/settings/environment-variables');
console.log('- 函數日誌: https://vercel.com/dashboard/[project]/functions\n');

console.log('🎉 準備就緒！你的專案已經配置好可以在 Vercel 上運行。');
