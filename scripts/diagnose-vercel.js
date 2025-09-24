#!/usr/bin/env node

/**
 * Vercel 部署診斷腳本
 * 檢查環境變數和資料庫連接
 */

const https = require('https');

const DEPLOYMENT_URL = 'https://reply-ozvr-gz03xfu3e-peter14067s-projects.vercel.app';

async function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = `${DEPLOYMENT_URL}${path}`;
    console.log(`🔍 測試 ${method} ${url}`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`✅ ${method} ${path} - 狀態: ${res.statusCode}`);
          console.log(`   回應:`, JSON.stringify(jsonData, null, 2));
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          console.log(`⚠️  ${method} ${path} - 狀態: ${res.statusCode}`);
          console.log(`   原始回應:`, data);
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${method} ${path} - 錯誤:`, error.message);
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`⏰ ${method} ${path} - 超時`);
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function runDiagnosis() {
  console.log('🔧 開始 Vercel 部署診斷...');
  console.log(`📍 部署 URL: ${DEPLOYMENT_URL}`);
  console.log('========================\n');

  try {
    // 1. 測試健康檢查
    console.log('1. 測試健康檢查端點...');
    const healthResult = await testEndpoint('/api/health');
    console.log('');

    // 2. 測試資料庫初始化
    console.log('2. 測試資料庫初始化...');
    const initResult = await testEndpoint('/api/init-db', 'POST');
    console.log('');

    // 3. 測試 FAQ 端點
    console.log('3. 測試 FAQ 端點...');
    const faqResult = await testEndpoint('/api/faqs');
    console.log('');

    // 4. 分析結果
    console.log('📊 診斷結果分析:');
    console.log('========================');
    
    if (healthResult.status === 200) {
      console.log('✅ 健康檢查: 正常');
    } else {
      console.log('❌ 健康檢查: 異常');
    }

    if (initResult.status === 200) {
      console.log('✅ 資料庫初始化: 成功');
    } else if (initResult.status === 405) {
      console.log('⚠️  資料庫初始化: HTTP 方法不允許 (405)');
      console.log('   建議: 檢查 API 路由配置');
    } else {
      console.log('❌ 資料庫初始化: 失敗');
    }

    if (faqResult.status === 200) {
      console.log('✅ FAQ API: 正常');
    } else if (faqResult.status === 500) {
      console.log('❌ FAQ API: 內部服務器錯誤 (500)');
      console.log('   可能原因:');
      console.log('   - 資料庫連接失敗');
      console.log('   - 環境變數未設置');
      console.log('   - 資料庫表不存在');
    } else {
      console.log('❌ FAQ API: 異常');
    }

    console.log('\n🔧 建議的修復步驟:');
    console.log('========================');
    console.log('1. 檢查 Vercel 環境變數:');
    console.log('   - 確認 DATABASE_URL 已設置');
    console.log('   - 確認資料庫連接字串格式正確');
    console.log('');
    console.log('2. 檢查資料庫狀態:');
    console.log('   - 確認 PostgreSQL 資料庫已創建');
    console.log('   - 確認資料庫表已創建');
    console.log('');
    console.log('3. 重新部署:');
    console.log('   - 推送代碼到 GitHub');
    console.log('   - 等待 Vercel 自動重新部署');
    console.log('');
    console.log('4. 手動初始化資料庫:');
    console.log('   - 訪問 /api/init-db 端點');
    console.log('   - 或使用 Vercel CLI 執行腳本');

  } catch (error) {
    console.error('❌ 診斷失敗:', error.message);
  }
}

runDiagnosis();
