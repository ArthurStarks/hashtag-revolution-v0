'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PhotoIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  GridIcon,
  ListIcon
} from '@heroicons/react/24/outline'

interface GalleryImage {
  id: string
  url: string
  title: string
  description: string
  tags: string[]
  category: string
  likes: number
  views: number
}

interface ImageGalleryProps {
  images: GalleryImage[]
  onImageClick: (image: GalleryImage) => void
  theme: 'dark' | 'light'
  isAutoPlay: boolean
  onAutoPlayToggle: () => void
}

export function ImageGallery({ 
  images, 
  onImageClick, 
  theme, 
  isAutoPlay, 
  onAutoPlayToggle 
}: ImageGalleryProps) {
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(images)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'views' | 'title'>('date')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % filteredImages.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlay, filteredImages.length])

  // Filter and sort images
  useEffect(() => {
    let filtered = images.filter(image => {
      const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           image.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })

    // Sort images
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes
        case 'views':
          return b.views - a.views
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredImages(filtered)
  }, [images, searchQuery, selectedCategory, sortBy])

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(images.map(img => img.category)))]

  return (
    <div className="space-y-8">
      {/* Gallery Header */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Professional Image Gallery
            </h2>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {filteredImages.length} images • Curated collection of professional visuals
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Auto-play Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAutoPlayToggle}
              className={`p-3 rounded-lg ${
                isAutoPlay 
                  ? 'bg-red-500 text-white' 
                  : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              } transition-colors`}
            >
              {isAutoPlay ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
            </motion.button>

            {/* View Mode Toggle */}
            <div className={`flex rounded-lg p-1 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-red-500 text-white'
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <GridIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-red-500 text-white'
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Search Images
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`w-full px-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors`}
            >
              <option value="date">Date Added</option>
              <option value="likes">Most Liked</option>
              <option value="views">Most Viewed</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Image Carousel */}
      {filteredImages.length > 0 && (
        <div className="card overflow-hidden">
          <div className="relative h-96 bg-gradient-to-r from-gray-900 to-gray-800">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={filteredImages[currentImageIndex].url}
                  alt={filteredImages[currentImageIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {filteredImages[currentImageIndex].title}
                  </h3>
                  <p className="text-gray-200 mb-4">
                    {filteredImages[currentImageIndex].description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <EyeIcon className="w-4 h-4" />
                      {filteredImages[currentImageIndex].views}
                    </span>
                    <span className="flex items-center gap-1">
                      <HeartIcon className="w-4 h-4" />
                      {filteredImages[currentImageIndex].likes}
                    </span>
                    <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                      {filteredImages[currentImageIndex].category}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Navigation */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              {filteredImages.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-red-500' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Grid/List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            All Images ({filteredImages.length})
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ArrowPathIcon className="w-4 h-4" />
            Auto-refresh enabled
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`group cursor-pointer rounded-xl overflow-hidden shadow-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                } transition-all duration-300`}
                onClick={() => onImageClick(image)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                      <HeartIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                      <ShareIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                      <BookmarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {image.title}
                  </h4>
                  <p className={`text-sm mb-3 line-clamp-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {image.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {image.category}
                    </span>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <EyeIcon className="w-3 h-3" />
                        {image.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <HeartIcon className="w-3 h-3" />
                        {image.likes}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {image.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs text-red-400 font-medium">
                        {tag}
                      </span>
                    ))}
                    {image.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{image.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                } transition-colors duration-200`}
                onClick={() => onImageClick(image)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {image.title}
                  </h4>
                  <p className={`text-sm mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {image.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{image.category}</span>
                    <span>•</span>
                    <span>{image.views} views</span>
                    <span>•</span>
                    <span>{image.likes} likes</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {image.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="text-xs text-red-400 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="card text-center py-12">
          <PhotoIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No images found
          </h3>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  )
}
