#!/usr/bin/env node

/**
 * 資料庫連接檢查腳本
 * 檢查 Vercel 上的資料庫連接狀態
 */

const https = require('https');

const DEPLOYMENT_URL = 'https://reply-ozvr-gz03xfu3e-peter14067s-projects.vercel.app';

async function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = `${DEPLOYMENT_URL}${path}`;
    console.log(`🔍 ${method} ${url}`);
    
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
          resolve({ status: res.statusCode, data: jsonData, raw: data });
        } catch (error) {
          resolve({ status: res.statusCode, data: data, raw: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function checkDatabase() {
  console.log('🔧 檢查資料庫連接狀態...');
  console.log(`📍 部署 URL: ${DEPLOYMENT_URL}`);
  console.log('========================\n');

  try {
    // 1. 檢查健康檢查端點
    console.log('1. 檢查健康檢查端點...');
    const healthResult = await makeRequest('/api/health');
    console.log(`   狀態: ${healthResult.status}`);
    console.log(`   回應:`, JSON.stringify(healthResult.data, null, 2));
    console.log('');

    // 2. 嘗試初始化資料庫
    console.log('2. 嘗試初始化資料庫...');
    try {
      const initResult = await makeRequest('/api/init-db', 'POST');
      console.log(`   狀態: ${initResult.status}`);
      if (initResult.data) {
        console.log(`   回應:`, JSON.stringify(initResult.data, null, 2));
      } else {
        console.log(`   原始回應:`, initResult.raw);
      }
    } catch (error) {
      console.log(`   錯誤:`, error.message);
    }
    console.log('');

    // 3. 檢查 FAQ 端點
    console.log('3. 檢查 FAQ 端點...');
    const faqResult = await makeRequest('/api/faqs');
    console.log(`   狀態: ${faqResult.status}`);
    if (faqResult.data) {
      console.log(`   回應:`, JSON.stringify(faqResult.data, null, 2));
    } else {
      console.log(`   原始回應:`, faqResult.raw);
    }
    console.log('');

    // 4. 分析問題
    console.log('📊 問題分析:');
    console.log('========================');
    
    if (healthResult.status === 200) {
      const healthData = healthResult.data;
      if (healthData.database && healthData.database.connected) {
        console.log('✅ 資料庫連接: 正常');
        console.log(`   - 用戶數量: ${healthData.database.userCount || 'N/A'}`);
        console.log(`   - FAQ 數量: ${healthData.database.faqCount || 'N/A'}`);
        console.log(`   - 聊天機器人數量: ${healthData.database.chatbotCount || 'N/A'}`);
      } else {
        console.log('❌ 資料庫連接: 異常');
        if (healthData.database && healthData.database.error) {
          console.log(`   - 錯誤: ${healthData.database.error}`);
        }
      }
      
      if (healthData.environment_vars) {
        console.log('🔧 環境變數:');
        console.log(`   - DATABASE_URL 設置: ${healthData.environment_vars.hasDatabaseUrl ? '是' : '否'}`);
        console.log(`   - NODE_ENV: ${healthData.environment_vars.nodeEnv || 'N/A'}`);
      }
    } else {
      console.log('❌ 健康檢查失敗');
    }

    console.log('\n🔧 建議的修復步驟:');
    console.log('========================');
    
    if (healthResult.status !== 200) {
      console.log('1. 檢查 Vercel 部署狀態');
      console.log('2. 檢查環境變數設置');
      console.log('3. 重新部署應用');
    } else if (!healthResult.data.database || !healthResult.data.database.connected) {
      console.log('1. 檢查 DATABASE_URL 環境變數');
      console.log('2. 確認資料庫服務是否正常運行');
      console.log('3. 檢查資料庫連接字串格式');
    } else if (healthResult.data.database.faqCount === 0) {
      console.log('1. 執行資料庫初始化');
      console.log('2. 手動創建 FAQ 數據');
    } else {
      console.log('✅ 資料庫狀態正常，問題可能在於 API 實現');
    }

  } catch (error) {
    console.error('❌ 檢查失敗:', error.message);
  }
}

checkDatabase();
