import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || 'World'

  return NextResponse.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
    method: 'GET',
    query: Object.fromEntries(searchParams)
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      message: `Hello, ${body.name || 'World'}!`,
      timestamp: new Date().toISOString(),
      method: 'POST',
      receivedData: body
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON data' },
      { status: 400 }
    )
  }
}
