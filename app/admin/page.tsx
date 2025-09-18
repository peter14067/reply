'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Bot, Plus, Edit, Trash2, MessageCircle, Settings, BarChart3, Users, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FAQ, Message, ApiResponse, Stats } from '@/app/types'

// API 調用函數
const fetchFAQs = async (): Promise<FAQ[]> => {
  const response = await fetch('/api/faqs')
  const result: ApiResponse<FAQ[]> = await response.json()
  if (result.success && result.data) {
    return result.data
  }
  throw new Error(result.error || '獲取 FAQ 失敗')
}

const createFAQ = async (faq: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>): Promise<FAQ> => {
  const response = await fetch('/api/faqs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(faq),
  })
  const result: ApiResponse<FAQ> = await response.json()
  if (result.success && result.data) {
    return result.data
  }
  throw new Error(result.error || '創建 FAQ 失敗')
}

const updateFAQ = async (id: string, faq: Partial<Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FAQ> => {
  const response = await fetch('/api/faqs', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...faq }),
  })
  const result: ApiResponse<FAQ> = await response.json()
  if (result.success && result.data) {
    return result.data
  }
  throw new Error(result.error || '更新 FAQ 失敗')
}

const deleteFAQ = async (id: string): Promise<void> => {
  const response = await fetch(`/api/faqs?id=${id}`, {
    method: 'DELETE',
  })
  const result: ApiResponse<void> = await response.json()
  if (!result.success) {
    throw new Error(result.error || '刪除 FAQ 失敗')
  }
}

const mockMessages: Message[] = [
  {
    id: '1',
    content: '請問你們的營業時間是什麼時候？',
    type: 'user',
    timestamp: new Date('2024-01-15T10:30:00'),
    isRead: true,
    isResolved: true
  },
  {
    id: '2',
    content: '我們的營業時間是週一到週五 9:00-18:00，週六 10:00-16:00，週日休息。',
    type: 'bot',
    timestamp: new Date('2024-01-15T10:30:05'),
    isRead: true,
    isResolved: true
  },
  {
    id: '3',
    content: '我想退貨，請問流程是什麼？',
    type: 'user',
    timestamp: new Date('2024-01-15T14:20:00'),
    isRead: false,
    isResolved: false
  }
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [showAddFAQ, setShowAddFAQ] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const stats: Stats = useMemo(() => ({
    totalMessages: 1247,
    resolvedMessages: 1180,
    pendingMessages: 67,
    avgResponseTime: '2.3分鐘',
    satisfactionRate: '94%'
  }), [])

  // 加載 FAQ 數據
  useEffect(() => {
    const loadFAQs = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchFAQs()
        setFaqs(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加載 FAQ 失敗')
      } finally {
        setLoading(false)
      }
    }
    
    loadFAQs()
  }, [])

  const handleAddFAQ = useCallback(async (faq: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const newFAQ = await createFAQ(faq)
      setFaqs(prev => [...prev, newFAQ])
      setShowAddFAQ(false)
      setSuccess('FAQ 創建成功！')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '創建 FAQ 失敗')
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleEditFAQ = useCallback((faq: FAQ) => {
    setEditingFAQ(faq)
    setShowAddFAQ(true)
  }, [])

  const handleUpdateFAQ = useCallback(async (faq: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingFAQ) return
    
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const updatedFAQ = await updateFAQ(editingFAQ.id, faq)
      setFaqs(prev => prev.map(f => f.id === editingFAQ.id ? updatedFAQ : f))
      setEditingFAQ(null)
      setShowAddFAQ(false)
      setSuccess('FAQ 更新成功！')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新 FAQ 失敗')
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }, [editingFAQ])

  const handleDeleteFAQ = useCallback(async (id: string) => {
    if (!confirm('確定要刪除這個 FAQ 嗎？')) return
    
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await deleteFAQ(id)
      setFaqs(prev => prev.filter(faq => faq.id !== id))
      setSuccess('FAQ 刪除成功！')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除 FAQ 失敗')
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleMarkAsRead = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      )
    )
  }

  const handleMarkAsResolved = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, isResolved: true } : msg
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header */}
      <header className="glass sticky top-0 z-50 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-2 shadow-soft">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">GoSky AI 管理後台</h1>
                <p className="text-sm text-gray-500">智能客服管理系統</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-sm text-gray-500">管理員</p>
                <p className="text-xs text-success-600 font-medium">在線</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center shadow-soft">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === 'dashboard' 
                      ? 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 shadow-soft' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-medium">儀表板</span>
                </button>
                <button
                  onClick={() => setActiveTab('faqs')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === 'faqs' 
                      ? 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 shadow-soft' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">FAQ 管理</span>
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === 'messages' 
                      ? 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 shadow-soft' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">訊息管理</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === 'settings' 
                      ? 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 shadow-soft' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">設定</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">儀表板</h2>
                    <p className="text-gray-600">查看您的智能客服系統運行狀況和關鍵指標</p>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card p-6 card-hover group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">總訊息數</p>
                          <p className="text-3xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
                          <p className="text-xs text-success-600 mt-1">+12% 較上月</p>
                        </div>
                        <div className="bg-primary-100 rounded-2xl p-4 group-hover:scale-110 transition-transform">
                          <MessageCircle className="h-8 w-8 text-primary-600" />
                        </div>
                      </div>
                    </div>

                    <div className="card p-6 card-hover group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">已解決</p>
                          <p className="text-3xl font-bold text-success-600">{stats.resolvedMessages.toLocaleString()}</p>
                          <p className="text-xs text-success-600 mt-1">94.6% 解決率</p>
                        </div>
                        <div className="bg-success-100 rounded-2xl p-4 group-hover:scale-110 transition-transform">
                          <Users className="h-8 w-8 text-success-600" />
                        </div>
                      </div>
                    </div>

                    <div className="card p-6 card-hover group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">待處理</p>
                          <p className="text-3xl font-bold text-warning-600">{stats.pendingMessages}</p>
                          <p className="text-xs text-warning-600 mt-1">需要關注</p>
                        </div>
                        <div className="bg-warning-100 rounded-2xl p-4 group-hover:scale-110 transition-transform">
                          <Clock className="h-8 w-8 text-warning-600" />
                        </div>
                      </div>
                    </div>

                    <div className="card p-6 card-hover group">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">滿意度</p>
                          <p className="text-3xl font-bold text-accent-600">{stats.satisfactionRate}</p>
                          <p className="text-xs text-accent-600 mt-1">客戶滿意</p>
                        </div>
                        <div className="bg-accent-100 rounded-2xl p-4 group-hover:scale-110 transition-transform">
                          <BarChart3 className="h-8 w-8 text-accent-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Messages */}
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">最近訊息</h3>
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        查看全部
                      </button>
                    </div>
                    <div className="space-y-4">
                      {messages.slice(0, 5).map((message) => (
                        <div key={message.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium group-hover:text-gray-700">{message.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {message.timestamp.toLocaleString('zh-TW')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            {!message.isRead && (
                              <div className="w-2 h-2 bg-error-500 rounded-full animate-pulse"></div>
                            )}
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                              message.isResolved 
                                ? 'bg-success-100 text-success-800' 
                                : 'bg-warning-100 text-warning-800'
                            }`}>
                              {message.isResolved ? '已解決' : '待處理'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'faqs' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">FAQ 管理</h2>
                      <p className="text-gray-600">管理常見問題和自動回覆內容</p>
                    </div>
                    <button
                      onClick={() => setShowAddFAQ(true)}
                      className="btn btn-primary flex items-center space-x-2 group"
                      disabled={loading}
                    >
                      <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                      <span>新增 FAQ</span>
                    </button>
                  </div>

                  {error && (
                    <motion.div 
                      className="bg-error-50 border border-error-200 rounded-xl p-4"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="text-sm text-error-800 font-medium">{error}</div>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div 
                      className="bg-success-50 border border-success-200 rounded-xl p-4"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="text-sm text-success-800 font-medium">{success}</div>
                    </motion.div>
                  )}

                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      {loading ? (
                        <div className="flex justify-center items-center py-12">
                          <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                            <div className="text-gray-600 font-medium">載入中...</div>
                          </div>
                        </div>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">問題</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">關鍵字</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">優先級</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">狀態</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">操作</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {faqs.map((faq) => (
                              <tr key={faq.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900 max-w-xs">{faq.question}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1">
                                    {faq.keywords.map((keyword, index) => (
                                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800 font-medium">
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900 font-medium">{faq.priority}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    faq.isActive 
                                      ? 'bg-success-100 text-success-800' 
                                      : 'bg-error-100 text-error-800'
                                  }`}>
                                    {faq.isActive ? '啟用' : '停用'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-3">
                                    <button
                                      onClick={() => handleEditFAQ(faq)}
                                      className="text-primary-600 hover:text-primary-900 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                                      disabled={loading}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFAQ(faq.id)}
                                      className="text-error-600 hover:text-error-900 p-2 rounded-lg hover:bg-error-50 transition-colors"
                                      disabled={loading}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">訊息管理</h2>
                  
                  <div className="card">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">訊息內容</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">類型</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時間</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {messages.map((message) => (
                            <tr key={message.id}>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-xs truncate">{message.content}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  message.type === 'user' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {message.type === 'user' ? '用戶' : '機器人'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {message.timestamp.toLocaleString('zh-TW')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  {!message.isRead && (
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                  )}
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    message.isResolved 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {message.isResolved ? '已解決' : '待處理'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  {!message.isRead && (
                                    <button
                                      onClick={() => handleMarkAsRead(message.id)}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      標記已讀
                                    </button>
                                  )}
                                  {!message.isResolved && (
                                    <button
                                      onClick={() => handleMarkAsResolved(message.id)}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      標記解決
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">設定</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">機器人設定</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">歡迎訊息</label>
                          <textarea
                            className="input w-full h-20"
                            placeholder="輸入歡迎訊息..."
                            defaultValue="您好！我是您的智能客服助手，有什麼可以幫助您的嗎？"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">回退訊息</label>
                          <textarea
                            className="input w-full h-20"
                            placeholder="當無法理解用戶問題時的回覆..."
                            defaultValue="抱歉，我沒有理解您的問題。請聯繫人工客服獲得幫助。"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="autoReply"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="autoReply" className="ml-2 block text-sm text-gray-900">
                            啟用自動回覆
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="card p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">工作時間設定</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">時區</label>
                          <select className="input w-full">
                            <option value="Asia/Taipei">台北時間 (UTC+8)</option>
                            <option value="Asia/Shanghai">上海時間 (UTC+8)</option>
                            <option value="Asia/Tokyo">東京時間 (UTC+9)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">工作時間</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="time"
                              className="input"
                              defaultValue="09:00"
                            />
                            <input
                              type="time"
                              className="input"
                              defaultValue="18:00"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="weekend"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label htmlFor="weekend" className="ml-2 block text-sm text-gray-900">
                            週末也工作
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">通知設定</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">新訊息通知</div>
                          <div className="text-sm text-gray-500">當收到新訊息時發送通知</div>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">未解決訊息提醒</div>
                          <div className="text-sm text-gray-500">定期提醒未解決的訊息</div>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="btn btn-primary px-6 py-2">
                      儲存設定
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add/Edit FAQ Modal */}
      {showAddFAQ && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-large">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingFAQ ? '編輯 FAQ' : '新增 FAQ'}
              </h3>
              <button
                onClick={() => {
                  setShowAddFAQ(false)
                  setEditingFAQ(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const faq = {
                question: formData.get('question') as string,
                answer: formData.get('answer') as string,
                keywords: (formData.get('keywords') as string).split(',').map(k => k.trim()).filter(k => k),
                priority: parseInt(formData.get('priority') as string),
                isActive: formData.get('isActive') === 'on'
              }
              
              if (editingFAQ) {
                await handleUpdateFAQ(faq)
              } else {
                await handleAddFAQ(faq)
              }
            }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">問題</label>
                  <input
                    type="text"
                    name="question"
                    className="input w-full"
                    defaultValue={editingFAQ?.question || ''}
                    placeholder="請輸入常見問題..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">答案</label>
                  <textarea
                    name="answer"
                    className="textarea w-full h-24"
                    defaultValue={editingFAQ?.answer || ''}
                    placeholder="請輸入詳細回答..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">關鍵字</label>
                  <input
                    type="text"
                    name="keywords"
                    className="input w-full"
                    defaultValue={editingFAQ?.keywords.join(', ') || ''}
                    placeholder="營業時間, 時間, 開放時間 (用逗號分隔)"
                  />
                  <p className="text-xs text-gray-500 mt-2">關鍵字用於智能匹配用戶問題</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">優先級</label>
                    <input
                      type="number"
                      name="priority"
                      className="input w-full"
                      defaultValue={editingFAQ?.priority || 1}
                      min="1"
                      max="10"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked={editingFAQ?.isActive ?? true}
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-900">啟用此 FAQ</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFAQ(false)
                    setEditingFAQ(null)
                  }}
                  className="btn btn-secondary px-6 py-3"
                  disabled={loading}
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary px-6 py-3"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>處理中...</span>
                    </div>
                  ) : (
                    editingFAQ ? '更新 FAQ' : '新增 FAQ'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
