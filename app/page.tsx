import Link from 'next/link'
import { MessageCircle, Bot, Settings, BarChart3, Users, Clock, Sparkles, Zap, Shield, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header */}
      <header className="glass sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
              <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-xl shadow-soft">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">GoSky AI</h1>
                <p className="text-xs text-gray-500">智能客服平台</p>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/admin" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium">管理後台</Link>
              <Link href="/chat" className="btn btn-primary btn-sm">免費試用</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-accent-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              AI Chatbot
              <span className="block gradient-text">
                Platform
              </span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-primary-600 mb-8">
              智能自動回覆系統
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              輕鬆設置智能客服機器人，24/7自動回覆客戶問題，提升服務效率，節省人力成本
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <div className="group">
                <Link href="/chat" className="btn btn-primary btn-xl group">
                  <div className="animate-pulse">
                    <Sparkles className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  </div>
                  免費試用
                </Link>
              </div>
              <div>
                <Link href="/admin" className="btn btn-outline btn-xl">
                  管理後台
                </Link>
              </div>
            </div>
            
            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: Zap,
                  title: "即時回覆",
                  description: "秒級響應客戶問題",
                  color: "primary",
                  delay: 0
                },
                {
                  icon: Shield,
                  title: "智能學習",
                  description: "AI持續優化回答品質",
                  color: "accent",
                  delay: 0.1
                },
                {
                  icon: Globe,
                  title: "多平台支援",
                  description: "整合各種客服渠道",
                  color: "success",
                  delay: 0.2
                }
              ].map((feature, index) => (
                <div 
                  key={feature.title}
                  className="card p-6 text-center card-hover group hover:scale-105 hover:-translate-y-1 transition-all duration-200"
                >
                  <div 
                    className={`bg-${feature.color}-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:rotate-360 transition-transform duration-600`}
                  >
                    <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              做行銷就夠累了，還要回粉專訊息當客服？
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              粉專私訊問的問題每次都千篇一律，回覆既浪費時間又沒效率，讓AI幫您解決這些煩惱
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card p-8 text-center card-hover group">
              <div className="bg-error-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <MessageCircle className="h-10 w-10 text-error-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">客服訊息混亂</h3>
              <p className="text-gray-600 leading-relaxed">無法集中管理回覆慢了、錯了還要被咎責，影響品牌形象</p>
            </div>
            <div className="card p-8 text-center card-hover group">
              <div className="bg-warning-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Clock className="h-10 w-10 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 待命壓力</h3>
              <p className="text-gray-600 leading-relaxed">不及時回覆私訊就錯過了商機，但很難 24/7 手動回覆</p>
            </div>
            <div className="card p-8 text-center card-hover group">
              <div className="bg-primary-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Users className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">重複性工作</h3>
              <p className="text-gray-600 leading-relaxed">行銷還要兼顧客服，重複回答相同問題，效率低下</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">驚人的成效數據</h2>
            <p className="text-xl text-primary-100">使用GoSky AI的企業都獲得了顯著提升</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="card glass p-8 card-hover">
              <div className="text-5xl font-bold mb-4 text-white">97%</div>
              <div className="text-primary-100 text-lg font-medium">推播平均開啟率</div>
              <div className="text-primary-200 text-sm mt-2">比傳統方式提升3倍</div>
            </div>
            <div className="card glass p-8 card-hover">
              <div className="text-5xl font-bold mb-4 text-white">60%</div>
              <div className="text-primary-100 text-lg font-medium">客服工作量減少</div>
              <div className="text-primary-200 text-sm mt-2">釋放人力專注核心業務</div>
            </div>
            <div className="card glass p-8 card-hover">
              <div className="text-5xl font-bold mb-4 text-white">40%</div>
              <div className="text-primary-100 text-lg font-medium">社群互動率提升</div>
              <div className="text-primary-200 text-sm mt-2">即時回覆提升用戶滿意度</div>
            </div>
            <div className="card glass p-8 card-hover">
              <div className="text-5xl font-bold mb-4 text-white">80%</div>
              <div className="text-primary-100 text-lg font-medium">廣告預算節省</div>
              <div className="text-primary-200 text-sm mt-2">降低獲客成本</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">核心功能</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              GoSky AI #nocode Chatbot 平台創建自動化機器人僅需 10 分鐘，無需程式設計背景
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-8 text-center card-hover group">
              <div className="bg-primary-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <MessageCircle className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">FAQ 自動回覆</h3>
              <p className="text-gray-600 leading-relaxed">引導客戶選擇問題並及時獲得解答，解決 60% 常見問題私訊</p>
            </div>

            <div className="card p-8 text-center card-hover group">
              <div className="bg-success-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Clock className="h-10 w-10 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 即時自動回覆</h3>
              <p className="text-gray-600 leading-relaxed">客戶私訊時馬上得到及時回覆，不用守在手機、電腦前隨時待命</p>
            </div>

            <div className="card p-8 text-center card-hover group">
              <div className="bg-accent-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Users className="h-10 w-10 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">集中真人客服渠道</h3>
              <p className="text-gray-600 leading-relaxed">若無法找到答案，設置引導至真人客服的渠道，集中管理客服案件</p>
            </div>

            <div className="card p-8 text-center card-hover group">
              <div className="bg-warning-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <BarChart3 className="h-10 w-10 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">留言自動回覆</h3>
              <p className="text-gray-600 leading-relaxed">機器人自動回覆增加互動率外，還能將留言的粉絲導入私訊互動</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl font-bold mb-6">Chatbot 新平台免費試用中！</h2>
          <p className="text-xl text-primary-100 mb-12">打造專屬聊天機器人趁現在！立即體驗AI智能客服的強大功能</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/chat" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-large group">
              <Sparkles className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              免費試用
            </Link>
            <Link href="/admin" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold">
              價格方案
            </Link>
          </div>
          <p className="text-primary-200 text-sm mt-8">無需信用卡，立即開始使用</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-xl">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">GoSky AI</span>
                  <p className="text-xs text-gray-400">智能客服平台</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">讓AI為您的業務提供24/7智能客服解決方案，提升客戶滿意度與營運效率。</p>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">產品與服務</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">AI Chatbot 平台</li>
                <li className="hover:text-white transition-colors cursor-pointer">社群會員管理</li>
                <li className="hover:text-white transition-colors cursor-pointer">精準廣告投放</li>
                <li className="hover:text-white transition-colors cursor-pointer">智能客服</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">解決方案</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">獲客｜廣告投放</li>
                <li className="hover:text-white transition-colors cursor-pointer">互動｜提升社群互動</li>
                <li className="hover:text-white transition-colors cursor-pointer">客服｜私訊自動回覆</li>
                <li className="hover:text-white transition-colors cursor-pointer">轉換｜再行銷</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">聯繫我們</h3>
              <div className="space-y-3 text-gray-400">
                <p className="hover:text-white transition-colors cursor-pointer">免費試用</p>
                <p className="hover:text-white transition-colors cursor-pointer">技術支援</p>
                <p className="hover:text-white transition-colors cursor-pointer">合作夥伴</p>
                <p className="hover:text-white transition-colors cursor-pointer">隱私政策</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2025 GoSky AI Inc. 版權所有</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">服務條款</span>
                <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">隱私政策</span>
                <span className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">Cookie 政策</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}