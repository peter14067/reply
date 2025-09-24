import { NextResponse } from 'next/server'
import { initVercelDatabase } from '../../../scripts/vercel-init'

export async function POST() {
  try {
    console.log('🚀 開始 Vercel 資料庫初始化...')
    
    await initVercelDatabase()
    
    return NextResponse.json({
      success: true,
      message: 'Vercel 資料庫初始化成功',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Vercel 資料庫初始化失敗:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Vercel 資料庫初始化失敗',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Vercel 資料庫初始化端點',
    usage: 'POST 到此端點來初始化資料庫',
    timestamp: new Date().toISOString()
  })
}
