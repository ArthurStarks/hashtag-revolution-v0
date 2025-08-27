'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChartBarIcon,
  TrendingUpIcon,
  PieChartIcon,
  BarChartIcon,
  LineChartIcon,
  CalendarIcon,
  ClockIcon,
  FireIcon,
  StarIcon,
  BoltIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { DataItem, HashtagStats } from '@/lib/types'

interface AnalyticsChartsProps {
  dataItems: DataItem[]
  hashtagStats: HashtagStats[]
  theme: 'dark' | 'light'
}

export function AnalyticsCharts({ 
  dataItems, 
  hashtagStats, 
  theme 
}: AnalyticsChartsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [selectedChart, setSelectedChart] = useState<'trends' | 'distribution' | 'engagement' | 'performance'>('trends')

  // Calculate analytics data based on time range
  const getAnalyticsData = () => {
    const now = new Date()
    let cutoffDate: Date
    
    switch (selectedTimeRange) {
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    const recentItems = dataItems.filter(item => item.timestamp >= cutoffDate)
    
    // Source distribution
    const sourceData = recentItems.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Category distribution
    const categoryData = recentItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Priority distribution
    const priorityData = recentItems.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Hashtag performance
    const hashtagPerformance = hashtagStats
      .slice(0, 10)
      .sort((a, b) => b.count - a.count)
      .map(stat => ({
        hashtag: stat.hashtag,
        count: stat.count,
        sources: stat.sources.length,
        engagement: Math.round(stat.count * (stat.sources.length / 3) * 10) / 10
      }))

    // Time series data (last 7 days)
    const timeSeriesData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000)
      const dayItems = recentItems.filter(item => 
        item.timestamp.toDateString() === date.toDateString()
      )
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        items: dayItems.length,
        hashtags: dayItems.reduce((acc, item) => acc + item.hashtags.length, 0),
        highPriority: dayItems.filter(item => item.priority === 'High').length
      }
    })

    return {
      sourceData,
      categoryData,
      priorityData,
      hashtagPerformance,
      timeSeriesData,
      totalItems: recentItems.length,
      totalHashtags: hashtagStats.length,
      avgHashtagsPerItem: recentItems.length > 0 ? 
        Math.round(recentItems.reduce((acc, item) => acc + item.hashtags.length, 0) / recentItems.length * 10) / 10 : 0,
      highPriorityRate: recentItems.length > 0 ? 
        Math.round((recentItems.filter(item => item.priority === 'High').length / recentItems.length) * 100) : 0
    }
  }

  const analyticsData = getAnalyticsData()

  // Chart configuration
  const chartConfigs = {
    trends: {
      icon: TrendingUpIcon,
      title: 'Trends & Growth',
      description: 'Track your data growth over time'
    },
    distribution: {
      icon: PieChartIcon,
      title: 'Data Distribution',
      description: 'See how your data is distributed across sources and categories'
    },
    engagement: {
      icon: HeartIcon,
      title: 'Engagement Metrics',
      description: 'Monitor hashtag performance and user engagement'
    },
    performance: {
      icon: BoltIcon,
      title: 'Performance Insights',
      description: 'Key performance indicators and analytics'
    }
  }

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Analytics & Insights
            </h2>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Deep dive into your data with comprehensive analytics and visualizations
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
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
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-blue-400" />
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
                {analyticsData.totalItems}
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Last {selectedTimeRange}
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
              <TrendingUpIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Avg Hashtags
              </p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.avgHashtagsPerItem}
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Per item
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
                {analyticsData.highPriorityRate}%
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Rate
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
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Unique Tags
              </p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {analyticsData.totalHashtags}
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Total
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart Navigation */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          {Object.entries(chartConfigs).map(([key, config]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedChart(key as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedChart === key
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : theme === 'dark' 
                    ? 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <config.icon className="w-5 h-5" />
              <span>{config.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      <AnimatePresence mode="wait">
        {selectedChart === 'trends' && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <h3 className={`text-xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Trends & Growth
            </h3>
            
            {/* Time Series Chart */}
            <div className="mb-8">
              <h4 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Daily Activity (Last 7 Days)
              </h4>
              <div className="space-y-4">
                {analyticsData.timeSeriesData.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className={`w-20 text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {day.date}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Items: {day.items}
                        </span>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Hashtags: {day.hashtags}
                        </span>
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          High Priority: {day.highPriority}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((day.items / Math.max(...analyticsData.timeSeriesData.map(d => d.items))) * 100, 100)}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedChart === 'distribution' && (
          <motion.div
            key="distribution"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Source Distribution */}
            <div className="card">
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Data by Source
              </h3>
              <div className="space-y-3">
                {Object.entries(analyticsData.sourceData).map(([source, count], index) => {
                  const percentage = Math.round((count / analyticsData.totalItems) * 100)
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
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <motion.div
                            className={`h-3 rounded-full ${color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {count} ({percentage}%)
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analyticsData.categoryData).map(([category, count], index) => {
                  const percentage = Math.round((count / analyticsData.totalItems) * 100)
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500']
                  const color = colors[index % colors.length]
                  
                  return (
                    <motion.div 
                      key={category}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {category}
                        </span>
                        <span className={`text-lg font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        />
                      </div>
                      <div className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {percentage}% of total
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {selectedChart === 'engagement' && (
          <motion.div
            key="engagement"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <h3 className={`text-xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Hashtag Performance & Engagement
            </h3>
            
            <div className="space-y-4">
              {analyticsData.hashtagPerformance.map((tag, index) => (
                <motion.div
                  key={tag.hashtag}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                  } hover:border-red-500/50 transition-colors cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {tag.hashtag}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {tag.sources} sources
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {tag.count}
                      </div>
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        uses
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4" />
                        Engagement Score: {tag.engagement}
                      </span>
                    </div>
                    
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((tag.engagement / Math.max(...analyticsData.hashtagPerformance.map(t => t.engagement))) * 100, 100)}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedChart === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Priority Distribution */}
            <div className="card">
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Priority Distribution
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(analyticsData.priorityData).map(([priority, count], index) => {
                  const percentage = Math.round((count / analyticsData.totalItems) * 100)
                  const colors = {
                    'High': 'bg-red-500',
                    'Medium': 'bg-yellow-500',
                    'Low': 'bg-green-500'
                  }
                  const color = colors[priority as keyof typeof colors]
                  
                  return (
                    <motion.div 
                      key={priority}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <span className="text-white font-bold text-lg">{percentage}%</span>
                      </div>
                      <div className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {priority}
                      </div>
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {count} items
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="card">
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Performance Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Content Velocity
                    </span>
                    <span className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {Math.round(analyticsData.totalItems / (selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 90))} items/day
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Hashtag Efficiency
                    </span>
                    <span className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {analyticsData.avgHashtagsPerItem}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Priority Balance
                    </span>
                    <span className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {analyticsData.highPriorityRate}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Source Diversity
                    </span>
                    <span className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {Object.keys(analyticsData.sourceData).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
