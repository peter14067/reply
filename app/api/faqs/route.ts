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
    console.log('Starting FAQ fetch...')
    
    // 檢查資料庫連接
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // 先檢查是否有 FAQ 數據，如果沒有則初始化
    const faqCount = await prisma.fAQ.count()
    console.log(`Current FAQ count: ${faqCount}`)
    
    if (faqCount === 0) {
      console.log('No FAQs found, initializing database...')
      // 調用初始化邏輯
      await initializeDatabase()
    }
    
    const faqs = await prisma.fAQ.findMany({
      orderBy: { priority: 'asc' }
    })
    
    console.log(`Found ${faqs.length} FAQs`)
    
    // 轉換 keywords 從 JSON 字符串到數組
    const formattedFAQs = faqs.map(faq => ({
      ...faq,
      keywords: faq.keywords ? JSON.parse(faq.keywords) : [],
      createdAt: faq.createdAt.toISOString(),
      updatedAt: faq.updatedAt.toISOString()
    }))
    
    console.log('FAQs formatted successfully')
    
    return NextResponse.json({
      success: true,
      data: formattedFAQs
    })
  } catch (error) {
    console.error('Get FAQs error:', error)
    
    // 更詳細的錯誤信息
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: '獲取 FAQ 失敗',
        details: process.env.NODE_ENV === 'development' ? errorMessage : 'Database connection error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// 初始化資料庫的輔助函數
async function initializeDatabase() {
  try {
    // 創建默認用戶
    const defaultUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: '系統管理員'
      }
    })
    
    // 創建默認聊天機器人
    const defaultChatbot = await prisma.chatbot.upsert({
      where: { id: 'default-chatbot' },
      update: {},
      create: {
        id: 'default-chatbot',
        name: 'GoSky AI 智能客服',
        description: '智能客服機器人，提供 24/7 自動回覆服務',
        userId: defaultUser.id
      }
    })
    
    // 創建默認 FAQ 數據
    const defaultFAQs = [
      {
        id: 'faq-營業時間',
        question: '營業時間是什麼時候？',
        answer: '我們的營業時間是週一到週五 9:00-18:00，週六 10:00-16:00，週日休息。',
        keywords: JSON.stringify(['營業時間', '時間', '開放時間', '幾點開門']),
        priority: 1,
        isActive: true,
        chatbotId: defaultChatbot.id
      },
      {
        id: 'faq-退貨流程',
        question: '我想退貨，請問流程是什麼？',
        answer: '退貨流程如下：1. 聯繫客服申請退貨 2. 填寫退貨單 3. 包裝商品寄回 4. 等待退款處理。',
        keywords: JSON.stringify(['退貨', '退款', '退貨流程', '如何退貨']),
        priority: 2,
        isActive: true,
        chatbotId: defaultChatbot.id
      },
      {
        id: 'faq-聯絡方式',
        question: '如何聯絡客服？',
        answer: '您可以通過以下方式聯絡我們：電話：02-1234-5678，Email：service@example.com，或使用線上客服系統。',
        keywords: JSON.stringify(['聯絡', '客服', '電話', 'email', '聯繫方式']),
        priority: 3,
        isActive: true,
        chatbotId: defaultChatbot.id
      },
      {
        id: 'faq-配送時間',
        question: '商品多久會送到？',
        answer: '一般商品 3-5 個工作天內送達，偏遠地區可能需要 5-7 個工作天。急件可選擇當日配送服務。',
        keywords: JSON.stringify(['配送', '送達', '多久', '運送時間', '物流']),
        priority: 4,
        isActive: true,
        chatbotId: defaultChatbot.id
      },
      {
        id: 'faq-付款方式',
        question: '支援哪些付款方式？',
        answer: '我們支援信用卡、ATM 轉帳、超商代碼繳費、LINE Pay、街口支付等多種付款方式。',
        keywords: JSON.stringify(['付款', '支付', '信用卡', '轉帳', 'LINE Pay']),
        priority: 5,
        isActive: true,
        chatbotId: defaultChatbot.id
      }
    ]
    
    for (const faq of defaultFAQs) {
      await prisma.fAQ.upsert({
        where: { id: faq.id },
        update: {},
        create: faq
      })
    }
    
    console.log(`✅ 初始化了 ${defaultFAQs.length} 個默認 FAQ`)
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
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
