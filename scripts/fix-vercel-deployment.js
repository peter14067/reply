#!/usr/bin/env node

/**
 * Vercel 部署修復腳本
 * 用於診斷和修復 FAQ 獲取失敗問題
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Vercel 部署修復腳本');
console.log('========================\n');

// 檢查環境變量
console.log('1. 檢查環境變量...');
const requiredEnvVars = ['DATABASE_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ 缺少必要的環境變量:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n請在 Vercel 控制台中設置這些環境變量。');
} else {
  console.log('✅ 環境變量檢查通過');
}

// 檢查 Prisma 配置
console.log('\n2. 檢查 Prisma 配置...');
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

if (schemaContent.includes('env("DATABASE_URL")')) {
  console.log('✅ Prisma schema 配置正確');
} else {
  console.log('❌ Prisma schema 需要更新');
  console.log('   請確保 datasource db 使用 env("DATABASE_URL")');
}

// 生成 Prisma 客戶端
console.log('\n3. 生成 Prisma 客戶端...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma 客戶端生成成功');
} catch (error) {
  console.log('❌ Prisma 客戶端生成失敗:', error.message);
}

// 檢查資料庫連接
console.log('\n4. 檢查資料庫連接...');
try {
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ 資料庫連接成功');
} catch (error) {
  console.log('❌ 資料庫連接失敗:', error.message);
  console.log('   請檢查 DATABASE_URL 是否正確');
}

// 測試 API 端點
console.log('\n5. 測試 API 端點...');
console.log('   請訪問以下 URL 來測試:');
console.log('   - 健康檢查: /api/health');
console.log('   - FAQ 列表: /api/faqs');

console.log('\n📋 修復檢查清單:');
console.log('================');
console.log('□ 在 Vercel 控制台設置 DATABASE_URL 環境變量');
console.log('□ 確保使用支援的資料庫 (Postgres/MySQL)');
console.log('□ 重新部署應用');
console.log('□ 檢查 Vercel 函數日誌');
console.log('□ 測試 /api/health 端點');
console.log('□ 測試 /api/faqs 端點');

console.log('\n🚀 如果問題仍然存在，請查看 DEPLOYMENT.md 獲取詳細說明。');
