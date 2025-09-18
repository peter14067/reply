#!/bin/bash

echo "🚀 啟動 GoSky AI Chatbot Platform..."

# 檢查 Node.js 是否已安裝
if ! command -v node &> /dev/null; then
    echo "❌ 請先安裝 Node.js (https://nodejs.org/)"
    exit 1
fi

# 檢查 npm 是否已安裝
if ! command -v npm &> /dev/null; then
    echo "❌ 請先安裝 npm"
    exit 1
fi

echo "📦 安裝依賴套件..."
npm install

echo "🔧 初始化 Prisma (可選)..."
if [ -f "prisma/schema.prisma" ]; then
    npx prisma generate
    echo "✅ Prisma 初始化完成"
else
    echo "⚠️  未找到 Prisma schema，跳過資料庫初始化"
fi

echo "🎨 編譯樣式..."
npm run build

echo "🌐 啟動開發伺服器..."
echo "📍 應用將在 http://localhost:3000 開啟"
echo "📍 聊天頁面: http://localhost:3000/chat"
echo "📍 管理後台: http://localhost:3000/admin"
echo ""
echo "按 Ctrl+C 停止伺服器"

npm run dev
