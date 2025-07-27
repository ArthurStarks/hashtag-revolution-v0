'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  LightBulbIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string) => void
}

export function AIAssistant({ isOpen, onClose, onSearch }: AIAssistantProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello, I'm Nova, your AI assistant. I can help you search across all your connected services and find exactly what you need.",
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'bot',
      content: "I've detected some urgent items in your data. Would you like me to help you find all high-priority content?",
      timestamp: new Date(),
      suggestions: ['Show urgent items', 'Find meetings', 'Search by hashtag']
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: `I found ${Math.floor(Math.random() * 10) + 3} items related to "${message}". Here are the most relevant ones:`,
          suggestions: ['Show all results', 'Filter by source', 'Export data']
        },
        {
          content: "I've analyzed your data and found some interesting patterns. Would you like me to create a summary report?",
          suggestions: ['Generate report', 'Show analytics', 'Find trends']
        },
        {
          content: `I can help you with that. I've identified ${Math.floor(Math.random() * 5) + 2} hashtags that might be relevant.`,
          suggestions: ['Show hashtags', 'Search similar', 'Create alert']
        }
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot' as const,
        content: randomResponse.content,
        timestamp: new Date(),
        suggestions: randomResponse.suggestions
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 right-6 w-96 h-[500px] bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Nova</h3>
                <p className="text-xs text-gray-400">AI Assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[350px]">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-red-500/20 text-white' : 'bg-gray-700/50 text-gray-200'} rounded-2xl px-4 py-3`}>
                  <p className="text-sm">{message.content}</p>
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestion(suggestion)}
                          className="block w-full text-left text-xs bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 hover:text-white rounded-lg px-3 py-2 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-700/50 text-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="Ask Nova anything..."
                className="flex-1 input-field"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white p-2 rounded-lg transition-all duration-200"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 