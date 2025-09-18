import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

interface FAQ {
  id: string
  question: string
  answer: string
  keywords: string[]
  priority: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// 獲取所有 FAQ
export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { priority: 'asc' }
    })
    
    // 轉換 keywords 從 JSON 字符串到數組
    const formattedFAQs = faqs.map(faq => ({
      ...faq,
      keywords: faq.keywords ? JSON.parse(faq.keywords) : [],
      createdAt: faq.createdAt.toISOString(),
      updatedAt: faq.updatedAt.toISOString()
    }))
    
    return NextResponse.json({
      success: true,
      data: formattedFAQs
    })
  } catch (error) {
    console.error('Get FAQs error:', error)
    return NextResponse.json(
      { success: false, error: '獲取 FAQ 失敗' },
      { status: 500 }
    )
  }
}

// 創建新 FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, answer, keywords, priority, isActive } = body
    
    if (!question || !answer) {
      return NextResponse.json(
        { success: false, error: '問題和答案不能為空' },
        { status: 400 }
      )
    }
    
    // 創建一個默認的 chatbot 如果不存在
    let chatbot = await prisma.chatbot.findFirst()
    if (!chatbot) {
      // 先創建一個默認用戶
      const defaultUser = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
          email: 'admin@example.com',
          name: '系統管理員'
        }
      })
      
      chatbot = await prisma.chatbot.create({
        data: {
          name: 'Default Chatbot',
          description: 'Default chatbot for FAQ management',
          userId: defaultUser.id
        }
      })
    }
    
    const newFAQ = await prisma.fAQ.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        keywords: JSON.stringify(Array.isArray(keywords) ? keywords : []),
        priority: priority || 1,
        isActive: isActive !== false,
        chatbotId: chatbot.id
      }
    })
    
    const formattedFAQ = {
      ...newFAQ,
      keywords: newFAQ.keywords ? JSON.parse(newFAQ.keywords) : [],
      createdAt: newFAQ.createdAt.toISOString(),
      updatedAt: newFAQ.updatedAt.toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: formattedFAQ
    })
    
  } catch (error) {
    console.error('Create FAQ error:', error)
    return NextResponse.json(
      { success: false, error: '創建 FAQ 失敗' },
      { status: 500 }
    )
  }
}

// 更新 FAQ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, question, answer, keywords, priority, isActive } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'FAQ ID 不能為空' },
        { status: 400 }
      )
    }
    
    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id }
    })
    
    if (!existingFAQ) {
      return NextResponse.json(
        { success: false, error: '找不到指定的 FAQ' },
        { status: 404 }
      )
    }
    
    const updateData: any = {}
    if (question !== undefined) updateData.question = question.trim()
    if (answer !== undefined) updateData.answer = answer.trim()
    if (keywords !== undefined) updateData.keywords = JSON.stringify(Array.isArray(keywords) ? keywords : [])
    if (priority !== undefined) updateData.priority = priority
    if (isActive !== undefined) updateData.isActive = isActive
    
    const updatedFAQ = await prisma.fAQ.update({
      where: { id },
      data: updateData
    })
    
    const formattedFAQ = {
      ...updatedFAQ,
      keywords: updatedFAQ.keywords ? JSON.parse(updatedFAQ.keywords) : [],
      createdAt: updatedFAQ.createdAt.toISOString(),
      updatedAt: updatedFAQ.updatedAt.toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: formattedFAQ
    })
    
  } catch (error) {
    console.error('Update FAQ error:', error)
    return NextResponse.json(
      { success: false, error: '更新 FAQ 失敗' },
      { status: 500 }
    )
  }
}

// 刪除 FAQ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'FAQ ID 不能為空' },
        { status: 400 }
      )
    }
    
    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id }
    })
    
    if (!existingFAQ) {
      return NextResponse.json(
        { success: false, error: '找不到指定的 FAQ' },
        { status: 404 }
      )
    }
    
    await prisma.fAQ.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'FAQ 刪除成功'
    })
    
  } catch (error) {
    console.error('Delete FAQ error:', error)
    return NextResponse.json(
      { success: false, error: '刪除 FAQ 失敗' },
      { status: 500 }
    )
  }
}
