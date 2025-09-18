# Vercel 部署指南

## 問題診斷

部署到 Vercel 後 FAQ 撈不到的主要原因是：

1. **資料庫類型不支援**：原本使用 SQLite，但 Vercel 不支援 SQLite
2. **環境變數未設置**：缺少 `DATABASE_URL` 環境變數
3. **資料庫未初始化**：部署後沒有創建必要的數據

## 解決步驟

### 1. 設置 PostgreSQL 資料庫

#### 選項 A: 使用 Vercel Postgres (推薦)
1. 在 Vercel 控制台進入您的專案
2. 點擊 "Storage" 標籤
3. 點擊 "Create Database" → 選擇 "Postgres"
4. 創建資料庫後，複製連接字串

#### 選項 B: 使用外部 PostgreSQL 服務
- [Supabase](https://supabase.com) (免費方案)
- [PlanetScale](https://planetscale.com) (免費方案)
- [Railway](https://railway.app) (免費方案)

### 2. 設置環境變數

在 Vercel 控制台設置以下環境變數：

```bash
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

### 3. 重新部署

1. 推送代碼到 GitHub
2. Vercel 會自動重新部署
3. 部署完成後，訪問 `/api/health` 檢查資料庫連接

### 4. 初始化資料庫 (如果需要)

如果資料庫是空的，可以手動觸發初始化：

```bash
# 在 Vercel 函數中執行
curl -X POST https://your-app.vercel.app/api/init-db
```

## 驗證部署

### 1. 健康檢查
訪問：`https://your-app.vercel.app/api/health`

應該看到：
```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "faqCount": 5
  }
}
```

### 2. FAQ API 測試
訪問：`https://your-app.vercel.app/api/faqs`

應該看到：
```json
{
  "success": true,
  "data": [
    {
      "id": "faq-營業時間是什麼時候？",
      "question": "營業時間是什麼時候？",
      "answer": "我們的營業時間是週一到週五 9:00-18:00...",
      "keywords": ["營業時間", "時間", "開放時間"],
      "priority": 1,
      "isActive": true
    }
  ]
}
```

### 3. 管理後台測試
訪問：`https://your-app.vercel.app/admin`

應該能看到 FAQ 列表和統計數據。

## 常見問題

### Q: 仍然顯示 "載入中..."
A: 檢查瀏覽器開發者工具的 Network 標籤，查看 API 請求是否失敗

### Q: 資料庫連接失敗
A: 確認 `DATABASE_URL` 環境變數是否正確設置

### Q: FAQ 列表為空
A: 執行資料庫初始化腳本或手動創建 FAQ 數據

### Q: 部署後 404 錯誤
A: 確認 Next.js 路由配置正確，檢查 `app` 目錄結構

## 監控和日誌

### Vercel 函數日誌
1. 進入 Vercel 控制台
2. 點擊 "Functions" 標籤
3. 查看 API 路由的執行日誌

### 資料庫監控
- 檢查資料庫連接狀態
- 監控查詢性能
- 查看錯誤日誌

## 性能優化

1. **資料庫連接池**：Prisma 會自動管理連接池
2. **快取策略**：考慮添加 Redis 快取
3. **CDN 配置**：靜態資源使用 Vercel CDN
4. **函數優化**：減少冷啟動時間

## 安全建議

1. **環境變數**：不要在代碼中硬編碼敏感信息
2. **資料庫權限**：使用最小權限原則
3. **API 限制**：考慮添加速率限制
4. **HTTPS**：Vercel 自動提供 HTTPS

## 故障排除

如果問題仍然存在：

1. 檢查 Vercel 函數日誌
2. 確認資料庫連接字串格式
3. 驗證 Prisma schema 配置
4. 測試本地環境是否正常
5. 聯繫 Vercel 支援