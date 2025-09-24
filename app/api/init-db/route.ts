import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    console.log('🚀 開始初始化資料庫...')
    
    // 檢查資料庫連接
    await prisma.$connect()
    console.log('✅ 資料庫連接成功')
    
    // 創建默認用戶
    const defaultUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: '系統管理員'
      }
    })
    console.log('✅ 默認用戶創建成功:', defaultUser.email)
    
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
    console.log('✅ 默認聊天機器人創建成功:', defaultChatbot.name)
    
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
    console.log(`✅ 創建了 ${defaultFAQs.length} 個默認 FAQ`)
    
    // 創建聊天機器人設定
    await prisma.chatbotSettings.upsert({
      where: { chatbotId: defaultChatbot.id },
      update: {},
      create: {
        chatbotId: defaultChatbot.id,
        welcomeMessage: '您好！我是 GoSky AI 智能客服助手，有什麼可以幫助您的嗎？',
        fallbackMessage: '抱歉，我沒有理解您的問題。請聯繫人工客服獲得幫助。',
        workingHours: JSON.stringify({
          weekdays: { start: '09:00', end: '18:00' },
          weekend: { start: '10:00', end: '16:00' }
        }),
        timezone: 'Asia/Taipei',
        autoReplyEnabled: true
      }
    })
    console.log('✅ 聊天機器人設定創建成功')
    
    // 檢查數據
    const userCount = await prisma.user.count()
    const chatbotCount = await prisma.chatbot.count()
    const faqCount = await prisma.fAQ.count()
    const settingsCount = await prisma.chatbotSettings.count()
    
    console.log('\n📊 資料庫初始化完成:')
    console.log(`   - 用戶數量: ${userCount}`)
    console.log(`   - 聊天機器人數量: ${chatbotCount}`)
    console.log(`   - FAQ 數量: ${faqCount}`)
    console.log(`   - 設定數量: ${settingsCount}`)
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: '資料庫初始化成功',
      data: {
        userCount,
        chatbotCount,
        faqCount,
        settingsCount
      }
    })
    
  } catch (error) {
    console.error('❌ 資料庫初始化失敗:', error)
    await prisma.$disconnect()
    
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

export async function POST() {
  return GET()
}