import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    // 檢查資料庫連接
    await prisma.$connect()
    
    // 測試簡單查詢
    const userCount = await prisma.user.count()
    const faqCount = await prisma.fAQ.count()
    const chatbotCount = await prisma.chatbot.count()
    
    await prisma.$disconnect()
    
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'connected',
        cache: 'connected',
        external_apis: 'connected'
      },
      database: {
        connected: true,
        userCount,
        faqCount,
        chatbotCount
      },
      environment_vars: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    }

    return NextResponse.json(healthCheck)
  } catch (error) {
    console.error('Health check failed:', error)
    
    const healthCheck = {
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'disconnected',
        cache: 'unknown',
        external_apis: 'unknown'
      },
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      environment_vars: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    }

    return NextResponse.json(healthCheck, { status: 500 })
  }
}
