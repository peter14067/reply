import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

interface ChatRequest {
  message: string
  sessionId?: string
  chatbotId?: string
  userId?: string
}

interface ChatResponse {
  reply: string
  sessionId: string
  timestamp: string
}

// 從資料庫獲取 FAQ 並進行關鍵字匹配
async function findBestAnswer(message: string, chatbotId?: string): Promise<string> {
  const lowerMessage = message.toLowerCase()
  
  // 從資料庫獲取 FAQ
  const faqs = await prisma.fAQ.findMany({
    where: {
      isActive: true,
      ...(chatbotId && { chatbotId })
    },
    orderBy: { priority: 'asc' }
  })
  
  if (faqs.length === 0) {
    return '抱歉，我沒有理解您的問題。請選擇下方常見問題或聯繫人工客服獲得幫助。'
  }
  
  // 計算每個 FAQ 的匹配分數
  const scoredFAQs = faqs.map(faq => {
    let score = 0
    
    // 解析關鍵字（假設 keywords 是 JSON 字串）
    let keywords: string[] = []
    try {
      keywords = faq.keywords ? JSON.parse(faq.keywords) : []
    } catch {
      keywords = faq.keywords ? faq.keywords.split(',').map(k => k.trim()) : []
    }
    
    const lowerKeywords = keywords.map(k => k.toLowerCase())
    
    // 檢查關鍵字匹配
    lowerKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        score += 1
      }
    })
    
    // 檢查問題相似度（簡單的詞彙重疊）
    const questionWords = faq.question.toLowerCase().split(' ')
    const messageWords = lowerMessage.split(' ')
    
    questionWords.forEach(qWord => {
      if (messageWords.includes(qWord) && qWord.length > 2) {
        score += 0.5
      }
    })
    
    return {
      ...faq,
      score: score + (1 / faq.priority) // 優先級越高分數越高
    }
  })
  
  // 找到最高分的 FAQ
  const bestMatch = scoredFAQs.reduce((best, current) => 
    current.score > best.score ? current : best
  )
  
  // 如果分數太低，返回預設回覆
  if (bestMatch.score < 0.5) {
    return '抱歉，我沒有理解您的問題。請選擇下方常見問題或聯繫人工客服獲得幫助。'
  }
  
  return bestMatch.answer
}

// 生成會話 ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, sessionId, chatbotId, userId } = body
    
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: '訊息內容不能為空' },
        { status: 400 }
      )
    }
    
    // 生成或使用現有的會話 ID
    const currentSessionId = sessionId || generateSessionId()
    
    // 模擬 AI 處理延遲
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
    
    // 找到最佳回覆
    const reply = await findBestAnswer(message, chatbotId)
    
    // 如果提供了 chatbotId，將對話儲存到資料庫
    if (chatbotId) {
      try {
        // 儲存用戶訊息
        await prisma.message.create({
          data: {
            content: message.trim(),
            type: 'USER',
            sessionId: currentSessionId,
            userId: userId || null,
            chatbotId
          }
        })
        
        // 儲存機器人回覆
        await prisma.message.create({
          data: {
            content: reply,
            type: 'BOT',
            sessionId: currentSessionId,
            userId: userId || null,
            chatbotId,
            isRead: true,
            isResolved: true
          }
        })
      } catch (dbError) {
        console.error('Database error when saving messages:', dbError)
        // 不中斷聊天流程，只記錄錯誤
      }
    }
    
    const response: ChatResponse = {
      reply,
      sessionId: currentSessionId,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: '伺服器內部錯誤' },
      { status: 500 }
    )
  }
}

// 獲取 FAQ 列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chatbotId = searchParams.get('chatbotId')
    
    const faqs = await prisma.fAQ.findMany({
      where: {
        isActive: true,
        ...(chatbotId && { chatbotId })
      },
      orderBy: { priority: 'asc' },
      include: {
        chatbot: {
          select: { id: true, name: true }
        }
      }
    })
    
    return NextResponse.json({
      faqs: faqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        keywords: faq.keywords ? JSON.parse(faq.keywords) : [],
        priority: faq.priority,
        chatbot: faq.chatbot
      }))
    })
  } catch (error) {
    console.error('FAQ API error:', error)
    return NextResponse.json(
      { error: '伺服器內部錯誤' },
      { status: 500 }
    )
  }
}
