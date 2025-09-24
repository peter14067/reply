import { NextRequest, NextResponse } from 'next/server'
import { initDatabase } from '@/scripts/init-postgres'

export async function POST(request: NextRequest) {
  try {
    console.log('開始初始化資料庫...')
    
    await initDatabase()
    
    return NextResponse.json({
      success: true,
      message: '資料庫初始化成功',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('資料庫初始化失敗:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: '資料庫初始化失敗',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: '使用 POST 方法來初始化資料庫',
    endpoint: '/api/init-db',
    method: 'POST'
  })
}