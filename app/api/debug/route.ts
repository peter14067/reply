import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    console.log('🔧 Debug API 開始執行...')
    
    // 檢查環境變數
    const envCheck = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'Not set'
    }
    
    console.log('環境變數檢查:', envCheck)
    
    // 嘗試連接資料庫
    let dbStatus = 'unknown'
    let dbError = null
    let tableCounts = {}
    
    try {
      await prisma.$connect()
      console.log('✅ 資料庫連接成功')
      dbStatus = 'connected'
      
      // 嘗試查詢各個表
      try {
        tableCounts = {
          users: await prisma.user.count(),
          chatbots: await prisma.chatbot.count(),
          faqs: await prisma.fAQ.count(),
          messages: await prisma.message.count(),
          settings: await prisma.chatbotSettings.count()
        }
        console.log('表計數:', tableCounts)
      } catch (queryError) {
        console.error('查詢錯誤:', queryError)
        dbError = queryError instanceof Error ? queryError.message : 'Query failed'
      }
      
    } catch (connectError) {
      console.error('❌ 資料庫連接失敗:', connectError)
      dbStatus = 'failed'
      dbError = connectError instanceof Error ? connectError.message : 'Connection failed'
    } finally {
      try {
        await prisma.$disconnect()
      } catch (disconnectError) {
        console.error('斷開連接錯誤:', disconnectError)
      }
    }
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        error: dbError,
        tableCounts
      },
      prisma: {
        clientGenerated: !!prisma,
        version: process.env.npm_package_version || 'unknown'
      }
    }
    
    console.log('Debug 信息:', JSON.stringify(debugInfo, null, 2))
    
    return NextResponse.json(debugInfo)
    
  } catch (error) {
    console.error('❌ Debug API 錯誤:', error)
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: 'Debug API failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
