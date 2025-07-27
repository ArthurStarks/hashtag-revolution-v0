export interface DataItem {
  id: string
  title: string
  content: string
  source: 'gmail' | 'slack' | 'notion'
  channel?: string
  author: string
  timestamp: Date
  hashtags: string[]
  category: string
  priority: 'High' | 'Medium' | 'Low'
  sentiment?: 'positive' | 'negative' | 'neutral'
}

export interface ServiceConnection {
  id: string
  name: string
  status: 'connected' | 'disconnected' | 'connecting'
  lastSync?: Date
}

export interface HashtagStats {
  hashtag: string
  count: number
  sources: string[]
}

export interface SearchFilters {
  query: string
  categories: string[]
  sources: string[]
  priorities: string[]
  dateRange?: {
    start: Date
    end: Date
  }
} 