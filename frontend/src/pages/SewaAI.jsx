import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { BoudhanathIcon, SwayambhunathIcon, MountainIllustration } from '../components/ui/NepaliIcons'
import { 
  Send, 
  MessageCircle, 
  Bot, 
  User, 
  Sparkles, 
  TrendingUp, 
  Shield,
  Lightbulb,
  Heart
} from 'lucide-react'

const SewaAI = () => {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Welcome message
    const welcomeMessage = {
      id: 1,
      type: 'ai',
      message: i18n.language === 'ne' 
        ? 'नमस्ते! म SewaAI हुँ। तपाईंलाई कसरी सहयोग गर्न सक्छु? तपाईं बुकिङ, भुक्तानी, प्रदायकहरू, वा खाता मुद्दाहरूको बारेमा सोध्न सक्नुहुन्छ।'
        : 'Namaste! I\'m SewaAI. How can I help you today? You can ask me about bookings, payments, providers, or account issues.',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [i18n.language])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/sewai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          user_id: user?.id
        })
      })

      const data = await response.json()
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: data.response || (i18n.language === 'ne' 
          ? 'माफ गर्नुहोस्, मैले बुझिन। के तपाईं फेरि प्रयास गर्न सक्नुहुन्छ?'
          : 'Sorry, I didn\'t understand. Can you try again?'),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: i18n.language === 'ne' 
          ? 'माफ गर्नुहोस्, केही गलत भयो। कृपया फेरि प्रयास गर्नुहोस्।'
          : 'Sorry, something went wrong. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    {
      icon: MessageCircle,
      label: i18n.language === 'ne' ? 'बुकिङ सहायता' : 'Booking Help',
      message: i18n.language === 'ne' ? 'मलाई बुकिङ गर्न मद्दत चाहिन्छ' : 'I need help with booking'
    },
    {
      icon: Shield,
      label: i18n.language === 'ne' ? 'भुक्तानी सहायता' : 'Payment Help',
      message: i18n.language === 'ne' ? 'भुक्तानी समस्याको बारेमा' : 'I have a payment issue'
    },
    {
      icon: TrendingUp,
      label: i18n.language === 'ne' ? 'सिफारिसहरू' : 'Recommendations',
      message: i18n.language === 'ne' ? 'मलाई सेवा सिफारिसहरू चाहिन्छ' : 'I need service recommendations'
    },
    {
      icon: Lightbulb,
      label: i18n.language === 'ne' ? 'सुझावहरू' : 'Tips',
      message: i18n.language === 'ne' ? 'मलाई केही सुझावहरू दिनुहोस्' : 'Give me some tips'
    }
  ]

  const handleQuickAction = (message) => {
    setInputMessage(message)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="nepal-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <MountainIllustration className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-4 left-4 opacity-10">
          <BoudhanathIcon className="w-20 h-20" />
        </div>
        <div className="absolute top-8 right-8 opacity-10">
          <SwayambhunathIcon className="w-24 h-24" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mr-4">
              <Bot className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {i18n.language === 'ne' ? 'सेवाAI' : 'SewaAI'}
              </h1>
              <p className="text-white/80 text-lg">
                {i18n.language === 'ne' 
                  ? 'तपाईंको बुद्धिमान् सहायक'
                  : 'Your Intelligent Assistant'
                }
              </p>
            </div>
          </div>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            {i18n.language === 'ne'
              ? 'मसँग बुकिङ, भुक्तानी, सेवा प्रदायकहरू, र अन्य कुनै पनि प्रश्नहरूको बारेमा कुरा गर्नुहोस्।'
              : 'Chat with me about bookings, payments, service providers, and any other questions you have.'
            }
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              {i18n.language === 'ne' ? 'छिटो सहायता' : 'Quick Help'}
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.message)}
                    className="nepal-card p-4 text-center hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary/20 to-accent/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{action.label}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="nepal-card p-6 h-96 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-gradient-to-br from-accent/50 to-primary/20'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`${
                    message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    <div className={`text-xs mt-2 opacity-70 ${
                      message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-xs">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/50 to-primary/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="chat-bubble-ai">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="nepal-search flex items-center">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={i18n.language === 'ne' 
                ? 'आफ्नो सन्देश टाइप गर्नुहोस्...'
                : 'Type your message...'
              }
              className="flex-1 bg-transparent border-none outline-none resize-none max-h-20 placeholder-gray-400"
              rows="1"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="ml-4 p-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="nepal-card p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/30 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {i18n.language === 'ne' ? 'स्मार्ट सहायता' : 'Smart Assistance'}
            </h3>
            <p className="text-sm text-gray-600">
              {i18n.language === 'ne'
                ? 'AI-संचालित सहायताले तपाईंका प्रश्नहरूको तुरुन्त जवाफ दिन्छ'
                : 'AI-powered assistance provides instant answers to your questions'
              }
            </p>
          </div>

          <div className="nepal-card p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/30 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {i18n.language === 'ne' ? 'व्यक्तिगत सिफारिसहरू' : 'Personal Recommendations'}
            </h3>
            <p className="text-sm text-gray-600">
              {i18n.language === 'ne'
                ? 'तपाईंको इतिहासमा आधारित व्यक्तिगत सेवा सिफारिसहरू पाउनुहोस्'
                : 'Get personalized service recommendations based on your history'
              }
            </p>
          </div>

          <div className="nepal-card p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/30 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {i18n.language === 'ne' ? '२४/७ उपलब्ध' : '24/7 Available'}
            </h3>
            <p className="text-sm text-gray-600">
              {i18n.language === 'ne'
                ? 'दिन रात कुनै पनि समयमा सहायता पाउनुहोस्'
                : 'Get help anytime, day or night'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SewaAI