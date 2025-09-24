import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envInfo = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      databaseUrlPrefix: process.env.DATABASE_URL ? 
        process.env.DATABASE_URL.substring(0, 20) + '...' : 
        'Not set',
      databaseUrlLength: process.env.DATABASE_URL ? 
        process.env.DATABASE_URL.length : 0,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(envInfo)
  } catch (error) {
    return NextResponse.json({
      error: 'Environment check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
