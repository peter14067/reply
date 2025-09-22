export interface Message {
  id: string
  content: string
  type: 'user' | 'bot' | 'system'
  timestamp: Date
  isRead?: boolean
  isResolved?: boolean
}

export interface FAQ {
  id: string
  question: string
  answer: string
  keywords: string[]
  priority: number
  isActive: boolean
  chatbotId?: string
  createdAt?: string
  updatedAt?: string
}

export interface ChatRequest {
  message: string
  sessionId?: string
  chatbotId?: string
  userId?: string
}

export interface ChatResponse {
  reply: string
  sessionId: string
  timestamp: string
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Chatbot {
  id: string
  name: string
  description?: string
  isActive: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface ChatbotSettings {
  id: string
  welcomeMessage?: string
  fallbackMessage?: string
  workingHours?: string
  timezone?: string
  autoReplyEnabled: boolean
  chatbotId: string
  createdAt: Date
  updatedAt: Date
}

export type MessageType = 'USER' | 'BOT' | 'SYSTEM'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface Stats {
  totalMessages: number
  resolvedMessages: number
  pendingMessages: number
  avgResponseTime: string
  satisfactionRate: string
}
