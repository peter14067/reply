import { NextResponse } from 'next/server'

export async function GET() {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: 'connected', // 在實際應用中會檢查資料庫連線
      cache: 'connected',
      external_apis: 'connected'
    }
  }

  return NextResponse.json(healthCheck)
}
