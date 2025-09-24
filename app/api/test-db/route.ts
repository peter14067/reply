import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    console.log('🔧 開始資料庫測試...')
    
    // 檢查環境變數
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    const nodeEnv = process.env.NODE_ENV
    
    console.log('環境變數:', { hasDatabaseUrl, nodeEnv })
    
    // 嘗試連接資料庫
    let connectionStatus = 'unknown'
    let errorMessage = null
    let tableInfo = {}
    
    try {
      await prisma.$connect()
      console.log('✅ 資料庫連接成功')
      connectionStatus = 'connected'
      
      // 測試查詢
      try {
        const userCount = await prisma.user.count()
        const chatbotCount = await prisma.chatbot.count()
        const faqCount = await prisma.fAQ.count()
        
        tableInfo = {
          users: userCount,
          chatbots: chatbotCount,
          faqs: faqCount
        }
        
        console.log('表信息:', tableInfo)
        
      } catch (queryError) {
        console.error('查詢錯誤:', queryError)
        errorMessage = queryError instanceof Error ? queryError.message : 'Query failed'
      }
      
    } catch (connectError) {
      console.error('❌ 資料庫連接失敗:', connectError)
      connectionStatus = 'failed'
      errorMessage = connectError instanceof Error ? connectError.message : 'Connection failed'
    } finally {
      try {
        await prisma.$disconnect()
      } catch (disconnectError) {
        console.error('斷開連接錯誤:', disconnectError)
      }
    }
    
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      environment: {
        hasDatabaseUrl,
        nodeEnv
      },
      database: {
        status: connectionStatus,
        error: errorMessage,
        tables: tableInfo
      }
    }
    
    console.log('測試結果:', result)
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('❌ 測試失敗:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
