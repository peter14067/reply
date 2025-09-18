#!/usr/bin/env node

/**
 * 部署檢查腳本
 * 用於驗證 Vercel 部署後的狀態
 */

const https = require('https');

const BASE_URL = 'https://reply-ozvr.vercel.app';

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'reply-ozvr.vercel.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'User-Agent': 'Deployment-Check-Script/1.0',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function checkDeployment() {
  console.log('🚀 檢查 Vercel 部署狀態...\n');

  try {
    // 1. 檢查健康狀態
    console.log('1. 檢查應用程式健康狀態...');
    const health = await makeRequest('/api/health');
    if (health.status === 200) {
      console.log('   ✅ 應用程式運行正常');
    } else {
      console.log('   ❌ 應用程式有問題');
      return;
    }

    // 2. 檢查資料庫初始化狀態
    console.log('\n2. 檢查資料庫初始化狀態...');
    const dbStatus = await makeRequest('/api/init-db');
    if (dbStatus.status === 200 && dbStatus.data.success) {
      console.log('   ✅ 資料庫已初始化');
      console.log(`   - 用戶數: ${dbStatus.data.data?.userCount || 0}`);
      console.log(`   - FAQ 數: ${dbStatus.data.data?.faqCount || 0}`);
      console.log(`   - 機器人數: ${dbStatus.data.data?.chatbotCount || 0}`);
    } else if (dbStatus.status === 404) {
      console.log('   ⚠️  資料庫未初始化，正在初始化...');
      
      // 嘗試初始化資料庫
      const initResult = await makeRequest('/api/init-db', 'POST');
      if (initResult.status === 200 && initResult.data.success) {
        console.log('   ✅ 資料庫初始化成功');
        console.log(`   - 用戶數: ${initResult.data.data?.userCount || 0}`);
        console.log(`   - FAQ 數: ${initResult.data.data?.faqCount || 0}`);
        console.log(`   - 機器人數: ${initResult.data.data?.chatbotCount || 0}`);
      } else {
        console.log('   ❌ 資料庫初始化失敗');
        console.log(`   錯誤: ${initResult.data?.error || 'Unknown error'}`);
        return;
      }
    } else {
      console.log('   ❌ 資料庫連接有問題');
      console.log(`   錯誤: ${dbStatus.data?.error || 'Unknown error'}`);
      return;
    }

    // 3. 檢查 FAQ API
    console.log('\n3. 檢查 FAQ API...');
    const faqs = await makeRequest('/api/faqs');
    if (faqs.status === 200 && faqs.data.success) {
      console.log('   ✅ FAQ API 正常');
      console.log(`   - 找到 ${faqs.data.data?.length || 0} 個 FAQ`);
      
      if (faqs.data.data?.length > 0) {
        console.log('   📋 FAQ 列表:');
        faqs.data.data.forEach((faq, index) => {
          console.log(`      ${index + 1}. ${faq.question}`);
        });
      }
    } else {
      console.log('   ❌ FAQ API 有問題');
      console.log(`   錯誤: ${faqs.data?.error || 'Unknown error'}`);
      return;
    }

    // 4. 檢查管理後台
    console.log('\n4. 檢查管理後台...');
    const admin = await makeRequest('/admin');
    if (admin.status === 200) {
      console.log('   ✅ 管理後台可訪問');
    } else {
      console.log('   ❌ 管理後台無法訪問');
    }

    console.log('\n🎉 部署檢查完成！所有功能正常運行。');
    console.log('\n📱 您可以訪問以下網址:');
    console.log(`   - 主頁: ${BASE_URL}`);
    console.log(`   - 管理後台: ${BASE_URL}/admin`);
    console.log(`   - 聊天頁面: ${BASE_URL}/chat`);

  } catch (error) {
    console.error('❌ 檢查過程中發生錯誤:', error.message);
    console.log('\n🔧 請檢查以下項目:');
    console.log('1. Vercel 環境變數 DATABASE_URL 是否正確設置');
    console.log('2. 資料庫是否支援並可連接');
    console.log('3. 應用程式是否已正確部署');
  }
}

checkDeployment();
