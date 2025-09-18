'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Send, Bot, User, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Message, ChatRequest, ChatResponse, FAQ } from '@/app/types'


export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [faqsLoading, setFaqsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 獲取FAQ列表
  const fetchFAQs = useCallback(async () => {
    try {
      setFaqsLoading(true)
      const response = await fetch('/api/faqs')
      const data = await response.json()
      
      if (data.success) {
        setFaqs(data.data)
      } else {
        console.error('Failed to fetch FAQs:', data.error)
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setFaqsLoading(false)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // 歡迎訊息
    const welcomeMessage: Message = {
      id: 'welcome',
      content: '您好！我是您的智能客服助手，有什麼可以幫助您的嗎？',
      type: 'bot',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  // 載入FAQ
  useEffect(() => {
    fetchFAQs()
  }, [fetchFAQs])

  const findBestAnswer = useCallback(async (question: string): Promise<string> => {
    try {
      const requestBody: ChatRequest = {
        message: question,
        sessionId: sessionId || undefined
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      
      if (!response.ok) {
        throw new Error('API request failed')
      }
      
      const data: ChatResponse = await response.json()
      return data.reply || '抱歉，我沒有理解您的問題。請選擇下方常見問題或聯繫人工客服獲得幫助。'
    } catch (error) {
      console.error('Error fetching answer:', error)
      // Fallback to local FAQ matching
      const lowerQuestion = question.toLowerCase()
      for (const faq of faqs) {
        const keywords = faq.question.toLowerCase().split(' ')
        const hasKeyword = keywords.some(keyword => 
          lowerQuestion.includes(keyword) && keyword.length > 2
        )
        
        if (hasKeyword) {
          return faq.answer
        }
      }
      return '抱歉，我沒有理解您的問題。請選擇下方常見問題或聯繫人工客服獲得幫助。'
    }
  }, [sessionId, faqs])

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsTyping(true)

    try {
      setError(null)
      const botAnswer = await findBestAnswer(currentInput)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botAnswer,
        type: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error getting bot response:', error)
      setError('系統暫時無法回應，請稍後再試')
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，系統暫時無法回應。請稍後再試或聯繫人工客服。',
        type: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsTyping(false)
    }
  }, [inputValue, findBestAnswer])

  const handleFAQClick = useCallback(async (faq: FAQ) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: faq.question,
      type: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      setError(null)
      const botAnswer = await findBestAnswer(faq.question)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botAnswer,
        type: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error getting bot response:', error)
      setError('系統暫時無法回應，使用預設答案')
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: faq.answer, // Fallback to local answer
        type: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsTyping(false)
    }
  }, [findBestAnswer])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  const memoizedFAQQuestions = useMemo(() => faqs, [faqs])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header */}
      <header className="glass sticky top-0 z-50 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity duration-200">
              <motion.div 
                className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-3 shadow-soft"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Bot className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">智能客服助手</h1>
                <div className="flex items-center space-x-2">
                  <motion.div 
                    className="w-2 h-2 bg-success-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                  <p className="text-sm text-gray-600">24/7 為您服務</p>
                </div>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">在線狀態</p>
                <p className="text-xs text-success-600 font-medium">即時回覆</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <motion.div 
            className="mb-4 bg-error-50 border border-error-200 rounded-xl p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-sm text-error-800 font-medium">{error}</div>
          </motion.div>
        )}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* FAQ Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              className="card p-4 lg:p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-primary-600" />
                常見問題
              </h2>
              <div className="space-y-3">
                {faqsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    <span className="ml-2 text-sm text-gray-600">載入中...</span>
                  </div>
                ) : memoizedFAQQuestions.length > 0 ? (
                  memoizedFAQQuestions.map((faq, index) => (
                    <motion.button
                      key={faq.id}
                      onClick={() => handleFAQClick(faq)}
                      className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 hover:shadow-soft group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-sm font-medium text-gray-900 group-hover:text-primary-700">{faq.question}</div>
                    </motion.button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    暫無常見問題
                  </div>
                )}
              </div>
              <motion.div 
                className="mt-6 p-4 bg-primary-50 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <p className="text-xs text-primary-700 font-medium mb-2">💡 小提示</p>
                <p className="text-xs text-primary-600">點擊上方問題可快速獲得答案，或直接在下方輸入您的問題</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <motion.div 
              className="card h-[500px] lg:h-[700px] flex flex-col shadow-large"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 lg:space-x-3 max-w-xs sm:max-w-sm lg:max-w-lg ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <motion.div 
                          className={`rounded-2xl p-3 shadow-soft ${message.type === 'user' ? 'bg-gradient-to-r from-primary-600 to-primary-700' : 'bg-white border border-gray-200'}`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {message.type === 'user' ? (
                            <User className="h-5 w-5 text-white" />
                          ) : (
                            <Bot className="h-5 w-5 text-primary-600" />
                          )}
                        </motion.div>
                        <motion.div 
                          className={`rounded-2xl px-5 py-3 shadow-soft ${
                            message.type === 'user' 
                              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white' 
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString('zh-TW', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3">
                      <motion.div 
                        className="rounded-2xl p-3 bg-white border border-gray-200 shadow-soft"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Bot className="h-5 w-5 text-primary-600" />
                      </motion.div>
                      <motion.div 
                        className="bg-white rounded-2xl px-5 py-3 border border-gray-200 shadow-soft"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex space-x-1">
                          <motion.div 
                            className="w-2 h-2 bg-primary-400 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          ></motion.div>
                          <motion.div 
                            className="w-2 h-2 bg-primary-400 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          ></motion.div>
                          <motion.div 
                            className="w-2 h-2 bg-primary-400 rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          ></motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <motion.div 
                className="border-t border-gray-200 p-4 lg:p-6 bg-gray-50/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex space-x-2 lg:space-x-3">
                  <motion.input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="輸入您的問題..."
                    className="flex-1 input text-sm lg:text-base"
                    disabled={isTyping}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="btn btn-primary px-4 lg:px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      animate={isTyping ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 1, repeat: isTyping ? Infinity : 0 }}
                    >
                      <Send className="h-4 w-4 lg:h-5 lg:w-5 group-hover:scale-110 transition-transform" />
                    </motion.div>
                  </motion.button>
                </div>
                <motion.p 
                  className="text-xs text-gray-500 mt-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  按 Enter 發送訊息，Shift + Enter 換行
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
