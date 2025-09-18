# Vercel 部署指南

## 問題診斷：FAQ 獲取失敗

在 Vercel 上部署後 FAQ 獲取失敗的常見原因和解決方案：

### 1. 資料庫配置問題

**問題**：Vercel 不支持 SQLite 文件資料庫
**解決方案**：使用 Vercel Postgres 或 PlanetScale

#### 選項 A：使用 Vercel Postgres
1. 在 Vercel 控制台中創建 Postgres 資料庫
2. 設置環境變量：
   ```
   DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
   ```

#### 選項 B：使用 PlanetScale
1. 註冊 PlanetScale 帳戶
2. 創建 MySQL 資料庫
3. 更新 `prisma/schema.prisma`：
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

### 2. 環境變量設置

在 Vercel 控制台中設置以下環境變量：

```bash
# 必需
DATABASE_URL="your-database-url"

# 可選
NEXT_PUBLIC_APP_NAME="GoSky AI Chatbot"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
API_SECRET_KEY="your-secret-key"
CHATBOT_WELCOME_MESSAGE="您好！我是您的智能客服助手，有什麼可以幫助您的嗎？"
CHATBOT_FALLBACK_MESSAGE="抱歉，我沒有理解您的問題。請聯繫人工客服獲得幫助。"
WORKING_HOURS_START="09:00"
WORKING_HOURS_END="18:00"
TIMEZONE="Asia/Taipei"
ENABLE_NOTIFICATIONS=true
NOTIFICATION_EMAIL="admin@example.com"
```

### 3. 部署步驟

1. **推送代碼到 GitHub**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment"
   git push origin main
   ```

2. **在 Vercel 中設置環境變量**
   - 進入 Vercel 控制台
   - 選擇您的項目
   - 進入 Settings > Environment Variables
   - 添加所有必要的環境變量

3. **重新部署**
   - 觸發新的部署
   - 檢查部署日誌是否有錯誤

### 4. 資料庫遷移

如果使用新的資料庫：

```bash
# 生成 Prisma 客戶端
npm run db:generate

# 推送資料庫結構
npm run db:push

# 或者運行遷移
npx prisma migrate deploy
```

### 5. 常見錯誤和解決方案

#### 錯誤：`PrismaClientInitializationError`
- 檢查 `DATABASE_URL` 是否正確設置
- 確保資料庫服務正在運行

#### 錯誤：`Table 'faqs' doesn't exist`
- 運行資料庫遷移
- 檢查 Prisma schema 是否正確

#### 錯誤：`Connection timeout`
- 檢查資料庫連接字符串
- 確保資料庫允許外部連接

### 6. 調試技巧

1. **檢查 Vercel 函數日誌**
   - 在 Vercel 控制台查看函數執行日誌
   - 查找 Prisma 相關錯誤

2. **本地測試生產環境**
   ```bash
   # 設置生產環境變量
   export DATABASE_URL="your-production-database-url"
   npm run build
   npm run start
   ```

3. **使用 Prisma Studio 檢查資料庫**
   ```bash
   npx prisma studio
   ```

### 7. 推薦的生產環境設置

- 使用 Vercel Postgres 或 PlanetScale
- 設置適當的資料庫連接池
- 啟用 Prisma 查詢日誌
- 設置監控和警報

## 快速修復

如果您想快速修復當前問題，請按照以下步驟：

1. 在 Vercel 控制台設置 `DATABASE_URL` 環境變量
2. 重新部署應用
3. 檢查 `/api/faqs` 端點是否正常工作

如果問題仍然存在，請檢查 Vercel 函數日誌以獲取詳細錯誤信息。
