import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('開始初始化資料庫...')
    
    // 檢查是否已有數據
    const existingUser = await prisma.user.findFirst()
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: '資料庫已有數據，跳過初始化',
        data: {
          userCount: await prisma.user.count(),
          faqCount: await prisma.fAQ.count(),
          chatbotCount: await prisma.chatbot.count()
        }
      })
    }
    
    // 創建系統用戶
    const systemUser = await prisma.user.upsert({
      where: { email: 'system@example.com' },
      update: {},
      create: {
        id: 'system-user',
        email: 'system@example.com',
        name: '系統管理員'
      }
    })
    console.log('創建系統用戶:', systemUser.name)

    // 創建預設 chatbot
    const chatbot = await prisma.chatbot.upsert({
      where: { id: 'default-chatbot' },
      update: {},
      create: {
        id: 'default-chatbot',
        name: '預設客服機器人',
        description: '系統預設的客服機器人',
        isActive: true,
        userId: systemUser.id
      }
    })
    console.log('創建預設機器人:', chatbot.name)

    // 創建機器人設定
    await prisma.chatbotSettings.upsert({
      where: { chatbotId: chatbot.id },
      update: {},
      create: {
        chatbotId: chatbot.id,
        welcomeMessage: '您好！我是您的智能客服助手，有什麼可以幫助您的嗎？',
        fallbackMessage: '抱歉，我沒有理解您的問題。請聯繫人工客服獲得幫助。',
        timezone: 'Asia/Taipei',
        autoReplyEnabled: true
      }
    })
    console.log('創建機器人設定')

    // 創建範例 FAQ
    const faqs = [
      {
        question: '營業時間是什麼時候？',
        answer: '我們的營業時間是週一到週五 9:00-18:00，週六 10:00-16:00，週日休息。',
        keywords: JSON.stringify(['營業時間', '時間', '開放時間', '幾點', '營業']),
        priority: 1,
        chatbotId: chatbot.id
      },
      {
        question: '如何聯繫客服？',
        answer: '您可以透過以下方式聯繫我們：\n1. 線上客服：即時聊天\n2. 電話：02-1234-5678\n3. Email：service@example.com',
        keywords: JSON.stringify(['聯繫', '客服', '電話', 'email', '聯絡', '客服電話']),
        priority: 2,
        chatbotId: chatbot.id
      },
      {
        question: '退貨政策是什麼？',
        answer: '我們提供7天鑑賞期，商品需保持原包裝完整，未使用過。退貨運費由買方負擔。',
        keywords: JSON.stringify(['退貨', '政策', '鑑賞期', '退換貨', '退費']),
        priority: 3,
        chatbotId: chatbot.id
      },
      {
        question: '運費如何計算？',
        answer: '滿1000元免運費，未滿1000元運費80元。外島地區運費另計。',
        keywords: JSON.stringify(['運費', '運送', '免運', '配送', '運費計算']),
        priority: 4,
        chatbotId: chatbot.id
      },
      {
        question: '付款方式有哪些？',
        answer: '我們支援以下付款方式：\n1. 信用卡 (Visa, MasterCard, JCB)\n2. 銀行轉帳\n3. 超商代碼繳費\n4. 貨到付款',
        keywords: JSON.stringify(['付款', '支付', '信用卡', '轉帳', '代碼', '貨到付款']),
        priority: 5,
        chatbotId: chatbot.id
      }
    ]

    for (const faq of faqs) {
      await prisma.fAQ.upsert({
        where: { 
          id: `faq-${faq.question.replace(/\s+/g, '-').toLowerCase()}`
        },
        update: {},
        create: {
          id: `faq-${faq.question.replace(/\s+/g, '-').toLowerCase()}`,
          ...faq
        }
      })
    }
    console.log('創建範例 FAQ 資料')

    const stats = {
      userCount: await prisma.user.count(),
      faqCount: await prisma.fAQ.count(),
      chatbotCount: await prisma.chatbot.count()
    }

    return NextResponse.json({
      success: true,
      message: '資料庫初始化完成！',
      data: stats
    })
    
  } catch (error) {
    console.error('初始化失敗:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '資料庫初始化失敗',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  try {
    const stats = {
      userCount: await prisma.user.count(),
      faqCount: await prisma.fAQ.count(),
      chatbotCount: await prisma.chatbot.count()
    }

    return NextResponse.json({
      success: true,
      message: '資料庫狀態查詢成功',
      data: stats
    })
  } catch (error) {
    console.error('查詢資料庫狀態失敗:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '查詢資料庫狀態失敗',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
