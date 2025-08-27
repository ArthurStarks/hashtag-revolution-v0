'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  DocumentTextIcon,
  HashtagIcon,
  ClockIcon,
  StarIcon,
  EyeIcon,
  BookmarkIcon,
  ShareIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import { DataItem } from '@/lib/types'

interface AdvancedSearchProps {
  dataItems: DataItem[]
  filteredData: DataItem[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  selectedSources: string[]
  setSelectedSources: (sources: string[]) => void
  selectedPriorities: string[]
  setSelectedPriorities: (priorities: string[]) => void
  theme: 'dark' | 'light'
}

export function AdvancedSearch({
  dataItems,
  filteredData,
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedSources,
  setSelectedSources,
  selectedPriorities,
  setSelectedPriorities,
  theme
}: AdvancedSearchProps) {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title' | 'source'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'compact'>('list')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)

  // Get unique values for filters
  const categories = Array.from(new Set(dataItems.map(item => item.category)))
  const sources = Array.from(new Set(dataItems.map(item => item.source)))
  const priorities = ['High', 'Medium', 'Low']

  // Sort filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'date':
        comparison = a.timestamp.getTime() - b.timestamp.getTime()
        break
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
        break
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'source':
        comparison = a.source.localeCompare(b.source)
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Toggle item selection
  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setSelectedSources([])
    setSelectedPriorities([])
    setSelectedItems(new Set())
  }

  // Get filtered data based on showSelectedOnly
  const displayData = showSelectedOnly 
    ? sortedData.filter(item => selectedItems.has(item.id))
    : sortedData

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Advanced Search & Filter
            </h2>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Find exactly what you need with powerful search and filtering tools
            </p>
          </div>

          {/* Results Summary */}
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {displayData.length}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              of {dataItems.length} total items
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card">
        <h3 className={`text-xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Search Your Data
        </h3>
        <div className="relative">
          <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search across all content, hashtags, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-4 text-lg rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Filters & Options
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isAdvancedFiltersOpen 
                  ? 'bg-red-500 text-white' 
                  : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              } transition-colors`}
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              Advanced
            </button>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Basic Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Categories
            </label>
            <select
              multiple
              value={selectedCategories}
              onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, option => option.value))}
              className={`w-full px-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Sources
            </label>
            <select
              multiple
              value={selectedSources}
              onChange={(e) => setSelectedSources(Array.from(e.target.selectedOptions, option => option.value))}
              className={`w-full px-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
            >
              {sources.map(source => (
                <option key={source} value={source}>
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Priority
            </label>
            <select
              multiple
              value={selectedPriorities}
              onChange={(e) => setSelectedPriorities(Array.from(e.target.selectedOptions, option => option.value))}
              className={`w-full px-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {isAdvancedFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Sort By
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className={`flex-1 px-3 py-2 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
                    >
                      <option value="date">Date</option>
                      <option value="priority">Priority</option>
                      <option value="title">Title</option>
                      <option value="source">Source</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className={`px-3 py-2 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-gray-300' 
                          : 'bg-white border-gray-300 text-gray-700'
                      } hover:bg-gray-100 transition-colors`}
                    >
                      {sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    View Mode
                  </label>
                  <div className="flex gap-2">
                    {(['list', 'grid', 'compact'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          viewMode === mode
                            ? 'bg-red-500 text-white'
                            : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:text-white' : 'bg-gray-200 text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showSelectedOnly}
                    onChange={(e) => setShowSelectedOnly(e.target.checked)}
                    className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Show selected items only
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Results */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Search Results ({displayData.length} items)
          </h3>
          
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-3">
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {selectedItems.size} selected
              </span>
              <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors">
                Export Selected
              </button>
            </div>
          )}
        </div>

        {displayData.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No results found
            </h3>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                } ${
                  selectedItems.has(item.id) 
                    ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    className="mt-1 rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />

                  {/* Item Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className={`font-semibold text-lg ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`source-badge ${item.source}-badge`}>
                          {item.source.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.priority === 'High' ? 'bg-red-100 text-red-800' :
                          item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>

                    <p className={`text-sm mb-4 line-clamp-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {item.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="capitalize">{item.source}</span>
                        <span>•</span>
                        <span>{item.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {item.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
                          <BookmarkIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.hashtags.map((hashtag) => (
                        <span key={hashtag} className="hashtag">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
