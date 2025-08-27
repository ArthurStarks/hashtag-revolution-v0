'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CloudIcon, 
  HashtagIcon, 
  SparklesIcon,
  DocumentTextIcon,
  ChartBarIcon,
  TrendingUpIcon,
  UsersIcon,
  ClockIcon,
  FireIcon,
  StarIcon,
  BoltIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { DataItem, ServiceConnection, HashtagStats } from '@/lib/types'

interface InteractiveDashboardProps {
  dataItems: DataItem[]
  connectedServices: ServiceConnection[]
  hashtagStats: HashtagStats[]
  theme: 'dark' | 'light'
}

export function InteractiveDashboard({ 
  dataItems, 
  connectedServices, 
  hashtagStats, 
  theme 
}: InteractiveDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const [selectedMetric, setSelectedMetric] = useState<'items' | 'hashtags' | 'engagement' | 'growth'>('items')

  // Calculate metrics based on time range
  const getMetricsForTimeRange = () => {
    const now = new Date()
    let cutoffDate: Date
    
    switch (selectedTimeRange) {
      case '24h':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    const recentItems = dataItems.filter(item => item.timestamp >= cutoffDate)
    const recentHashtags = hashtagStats.filter(stat => 
      recentItems.some(item => item.hashtags.includes(stat.hashtag))
    )

    return {
      totalItems: recentItems.length,
      uniqueHashtags: recentHashtags.length,
      connectedServices: connectedServices.filter(s => s.status === 'connected').length,
      highPriority: recentItems.filter(item => item.priority === 'High').length,
      avgEngagement: recentItems.length > 0 ? Math.round(recentItems.reduce((acc, item) => acc + item.hashtags.length, 0) / recentItems.length) : 0,
      growthRate: calculateGrowthRate(recentItems, dataItems.length)
    }
  }

  const calculateGrowthRate = (recent: DataItem[], total: number) => {
    if (total === 0) return 0
    return Math.round((recent.length / total) * 100)
  }

  const metrics = getMetricsForTimeRange()

  // Get trending hashtags
  const trendingHashtags = hashtagStats
    .slice(0, 8)
    .sort((a, b) => b.count - a.count)

  // Get source distribution
  const sourceDistribution = dataItems.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get category distribution
  const categoryDistribution = dataItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get recent activity
  const recentActivity = dataItems
    .slice(0, 6)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Dashboard Overview
          </h2>
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
            {(['24h', '7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-red-500 text-white'
                    : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Items
                </p>
                <p className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {metrics.totalItems}
                </p>
                <p className={`text-xs ${
                  metrics.growthRate > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metrics.growthRate > 0 ? '+' : ''}{metrics.growthRate}% from total
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <HashtagIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Unique Hashtags
                </p>
                <p className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {metrics.uniqueHashtags}
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {Math.round((metrics.uniqueHashtags / hashtagStats.length) * 100)}% of total
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <CloudIcon className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Connected Services
                </p>
                <p className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {metrics.connectedServices}
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {Math.round((metrics.connectedServices / 3) * 100)}% of available
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                <FireIcon className="w-6 h-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  High Priority
                </p>
                <p className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {metrics.highPriority}
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {Math.round((metrics.highPriority / metrics.totalItems) * 100)}% of items
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trending Hashtags */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Trending Hashtags
          </h3>
          <TrendingUpIcon className={`w-6 h-6 ${
            theme === 'dark' ? 'text-green-400' : 'text-green-600'
          }`} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trendingHashtags.map((stat, index) => (
            <motion.div
              key={stat.hashtag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg text-center ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              } border ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } hover:border-red-500/50 transition-colors cursor-pointer`}
            >
              <div className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.hashtag}
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.count} uses
              </div>
              <div className="text-xs text-red-400 font-medium">
                {stat.sources.length} sources
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Source Distribution */}
        <div className="card">
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Data by Source
          </h3>
          <div className="space-y-3">
            {Object.entries(sourceDistribution).map(([source, count], index) => {
              const percentage = Math.round((count / dataItems.length) * 100)
              const color = source === 'gmail' ? 'bg-red-500' : 
                           source === 'slack' ? 'bg-purple-500' : 'bg-gray-500'
              
              return (
                <motion.div 
                  key={source}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${color}`} />
                    <span className={`capitalize font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {source}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {count}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
        
        {/* Category Distribution */}
        <div className="card">
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Data by Category
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryDistribution).map(([category, count], index) => {
              const percentage = Math.round((count / dataItems.length) * 100)
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500']
              const color = colors[index % colors.length]
              
              return (
                <motion.div 
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${color}`} />
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {count}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Recent Activity
          </h3>
          <ClockIcon className={`w-6 h-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
        </div>
        <div className="space-y-4">
          {recentActivity.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm mb-3 line-clamp-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.content}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="capitalize">{item.source}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.timestamp.toLocaleDateString()}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.priority === 'High' ? 'bg-red-100 text-red-800' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.hashtags.map((hashtag) => (
                      <span key={hashtag} className="hashtag">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="ml-4">
                  <span className={`source-badge ${item.source}-badge`}>
                    {item.source.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className={`text-xl font-bold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BoltIcon, label: 'Quick Add', color: 'bg-blue-500' },
            { icon: StarIcon, label: 'Favorites', color: 'bg-yellow-500' },
            { icon: UsersIcon, label: 'Team View', color: 'bg-green-500' },
            { icon: GlobeAltIcon, label: 'Export', color: 'bg-purple-500' }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg text-center transition-all duration-200 ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
              } border ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } hover:border-red-500/50`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
