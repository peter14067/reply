#!/usr/bin/env node

/**
 * Vercel 部署後腳本
 * 自動初始化 PostgreSQL 資料庫
 */

const { execSync } = require('child_process');
const https = require('https');

console.log('🚀 Vercel 部署後腳本開始執行...');

// 獲取部署 URL
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_APP_URL;

if (!vercelUrl) {
  console.log('❌ 無法獲取部署 URL，跳過資料庫初始化');
  process.exit(0);
}

console.log(`📍 部署 URL: ${vercelUrl}`);

// 等待一段時間讓部署完全啟動
console.log('⏳ 等待部署完全啟動...');
setTimeout(async () => {
  try {
    // 檢查健康狀態
    console.log('🔍 檢查應用健康狀態...');
    const healthResponse = await makeRequest(`${vercelUrl}/api/health`);
    
    if (healthResponse.status === 'ok') {
      console.log('✅ 應用健康檢查通過');
      
      // 初始化資料庫
      console.log('🗄️ 開始初始化資料庫...');
      const initResponse = await makeRequest(`${vercelUrl}/api/init-db`, 'POST');
      
      if (initResponse.success) {
        console.log('✅ 資料庫初始化成功');
        console.log('🎉 部署後腳本執行完成！');
      } else {
        console.log('❌ 資料庫初始化失敗:', initResponse.error);
      }
    } else {
      console.log('❌ 應用健康檢查失敗');
    }
  } catch (error) {
    console.log('❌ 部署後腳本執行失敗:', error.message);
  }
}, 10000); // 等待 10 秒

function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
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
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${data}`));
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

    req.end();
  });
}