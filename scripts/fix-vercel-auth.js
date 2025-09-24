#!/usr/bin/env node

/**
 * Vercel 身份驗證修復腳本
 * 用於解決 Vercel 部署保護問題
 */

const https = require('https');

const DEPLOYMENT_URL = 'https://reply-ozvr-gz03xfu3e-peter14067s-projects.vercel.app';

console.log('🔐 Vercel 身份驗證修復腳本');
console.log('============================\n');

console.log('❌ 問題診斷:');
console.log('你的 Vercel 部署被身份驗證保護功能鎖定了。');
console.log('這導致所有 API 端點返回 401 錯誤。\n');

console.log('🔧 解決方案:');
console.log('============');
console.log('1. 登入 Vercel 控制台: https://vercel.com/dashboard');
console.log('2. 選擇你的專案: reply-ozvr-gz03xfu3e-peter14067s-projects');
console.log('3. 進入 Settings → General');
console.log('4. 找到 "Deployment Protection" 部分');
console.log('5. 關閉 "Vercel Authentication" 或 "Password Protection"');
console.log('6. 重新部署你的應用\n');

console.log('📋 替代方案:');
console.log('============');
console.log('如果無法關閉保護，你可以:');
console.log('1. 使用 Vercel CLI 部署:');
console.log('   npm install -g vercel');
console.log('   vercel login');
console.log('   vercel --prod\n');

console.log('2. 或者設置環境變量來繞過保護:');
console.log('   在 Vercel 控制台設置:');
console.log('   VERCEL_PROTECTION_BYPASS=your-bypass-token\n');

console.log('🌐 測試 URL:');
console.log('============');
console.log('修復後，你可以測試以下端點:');
console.log(`- 健康檢查: ${DEPLOYMENT_URL}/api/health`);
console.log(`- FAQ 列表: ${DEPLOYMENT_URL}/api/faqs`);
console.log(`- 管理後台: ${DEPLOYMENT_URL}/admin`);
console.log(`- 聊天頁面: ${DEPLOYMENT_URL}/chat\n`);

console.log('📝 注意事項:');
console.log('============');
console.log('- 確保已設置 DATABASE_URL 環境變量');
console.log('- 確保資料庫已初始化');
console.log('- 檢查 Vercel 函數日誌以獲取詳細錯誤信息\n');

console.log('🚀 完成修復後，請重新運行測試腳本:');
console.log('node scripts/test-deployment.js');
