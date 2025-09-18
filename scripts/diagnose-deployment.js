#!/usr/bin/env node

/**
 * 部署診斷腳本
 * 用於檢查 Vercel 部署後的 FAQ 問題
 */

const https = require('https');

const BASE_URL = 'https://reply-ozvr.vercel.app';

async function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'reply-ozvr.vercel.app',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Diagnostic-Script/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function diagnose() {
  console.log('🔍 開始診斷 Vercel 部署狀態...\n');

  try {
    // 1. 檢查健康狀態
    console.log('1. 檢查健康狀態...');
    const health = await makeRequest('/api/health');
    console.log(`   狀態碼: ${health.status}`);
    console.log(`   回應: ${JSON.stringify(health.data, null, 2)}\n`);

    // 2. 檢查資料庫狀態
    console.log('2. 檢查資料庫狀態...');
    const dbStatus = await makeRequest('/api/init-db');
    console.log(`   狀態碼: ${dbStatus.status}`);
    console.log(`   回應: ${JSON.stringify(dbStatus.data, null, 2)}\n`);

    // 3. 檢查 FAQ API
    console.log('3. 檢查 FAQ API...');
    const faqs = await makeRequest('/api/faqs');
    console.log(`   狀態碼: ${faqs.status}`);
    console.log(`   回應: ${JSON.stringify(faqs.data, null, 2)}\n`);

    // 4. 診斷結果
    console.log('📋 診斷結果:');
    console.log('============');
    
    if (health.status === 200) {
      console.log('✅ 應用程式運行正常');
    } else {
      console.log('❌ 應用程式可能有問題');
    }

    if (dbStatus.status === 200 && dbStatus.data.success) {
      console.log('✅ 資料庫連接正常');
      console.log(`   - 用戶數: ${dbStatus.data.data?.userCount || 0}`);
      console.log(`   - FAQ 數: ${dbStatus.data.data?.faqCount || 0}`);
      console.log(`   - 機器人數: ${dbStatus.data.data?.chatbotCount || 0}`);
    } else {
      console.log('❌ 資料庫連接有問題');
      console.log(`   錯誤: ${dbStatus.data?.error || 'Unknown error'}`);
    }

    if (faqs.status === 200 && faqs.data.success) {
      console.log('✅ FAQ API 正常');
      console.log(`   - 找到 ${faqs.data.data?.length || 0} 個 FAQ`);
    } else {
      console.log('❌ FAQ API 有問題');
      console.log(`   錯誤: ${faqs.data?.error || 'Unknown error'}`);
    }

    // 5. 建議解決方案
    console.log('\n🔧 建議解決方案:');
    console.log('================');
    
    if (dbStatus.status !== 200 || !dbStatus.data.success) {
      console.log('1. 檢查 Vercel 環境變數 DATABASE_URL 是否正確設置');
      console.log('2. 確保使用支援的資料庫 (PostgreSQL/MySQL)');
      console.log('3. 重新部署應用程式');
    }

    if (faqs.status !== 200 || !faqs.data.success) {
      console.log('4. 初始化資料庫: 訪問 /api/init-db (POST)');
      console.log('5. 檢查 Prisma 客戶端是否正確生成');
    }

    console.log('\n📞 如果問題持續，請檢查 Vercel 函數日誌獲取詳細錯誤信息。');

  } catch (error) {
    console.error('❌ 診斷過程中發生錯誤:', error.message);
  }
}

diagnose();
