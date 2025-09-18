import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// 獲取訊息列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const isResolved = searchParams.get('isResolved')
    const isRead = searchParams.get('isRead')
    
    // 建立篩選條件
    const where: any = {}
    
    if (type) {
      where.type = type.toUpperCase()
    }
    
    if (isResolved !== null) {
      where.isResolved = isResolved === 'true'
    }
    
    if (isRead !== null) {
      where.isRead = isRead === 'true'
    }
    
    // 從資料庫獲取訊息
    const [messages, totalCount] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          chatbot: {
            select: { id: true, name: true }
          }
        }
      }),
      prisma.message.count({ where })
    ])
    
    // 計算統計資料
    const [unreadCount, unresolvedCount, userMessagesCount, botMessagesCount] = await Promise.all([
      prisma.message.count({ where: { ...where, isRead: false } }),
      prisma.message.count({ where: { ...where, isResolved: false } }),
      prisma.message.count({ where: { ...where, type: 'USER' } }),
      prisma.message.count({ where: { ...where, type: 'BOT' } })
    ])
    
    const stats = {
      total: totalCount,
      unread: unreadCount,
      unresolved: unresolvedCount,
      userMessages: userMessagesCount,
      botMessages: botMessagesCount
    }
    
    return NextResponse.json({
      success: true,
      data: {
        messages: messages.map(msg => ({
          ...msg,
          type: msg.type.toLowerCase(),
          createdAt: msg.createdAt.toISOString(),
          updatedAt: msg.updatedAt.toISOString()
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        },
        stats
      }
    })
    
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { success: false, error: '獲取訊息失敗' },
      { status: 500 }
    )
  }
}

// 創建新訊息
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, type, sessionId, userId, chatbotId } = body
    
    if (!content || !type || !chatbotId) {
      return NextResponse.json(
        { success: false, error: '訊息內容、類型和機器人ID不能為空' },
        { status: 400 }
      )
    }
    
    // 確保 chatbot 存在
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId }
    })
    
    if (!chatbot) {
      return NextResponse.json(
        { success: false, error: '找不到指定的機器人' },
        { status: 404 }
      )
    }
    
    // 創建新訊息
    const newMessage = await prisma.message.create({
      data: {
        content: content.trim(),
        type: type.toUpperCase() as 'USER' | 'BOT' | 'SYSTEM',
        isRead: type === 'bot', // 機器人訊息預設已讀
        isResolved: type === 'bot', // 機器人訊息預設已解決
        sessionId: sessionId || `session_${Date.now()}`,
        userId: userId || null,
        chatbotId
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        chatbot: {
          select: { id: true, name: true }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        ...newMessage,
        type: newMessage.type.toLowerCase(),
        createdAt: newMessage.createdAt.toISOString(),
        updatedAt: newMessage.updatedAt.toISOString()
      }
    })
    
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { success: false, error: '創建訊息失敗' },
      { status: 500 }
    )
  }
}

// 更新訊息狀態
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isRead, isResolved } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '訊息ID不能為空' },
        { status: 400 }
      )
    }
    
    // 檢查訊息是否存在
    const existingMessage = await prisma.message.findUnique({
      where: { id }
    })
    
    if (!existingMessage) {
      return NextResponse.json(
        { success: false, error: '找不到指定的訊息' },
        { status: 404 }
      )
    }
    
    // 更新訊息
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        isRead: isRead !== undefined ? isRead : existingMessage.isRead,
        isResolved: isResolved !== undefined ? isResolved : existingMessage.isResolved
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        chatbot: {
          select: { id: true, name: true }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        ...updatedMessage,
        type: updatedMessage.type.toLowerCase(),
        createdAt: updatedMessage.createdAt.toISOString(),
        updatedAt: updatedMessage.updatedAt.toISOString()
      }
    })
    
  } catch (error) {
    console.error('Update message error:', error)
    return NextResponse.json(
      { success: false, error: '更新訊息失敗' },
      { status: 500 }
    )
  }
}

// 刪除訊息
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '訊息ID不能為空' },
        { status: 400 }
      )
    }
    
    // 檢查訊息是否存在
    const existingMessage = await prisma.message.findUnique({
      where: { id }
    })
    
    if (!existingMessage) {
      return NextResponse.json(
        { success: false, error: '找不到指定的訊息' },
        { status: 404 }
      )
    }
    
    // 刪除訊息
    await prisma.message.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      message: '訊息刪除成功'
    })
    
  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json(
      { success: false, error: '刪除訊息失敗' },
      { status: 500 }
    )
  }
}
