import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const limit = parseInt(searchParams.get('limit') || '10')

    // 建立篩選條件
    const where: any = {}
    
    if (role) {
      // 注意：schema 中沒有 role 欄位，這裡假設有
      // 如果沒有 role 欄位，可以移除這個篩選
      where.role = role
    }

    // 從資料庫獲取用戶
    const users = await prisma.user.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            messages: true,
            chatbots: true
          }
        }
      }
    })

    const total = await prisma.user.count({ where })

    return NextResponse.json({
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        messageCount: user._count.messages,
        chatbotCount: user._count.chatbots
      })),
      total,
      limit,
      role: role || 'all'
    })
    
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: '獲取用戶列表失敗' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: '姓名和電子郵件為必填欄位' },
        { status: 400 }
      )
    }

    // 檢查 email 是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: '此電子郵件已被使用' },
        { status: 409 }
      )
    }

    // 創建新用戶
    const newUser = await prisma.user.create({
      data: {
        name,
        email
      }
    })

    return NextResponse.json({
      message: '用戶創建成功',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString()
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: '創建用戶失敗' },
      { status: 500 }
    )
  }
}
