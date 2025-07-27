import { DataItem, HashtagStats } from './types'

// Mock data for demo
export const mockData: DataItem[] = [
  {
    id: '1',
    title: 'Q4 Marketing Strategy Meeting urgent',
    content: 'Team meeting to discuss Q4 marketing strategy. Key focus on social media campaigns and influencer partnerships. Need to finalize budget allocation and timeline. marketing strategy q4 budget',
    source: 'slack',
    channel: '#general',
    author: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    hashtags: ['#urgent', '#marketing', '#strategy', '#q4', '#budget'],
    category: 'Business',
    priority: 'High'
  },
  {
    id: '2',
    title: 'Product Roadmap Update meeting',
    content: 'New features planned for next sprint: advanced analytics, user dashboard improvements, and mobile app enhancements. Also considering AI-powered recommendations. product roadmap features ai',
    source: 'notion',
    channel: 'Product Docs',
    author: 'Mike Chen',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    hashtags: ['#meeting', '#product', '#roadmap', '#features', '#ai'],
    category: 'Product',
    priority: 'Medium'
  },
  {
    id: '3',
    title: 'Client Meeting Follow-up followup',
    content: 'Great discussion with ABC Corp about enterprise requirements. They\'re interested in our solution and want to schedule a technical demo next week. client enterprise demo',
    source: 'gmail',
    channel: 'Inbox',
    author: 'john.doe@company.com',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    hashtags: ['#followup', '#client', '#enterprise', '#demo'],
    category: 'Sales',
    priority: 'High'
  },
  {
    id: '4',
    title: 'Team Standup Notes daily',
    content: 'Everyone making good progress. John needs help with API integration. Sarah will assist. Also discussed the new design system implementation. team collaboration api design',
    source: 'slack',
    channel: '#team-standup',
    author: 'Alex Rodriguez',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    hashtags: ['#daily', '#team', '#collaboration', '#api', '#design'],
    category: 'Team',
    priority: 'Medium'
  },
  {
    id: '5',
    title: 'Budget Approval Required urgent',
    content: 'Need approval for Q4 marketing budget. Please review and approve by EOD. This includes social media ads, influencer partnerships, and content creation. budget approval marketing',
    source: 'gmail',
    channel: 'Inbox',
    author: 'finance@company.com',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    hashtags: ['#urgent', '#budget', '#approval', '#marketing'],
    category: 'Finance',
    priority: 'High'
  },
  {
    id: '6',
    title: 'Design System Updates design',
    content: 'Updated design system with new components. Check out the new button styles, color palette, and typography guidelines. Also added dark mode support. design ui components darkmode',
    source: 'notion',
    channel: 'Design Docs',
    author: 'Emma Wilson',
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
    hashtags: ['#design', '#ui', '#components', '#darkmode'],
    category: 'Design',
    priority: 'Low'
  },
  {
    id: '7',
    title: 'API Documentation tech',
    content: 'Updated API documentation with new endpoints. Added authentication examples and error handling guidelines. Need to review with the team. tech api documentation',
    source: 'notion',
    channel: 'Tech Docs',
    author: 'David Kim',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    hashtags: ['#tech', '#api', '#documentation'],
    category: 'Technical',
    priority: 'Medium'
  },
  {
    id: '8',
    title: 'Customer Feedback Summary feedback',
    content: 'Collected feedback from 50+ customers. Main themes: better mobile experience, faster loading times, and more customization options. feedback customers mobile performance',
    source: 'gmail',
    channel: 'Inbox',
    author: 'support@company.com',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    hashtags: ['#feedback', '#customers', '#mobile', '#performance'],
    category: 'Customer',
    priority: 'High'
  }
]

// Extract hashtags from text
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#\w+/g
  const hashtags = text.match(hashtagRegex) || []
  return [...new Set(hashtags.map(tag => tag.toLowerCase()))]
}

// Get hashtag statistics
export function getHashtagStats(data: DataItem[]): HashtagStats[] {
  const hashtagCounts: { [key: string]: { count: number; sources: Set<string> } } = {}
  
  data.forEach(item => {
    item.hashtags.forEach(hashtag => {
      if (!hashtagCounts[hashtag]) {
        hashtagCounts[hashtag] = { count: 0, sources: new Set() }
      }
      hashtagCounts[hashtag].count++
      hashtagCounts[hashtag].sources.add(item.source)
    })
  })
  
  return Object.entries(hashtagCounts)
    .map(([hashtag, stats]) => ({
      hashtag,
      count: stats.count,
      sources: Array.from(stats.sources)
    }))
    .sort((a, b) => b.count - a.count)
}

// Filter data based on search criteria
export function filterData(
  data: DataItem[],
  query: string,
  categories: string[] = [],
  sources: string[] = [],
  priorities: string[] = []
): DataItem[] {
  return data.filter(item => {
    // Text search
    const textMatch = !query || 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase()) ||
      item.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    
    // Category filter
    const categoryMatch = categories.length === 0 || categories.includes(item.category)
    
    // Source filter
    const sourceMatch = sources.length === 0 || sources.includes(item.source)
    
    // Priority filter
    const priorityMatch = priorities.length === 0 || priorities.includes(item.priority)
    
    return textMatch && categoryMatch && sourceMatch && priorityMatch
  })
} 