#!/usr/bin/env node

/**
 * 部署測試腳本
 * 用於測試 Vercel 部署的 API 端點
 */

const https = require('https');

const DEPLOYMENT_URL = 'https://reply-ozvr-gz03xfu3e-peter14067s-projects.vercel.app';

async function testEndpoint(path, method = 'GET') {
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

    req.end();
  });
}

async function runTests() {
  console.log('🚀 開始測試部署...');
  console.log(`📍 部署 URL: ${DEPLOYMENT_URL}`);
  console.log('========================\n');

  try {
    // 測試健康檢查
    console.log('1. 測試健康檢查端點...');
    await testEndpoint('/api/health');
    console.log('');

    // 測試 FAQ 端點
    console.log('2. 測試 FAQ 端點...');
    await testEndpoint('/api/faqs');
    console.log('');

    // 初始化資料庫
    console.log('3. 初始化資料庫...');
    await testEndpoint('/api/vercel-init', 'POST');
    console.log('');

    // 再次測試 FAQ 端點
    console.log('4. 重新測試 FAQ 端點...');
    await testEndpoint('/api/faqs');
    console.log('');

    console.log('🎉 測試完成！');

  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
  }
}

runTests();
