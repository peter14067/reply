# GoSky AI Chatbot Platform

一個基於 Next.js 14 的智能客服機器人平台，提供自動回覆、FAQ 管理、24/7 客服等功能。

## 功能特色

### 🤖 核心功能
- **FAQ 自動回覆** - 智能匹配用戶問題並提供相應答案
- **24/7 即時自動回覆** - 全天候自動回應客戶詢問
- **集中客服管理** - 統一管理所有客服訊息和案件
- **留言自動回覆** - 自動回覆社群留言，提升互動率

### 📊 管理後台
- **儀表板** - 查看客服數據統計和趨勢
- **FAQ 管理** - 新增、編輯、刪除常見問題
- **訊息管理** - 查看、標記、處理客戶訊息
- **設定管理** - 配置機器人行為和工作時間

### 🎨 用戶體驗
- **響應式設計** - 支援桌面和行動裝置
- **即時聊天** - 流暢的對話體驗
- **動畫效果** - 使用 Framer Motion 提供流暢動畫
- **現代化 UI** - 基於 Tailwind CSS 的美觀介面

## 技術棧

- **前端框架**: Next.js 14 (App Router)
- **UI 框架**: React 18 + TypeScript
- **樣式**: Tailwind CSS
- **動畫**: Framer Motion
- **圖標**: Lucide React
- **表單**: React Hook Form + Zod
- **資料庫**: SQLite + Prisma (可選)

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

### 3. 開啟瀏覽器

訪問 [http://localhost:3000](http://localhost:3000) 查看應用

## 專案結構

```
gosky-ai-chatbot/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── chat/          # 聊天 API
│   │   ├── faqs/          # FAQ 管理 API
│   │   └── messages/      # 訊息管理 API
│   ├── admin/             # 管理後台頁面
│   ├── chat/              # 聊天頁面
│   ├── globals.css        # 全域樣式
│   ├── layout.tsx         # 根佈局
│   └── page.tsx           # 首頁
├── components/            # 可重用組件
├── lib/                   # 工具函數
├── prisma/                # 資料庫 Schema
├── public/                # 靜態資源
└── styles/                # 樣式文件
```

## API 端點

### 聊天 API
- `POST /api/chat` - 發送訊息並獲取回覆
- `GET /api/chat` - 獲取 FAQ 列表

### FAQ 管理 API
- `GET /api/faqs` - 獲取所有 FAQ
- `POST /api/faqs` - 創建新 FAQ
- `PUT /api/faqs` - 更新 FAQ
- `DELETE /api/faqs` - 刪除 FAQ

### 訊息管理 API
- `GET /api/messages` - 獲取訊息列表
- `POST /api/messages` - 創建新訊息
- `PUT /api/messages` - 更新訊息狀態
- `DELETE /api/messages` - 刪除訊息

## 使用說明

### 1. 聊天測試
- 訪問 `/chat` 頁面
- 輸入問題或點擊常見問題
- 系統會自動匹配最佳答案

### 2. 管理後台
- 訪問 `/admin` 頁面
- 在儀表板查看統計數據
- 管理 FAQ 和訊息

### 3. FAQ 管理
- 新增常見問題和答案
- 設定關鍵字和優先級
- 啟用/停用特定 FAQ

### 4. 訊息管理
- 查看所有客戶訊息
- 標記已讀/未讀狀態
- 標記已解決/待處理狀態

## 自定義配置

### 1. 修改 FAQ 資料
編輯 `app/api/chat/route.ts` 中的 `faqDatabase` 陣列

### 2. 調整匹配算法
修改 `findBestAnswer` 函數來改善回答準確度

### 3. 自定義樣式
編輯 `tailwind.config.js` 和 `app/globals.css`

### 4. 添加新功能
在 `app/api/` 目錄下創建新的 API 路由

## 部署

### Vercel 部署
1. 將代碼推送到 GitHub
2. 在 Vercel 中導入專案
3. 自動部署完成

### 其他平台
1. 執行 `npm run build`
2. 將 `.next` 和 `public` 目錄上傳到伺服器
3. 執行 `npm start`

## 開發指南

### 添加新頁面
1. 在 `app/` 目錄下創建新資料夾
2. 添加 `page.tsx` 文件
3. 使用 Next.js App Router 語法

### 添加新 API
1. 在 `app/api/` 目錄下創建新資料夾
2. 添加 `route.ts` 文件
3. 導出 HTTP 方法函數

### 添加新組件
1. 在 `components/` 目錄下創建組件文件
2. 使用 TypeScript 和 Tailwind CSS
3. 導出並在其他地方使用

## 貢獻

歡迎提交 Issue 和 Pull Request 來改善這個專案！

## 授權

MIT License

## 聯繫

如有問題或建議，請聯繫開發團隊。