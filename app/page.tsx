'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CloudIcon, 
  HashtagIcon, 
  SparklesIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { mockData, filterData, getHashtagStats } from '@/lib/data'
import { DataItem, ServiceConnection } from '@/lib/types'
import { AIAssistant } from '@/components/AIAssistant'
import { dataProcessor, serviceAPI } from '@/lib/api'

export default function HomePage() {
  // State management
  const [connectedServices, setConnectedServices] = useState<ServiceConnection[]>([])
  const [dataItems, setDataItems] = useState<DataItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'analytics'>('dashboard')
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)

  // Services configuration with proper branding
  const services = [
    { 
      id: 'gmail', 
      name: 'Gmail', 
      icon: EnvelopeIcon, 
      color: 'bg-red-600',
      logo: 'G',
      description: 'Connect your Gmail account'
    },
    { 
      id: 'slack', 
      name: 'Slack', 
      icon: ChatBubbleLeftRightIcon, 
      color: 'bg-purple-600',
      logo: 'S',
      description: 'Sync your Slack workspace'
    },
    { 
      id: 'notion', 
      name: 'Notion', 
      icon: DocumentTextIcon, 
      color: 'bg-black',
      logo: 'N',
      description: 'Link your Notion workspace'
    }
  ]

  // Initialize data
  useEffect(() => {
    setDataItems(mockData)
  }, [])

  // Filter data based on search and filters
  const filteredData = filterData(
    dataItems,
    searchQuery,
    selectedCategories,
    selectedSources,
    selectedPriorities
  )

  // Get hashtag statistics using centralized processing
  const [hashtagStats, setHashtagStats] = useState<any[]>([])

  // Update hashtag stats when data changes
  useEffect(() => {
    const updateStats = async () => {
      try {
        const stats = await dataProcessor.calculateHashtagStats(dataItems)
        setHashtagStats(stats)
      } catch (error) {
        console.error('Failed to calculate hashtag stats:', error)
        // Fallback to local calculation
        setHashtagStats(getHashtagStats(dataItems))
      }
    }
    
    updateStats()
  }, [dataItems])

  // Sync all connected services
  const syncAllServices = async () => {
    try {
      showNotification('Starting service synchronization...')
      
      const results = await serviceAPI.syncAllServices()
      let totalNewItems = 0
      
      // Process data from each service
      for (const [service, data] of Object.entries(results)) {
        if (data.length > 0) {
          const processedData = await processServiceData(data, service)
          setDataItems(prev => [...prev, ...processedData])
          totalNewItems += processedData.length
        }
      }
      
      if (totalNewItems > 0) {
        showNotification(`Successfully synced ${totalNewItems} new items from all services!`)
      } else {
        showNotification('All services are up to date!')
      }
      
    } catch (error) {
      console.error('Service synchronization failed:', error)
      showNotification('Service synchronization failed. Please try again.')
    }
  }

  // Connect service with real API integration
  const connectService = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (!service) return

    // Add to connected services
    setConnectedServices(prev => [
      ...prev.filter(s => s.id !== serviceId),
      { 
        id: serviceId, 
        name: service.name, 
        status: 'connecting'
      }
    ])

    try {
      // Use real API service integration
      let credentials
      switch (serviceId) {
        case 'gmail':
          credentials = await serviceAPI.connectGmail('mock_auth_code')
          break
        case 'slack':
          credentials = await serviceAPI.connectSlack('mock_auth_code')
          break
        case 'notion':
          credentials = await serviceAPI.connectNotion('mock_auth_code')
          break
        default:
          throw new Error('Unknown service')
      }

      // Update connection status
      setConnectedServices(prev => 
        prev.map(s => 
          s.id === serviceId 
            ? { ...s, status: 'connected', lastSync: new Date() }
            : s
        )
      )

      showNotification(`Successfully connected to ${service.name}!`)
      
      // Fetch initial data from the service
      await fetchServiceData(serviceId)
      
    } catch (error) {
      console.error(`Failed to connect to ${service.name}:`, error)
      setConnectedServices(prev => 
        prev.map(s => 
          s.id === serviceId 
            ? { ...s, status: 'disconnected' }
            : s
        )
      )
      showNotification(`Failed to connect to ${service.name}. Please try again.`)
    }
  }

  // Fetch data from connected service
  const fetchServiceData = async (serviceId: string) => {
    try {
      let serviceData: any[] = []
      
      switch (serviceId) {
        case 'gmail':
          const gmailCredentials = serviceAPI.getServiceStatus('gmail') === 'connected' 
            ? { accessToken: 'mock', expiresAt: new Date(Date.now() + 3600000), scope: [] }
            : null
          if (gmailCredentials) {
            serviceData = await serviceAPI.fetchGmailData(gmailCredentials, 50)
          }
          break
        case 'slack':
          const slackCredentials = serviceAPI.getServiceStatus('slack') === 'connected'
            ? { accessToken: 'mock', expiresAt: new Date(Date.now() + 7200000), scope: [] }
            : null
          if (slackCredentials) {
            serviceData = await serviceAPI.fetchSlackData(slackCredentials, ['general'])
          }
          break
        case 'notion':
          const notionCredentials = serviceAPI.getServiceStatus('notion') === 'connected'
            ? { accessToken: 'mock', expiresAt: new Date(Date.now() + 86400000), scope: [] }
            : null
          if (notionCredentials) {
            serviceData = await serviceAPI.fetchNotionData(notionCredentials)
          }
          break
      }

      if (serviceData.length > 0) {
        // Process and add new data
        const processedData = await processServiceData(serviceData, serviceId)
        setDataItems(prev => [...prev, ...processedData])
        showNotification(`Fetched ${serviceData.length} new items from ${serviceId}`)
      }
    } catch (error) {
      console.error(`Failed to fetch data from ${serviceId}:`, error)
    }
  }

  // Process service data with centralized processing
  const processServiceData = async (rawData: any[], source: string): Promise<DataItem[]> => {
    const processedItems: DataItem[] = []
    
    for (const item of rawData) {
      try {
        // Use centralized hashtag extraction
        const hashtags = await dataProcessor.extractHashtags(
          `${item.title || item.subject || item.text} ${item.content || ''}`, 
          source
        )
        
        // Create standardized data item
        const processedItem: DataItem = {
          id: item.id,
          title: item.title || item.subject || item.text || 'Untitled',
          content: item.content || item.text || item.subject || '',
          source: source as 'gmail' | 'slack' | 'notion',
          channel: item.channel || item.labels?.join(', ') || '',
          author: item.author || item.user || item.sender || 'Unknown',
          timestamp: item.timestamp || item.lastEdited || new Date(),
          hashtags: hashtags,
          category: determineCategory(hashtags, source),
          priority: determinePriority(hashtags, source),
          sentiment: determineSentiment(item.content || item.text || '')
        }
        
        processedItems.push(processedItem)
      } catch (error) {
        console.error('Error processing item:', error)
      }
    }
    
    return processedItems
  }

  // Determine category based on hashtags and source
  const determineCategory = (hashtags: string[], source: string): string => {
    const categoryKeywords = {
      'Business': ['#urgent', '#meeting', '#budget', '#approval', '#strategy'],
      'Product': ['#product', '#roadmap', '#features', '#development'],
      'Team': ['#team', '#collaboration', '#daily', '#standup'],
      'Technical': ['#tech', '#api', '#documentation', '#code'],
      'Sales': ['#client', '#enterprise', '#demo', '#followup'],
      'Design': ['#design', '#ui', '#components', '#ux']
    }

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (hashtags.some(tag => keywords.includes(tag))) {
        return category
      }
    }

    // Default categories based on source
    const sourceDefaults = {
      'gmail': 'Communication',
      'slack': 'Team',
      'notion': 'Documentation'
    }
    
    return sourceDefaults[source as keyof typeof sourceDefaults] || 'General'
  }

  // Determine priority based on hashtags and content
  const determinePriority = (hashtags: string[], source: string): 'High' | 'Medium' | 'Low' => {
    const highPriorityTags = ['#urgent', '#critical', '#asap', '#emergency']
    const mediumPriorityTags = ['#important', '#followup', '#meeting', '#deadline']
    
    if (hashtags.some(tag => highPriorityTags.includes(tag))) {
      return 'High'
    }
    
    if (hashtags.some(tag => mediumPriorityTags.includes(tag))) {
      return 'Medium'
    }
    
    return 'Low'
  }

  // Determine sentiment based on content
  const determineSentiment = (content: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['great', 'excellent', 'amazing', 'success', 'win', 'good', 'happy']
    const negativeWords = ['bad', 'terrible', 'failed', 'error', 'problem', 'issue', 'urgent']
    
    const contentLower = content.toLowerCase()
    const positiveCount = positiveWords.filter(word => contentLower.includes(word)).length
    const negativeCount = negativeWords.filter(word => contentLower.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  // Disconnect service using API
  const disconnectService = async (serviceId: string) => {
    try {
      // Use API to disconnect service
      serviceAPI.disconnectService(serviceId)
      
      // Update local state
      setConnectedServices(prev => prev.filter(s => s.id !== serviceId))
      
      showNotification(`Successfully disconnected from ${serviceId}`)
    } catch (error) {
      console.error(`Failed to disconnect from ${serviceId}:`, error)
      showNotification(`Failed to disconnect from ${serviceId}`)
    }
  }

  // Show notification
  const showNotification = (message: string) => {
    // Create a temporary notification element
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300'
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full')
    }, 100)
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full')
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <HashtagIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Hashtag Revolution</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={syncAllServices}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                  title="Sync all connected services"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  <span>Sync All</span>
                </button>
                <span className="text-sm text-gray-300">Demo Mode</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-glow"></div>
              </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Hashtag Your Life
          </h1>
          <p className="text-2xl md:text-3xl text-gray-200 mb-4 font-medium">
            One click access to all your data
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed">
            Simply centralized. Make faster, more productive decisions. Connect Gmail, Slack, and Notion with intelligent hashtag extraction and AI-powered insights.
          </p>
        </motion.div>

        {/* Service Connections */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Connect Your Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => {
              const isConnected = connectedServices.some(s => s.id === service.id && s.status === 'connected')
              const isConnecting = connectedServices.some(s => s.id === service.id && s.status === 'connecting')
              
              return (
                                                  <motion.div
                   key={service.id}
                   whileHover={{ scale: 1.02, y: -2 }}
                   whileTap={{ scale: 0.98 }}
                   className={`card card-hover cursor-pointer transition-all duration-300 ${
                     isConnected ? 'ring-2 ring-red-500 shadow-red-500/20' : ''
                   }`}
                   onClick={() => !isConnected && !isConnecting && connectService(service.id)}
                 >
                   <div className="flex items-center justify-between mb-6">
                     <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                       <span className="text-xl font-bold text-white">{service.logo}</span>
                     </div>
                     {isConnecting && (
                       <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
                     )}
                     {isConnected && (
                       <button
                         onClick={(e) => {
                           e.stopPropagation()
                           disconnectService(service.id)
                         }}
                         className="text-gray-400 hover:text-red-500 transition-colors"
                       >
                         <XMarkIcon className="w-6 h-6" />
                       </button>
                     )}
                   </div>
                   
                   <h3 className="text-2xl font-bold text-white mb-3">
                     {service.name}
                   </h3>
                   
                   <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                     {service.description}
                   </p>
                   
                   <div className="flex items-center justify-between">
                     <span className={`text-sm font-semibold ${
                       isConnected ? 'text-red-400' : 'text-gray-400'
                     }`}>
                       {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Click to connect'}
                     </span>
                     {isConnected && <CheckCircleIcon className="w-6 h-6 text-red-400" />}
                   </div>
                 </motion.div>
              )
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
            { id: 'search', label: 'Search & Filter', icon: MagnifyingGlassIcon },
            { id: 'analytics', label: 'Analytics', icon: SparklesIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
                             className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                 activeTab === tab.id
                   ? 'bg-gray-700 text-red-400 shadow-sm'
                   : 'text-gray-300 hover:text-white'
               }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Metrics */}
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <motion.div 
                 className="card cursor-pointer hover:shadow-lg transition-shadow"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 onClick={() => {
                   setActiveTab('search')
                   setSelectedCategories([])
                   setSelectedSources([])
                   setSelectedPriorities([])
                   showNotification('Showing all data items')
                 }}
               >
                 <div className="flex items-center">
                   <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                     <DocumentTextIcon className="w-6 h-6 text-blue-400" />
                   </div>
                   <div className="ml-4">
                     <p className="text-sm font-medium text-gray-400">Total Items</p>
                     <p className="text-3xl font-bold text-white">{dataItems.length}</p>
                   </div>
                 </div>
               </motion.div>
               
               <motion.div 
                 className="card cursor-pointer hover:shadow-lg transition-shadow"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 onClick={() => {
                   setActiveTab('analytics')
                   showNotification('Showing hashtag analytics')
                 }}
               >
                 <div className="flex items-center">
                   <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                     <HashtagIcon className="w-6 h-6 text-purple-400" />
                   </div>
                   <div className="ml-4">
                     <p className="text-sm font-medium text-gray-400">Unique Hashtags</p>
                     <p className="text-3xl font-bold text-white">{hashtagStats.length}</p>
                   </div>
                 </div>
               </motion.div>
               
               <motion.div 
                 className="card cursor-pointer hover:shadow-lg transition-shadow"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 onClick={() => {
                   showNotification(`Connected services: ${connectedServices.filter(s => s.status === 'connected').map(s => s.name).join(', ')}`)
                 }}
               >
                 <div className="flex items-center">
                   <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                     <CloudIcon className="w-6 h-6 text-green-400" />
                   </div>
                   <div className="ml-4">
                     <p className="text-sm font-medium text-gray-400">Connected Services</p>
                     <p className="text-3xl font-bold text-white">
                       {connectedServices.filter(s => s.status === 'connected').length}
                     </p>
                   </div>
                 </div>
               </motion.div>
               
               <motion.div 
                 className="card cursor-pointer hover:shadow-lg transition-shadow"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 onClick={() => {
                   setActiveTab('search')
                   setSelectedPriorities(['High'])
                   showNotification('Showing high priority items')
                 }}
               >
                 <div className="flex items-center">
                   <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                     <SparklesIcon className="w-6 h-6 text-red-400" />
                   </div>
                   <div className="ml-4">
                     <p className="text-sm font-medium text-gray-400">High Priority</p>
                     <p className="text-3xl font-bold text-white">
                       {dataItems.filter(item => item.priority === 'High').length}
                     </p>
                   </div>
                 </div>
               </motion.div>
             </div>

            {/* Recent Items */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Items</h3>
                <button
                  onClick={() => {
                    setActiveTab('search')
                    showNotification('Switched to search view')
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {filteredData.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setActiveTab('search')
                      setSearchQuery(item.title.split(' ')[0])
                      showNotification(`Searching for "${item.title.split(' ')[0]}"`)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.content}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="capitalize">{item.source}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{item.timestamp.toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {item.hashtags.map((hashtag) => (
                            <span 
                              key={hashtag} 
                              className="hashtag cursor-pointer hover:bg-blue-200 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveTab('search')
                                setSearchQuery(hashtag)
                                showNotification(`Searching for #${hashtag}`)
                              }}
                              title={`Click to search for #${hashtag}`}
                            >
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col space-y-2">
                        <span className={`source-badge ${item.source}-badge`}>
                          {item.source.toUpperCase()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigator.clipboard.writeText(item.title)
                            showNotification('Title copied to clipboard!')
                          }}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded hover:bg-gray-100"
                          title="Copy title"
                        >
                          <DocumentTextIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
                         {/* Search Bar */}
             <div className="card">
               <h3 className="text-xl font-bold text-white mb-4">Search Your Data</h3>
               <div className="relative">
                 <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                 <input
                   type="text"
                   placeholder="Search across all content, hashtags, or keywords..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="input-field pl-12 text-lg"
                 />
               </div>
             </div>

            {/* Filters */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                  <select
                    multiple
                    value={selectedCategories}
                    onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, option => option.value))}
                    className="input-field"
                  >
                    {Array.from(new Set(dataItems.map(item => item.category))).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sources</label>
                  <select
                    multiple
                    value={selectedSources}
                    onChange={(e) => setSelectedSources(Array.from(e.target.selectedOptions, option => option.value))}
                    className="input-field"
                  >
                    {Array.from(new Set(dataItems.map(item => item.source))).map(source => (
                      <option key={source} value={source}>{source.charAt(0).toUpperCase() + source.slice(1)}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    multiple
                    value={selectedPriorities}
                    onChange={(e) => setSelectedPriorities(Array.from(e.target.selectedOptions, option => option.value))}
                    className="input-field"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Results ({filteredData.length} items)
                </h3>
                {filteredData.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const dataStr = JSON.stringify(filteredData, null, 2)
                        const dataBlob = new Blob([dataStr], { type: 'application/json' })
                        const url = URL.createObjectURL(dataBlob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = 'search-results.json'
                        link.click()
                        URL.revokeObjectURL(url)
                        showNotification('Search results exported!')
                      }}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      Export Results
                    </button>
                    <button
                      onClick={() => {
                        const csvContent = [
                          ['Title', 'Content', 'Source', 'Category', 'Priority', 'Hashtags', 'Timestamp'],
                          ...filteredData.map(item => [
                            item.title,
                            item.content,
                            item.source,
                            item.category,
                            item.priority,
                            item.hashtags.join(', '),
                            item.timestamp.toLocaleDateString()
                          ])
                        ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')
                        
                        const dataBlob = new Blob([csvContent], { type: 'text/csv' })
                        const url = URL.createObjectURL(dataBlob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = 'search-results.csv'
                        link.click()
                        URL.revokeObjectURL(url)
                        showNotification('Search results exported as CSV!')
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Export CSV
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {filteredData.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{item.content}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="capitalize">{item.source}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{item.priority}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {item.hashtags.map((hashtag) => (
                            <span 
                              key={hashtag} 
                              className="hashtag cursor-pointer hover:bg-blue-200 transition-colors"
                              onClick={() => {
                                setSearchQuery(hashtag)
                                showNotification(`Searching for #${hashtag}`)
                              }}
                              title={`Click to search for #${hashtag}`}
                            >
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col space-y-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.title)
                            showNotification('Title copied to clipboard!')
                          }}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded hover:bg-gray-100"
                          title="Copy title"
                        >
                          <DocumentTextIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const shareText = `${item.title}\n\n${item.content}\n\nHashtags: ${item.hashtags.join(', ')}`
                            navigator.clipboard.writeText(shareText)
                            showNotification('Content copied to clipboard!')
                          }}
                          className="text-gray-400 hover:text-green-500 transition-colors p-1 rounded hover:bg-gray-100"
                          title="Copy content"
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
                         {/* Hashtag Cloud */}
             <div className="card">
               <h3 className="text-xl font-bold text-white mb-6">Popular Hashtags</h3>
              <div className="flex flex-wrap gap-3">
                {hashtagStats.slice(0, 15).map((stat, index) => (
                  <motion.div
                    key={stat.hashtag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hashtag cursor-pointer hover:bg-blue-200 transition-all duration-200 hover:scale-110"
                    onClick={() => {
                      setActiveTab('search')
                      setSearchQuery(stat.hashtag)
                      showNotification(`Searching for #${stat.hashtag}`)
                    }}
                    title={`Click to search for #${stat.hashtag}`}
                  >
                    {stat.hashtag}
                    <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded-full">
                      {stat.count}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(hashtagStats, null, 2)
                    const dataBlob = new Blob([dataStr], { type: 'application/json' })
                    const url = URL.createObjectURL(dataBlob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = 'hashtag-stats.json'
                    link.click()
                    URL.revokeObjectURL(url)
                    showNotification('Hashtag statistics exported!')
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Export Hashtag Data
                </button>
              </div>
            </div>

                         {/* Source Distribution */}
             <div className="grid md:grid-cols-2 gap-6">
               <div className="card">
                 <h3 className="text-lg font-semibold text-white mb-4">Data by Source</h3>
                <div className="space-y-3">
                  {Array.from(new Set(dataItems.map(item => item.source))).map(source => {
                    const count = dataItems.filter(item => item.source === source).length
                    return (
                      <div 
                        key={source} 
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => {
                          setActiveTab('search')
                          setSelectedSources([source])
                          showNotification(`Filtering by source: ${source}`)
                        }}
                        title={`Click to filter by ${source}`}
                      >
                        <span className="capitalize font-medium">{source}</span>
                        <span className="text-lg font-bold text-gray-900">{count}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      const sourceData = Array.from(new Set(dataItems.map(item => item.source))).map(source => ({
                        source,
                        count: dataItems.filter(item => item.source === source).length
                      }))
                      const dataStr = JSON.stringify(sourceData, null, 2)
                      const dataBlob = new Blob([dataStr], { type: 'application/json' })
                      const url = URL.createObjectURL(dataBlob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = 'source-distribution.json'
                      link.click()
                      URL.revokeObjectURL(url)
                      showNotification('Source distribution exported!')
                    }}
                    className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors"
                  >
                    Export Data
                  </button>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Data by Category</h3>
                <div className="space-y-3">
                  {Array.from(new Set(dataItems.map(item => item.category))).map(category => {
                    const count = dataItems.filter(item => item.category === category).length
                    return (
                      <div 
                        key={category} 
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => {
                          setActiveTab('search')
                          setSelectedCategories([category])
                          showNotification(`Filtering by category: ${category}`)
                        }}
                        title={`Click to filter by ${category}`}
                      >
                        <span className="font-medium">{category}</span>
                        <span className="text-lg font-bold text-gray-900">{count}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      const categoryData = Array.from(new Set(dataItems.map(item => item.category))).map(category => ({
                        category,
                        count: dataItems.filter(item => item.category === category).length
                      }))
                      const dataStr = JSON.stringify(categoryData, null, 2)
                      const dataBlob = new Blob([dataStr], { type: 'application/json' })
                      const url = URL.createObjectURL(dataBlob)
                      const link = document.createElement('a')
                      link.href = url
                      link.download = 'category-distribution.json'
                      link.click()
                      URL.revokeObjectURL(url)
                      showNotification('Category distribution exported!')
                    }}
                    className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors"
                  >
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

             {/* AI Assistant Button */}
       <motion.button
         whileHover={{ scale: 1.1, y: -2 }}
         whileTap={{ scale: 0.95 }}
         onClick={() => setIsAIAssistantOpen(true)}
         className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-red-500/25 transition-all duration-200 z-40 border-2 border-white/10"
       >
         <SparklesIcon className="w-7 h-7" />
       </motion.button>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onSearch={(query) => {
          setSearchQuery(query)
          setActiveTab('search')
          setIsAIAssistantOpen(false)
        }}
      />
    </div>
  )
} 