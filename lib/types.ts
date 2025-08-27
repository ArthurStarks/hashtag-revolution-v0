// High-level, precise storage format types
export interface DatabaseSchema {
  version: string
  lastUpdated: Date
  collections: CollectionSchema[]
  indexes: IndexDefinition[]
  constraints: ConstraintDefinition[]
}

export interface CollectionSchema {
  name: string
  fields: FieldDefinition[]
  primaryKey: string
  indexes: string[]
  constraints: string[]
  validation: ValidationRule[]
}

export interface FieldDefinition {
  name: string
  type: FieldType
  required: boolean
  unique: boolean
  defaultValue?: any
  validation?: ValidationRule[]
  description: string
  metadata?: Record<string, any>
}

export type FieldType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'date' 
  | 'array' 
  | 'object' 
  | 'reference' 
  | 'enum' 
  | 'uuid' 
  | 'timestamp'

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'custom'
  value: any
  message: string
  validator?: (value: any) => boolean
}

export interface IndexDefinition {
  name: string
  collection: string
  fields: string[]
  type: 'single' | 'compound' | 'unique' | 'text' | 'geospatial'
  options?: Record<string, any>
}

export interface ConstraintDefinition {
  name: string
  type: 'foreignKey' | 'check' | 'unique' | 'notNull'
  collection: string
  fields: string[]
  reference?: {
    collection: string
    fields: string[]
  }
  expression?: string
}

// Enhanced data models with precise structure
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

export interface DataSource {
  id: string
  name: 'gmail' | 'slack' | 'notion' | 'teams' | 'discord' | 'jira' | 'asana'
  type: 'email' | 'chat' | 'document' | 'project' | 'ticket'
  connectionId: string
  lastSync: Date
  status: 'active' | 'inactive' | 'error'
  config: Record<string, any>
}

export interface Author {
  id: string
  name: string
  email?: string
  avatar?: string
  role?: string
  department?: string
  permissions: Permission[]
  metadata: Record<string, any>
}

export interface Hashtag {
  id: string
  tag: string
  normalized: string
  category?: string
  weight: number
  usageCount: number
  firstSeen: Date
  lastSeen: Date
  relatedTags: string[]
  metadata: Record<string, any>
}

export interface Category {
  id: string
  name: string
  description: string
  parentId?: string
  color: string
  icon: string
  rules: CategoryRule[]
  metadata: Record<string, any>
}

export interface CategoryRule {
  type: 'keyword' | 'pattern' | 'ai' | 'manual'
  value: string
  weight: number
  enabled: boolean
}

export interface Priority {
  level: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info'
  score: number
  factors: PriorityFactor[]
  autoAssigned: boolean
  assignedBy?: string
}

export interface PriorityFactor {
  type: 'urgency' | 'importance' | 'impact' | 'deadline'
  value: number
  weight: number
}

export interface Sentiment {
  score: number
  label: 'positive' | 'negative' | 'neutral' | 'mixed'
  confidence: number
  aspects: SentimentAspect[]
  model: string
  timestamp: Date
}

export interface SentimentAspect {
  aspect: string
  score: number
  label: string
}

export interface DataMetadata {
  language: string
  wordCount: number
  readingTime: number
  complexity: number
  topics: string[]
  entities: Entity[]
  keywords: Keyword[]
  summary?: string
  custom: Record<string, any>
}

export interface Entity {
  name: string
  type: 'person' | 'organization' | 'location' | 'date' | 'money' | 'percent'
  confidence: number
  metadata: Record<string, any>
}

export interface Keyword {
  word: string
  score: number
  position: number[]
  context: string[]
}

export interface Relationship {
  id: string
  type: 'reply' | 'thread' | 'reference' | 'duplicate' | 'related'
  targetId: string
  targetType: string
  strength: number
  metadata: Record<string, any>
}

export interface AuditTrail {
  created: Date
  createdBy: string
  modified: Date
  modifiedBy: string
  version: number
  changes: ChangeRecord[]
  accessLog: AccessRecord[]
}

export interface ChangeRecord {
  timestamp: Date
  field: string
  oldValue: any
  newValue: any
  changedBy: string
  reason?: string
}

export interface AccessRecord {
  timestamp: Date
  userId: string
  action: 'read' | 'write' | 'delete' | 'share'
  ipAddress?: string
  userAgent?: string
}

export interface Permission {
  resource: string
  actions: string[]
  conditions?: Record<string, any>
}

// Service connection with enhanced structure
export interface ServiceConnection {
  id: string
  name: string
  status: 'connected' | 'disconnected' | 'connecting'
  lastSync?: Date
}

export interface ConnectionConfig {
  credentials: CredentialConfig
  endpoints: EndpointConfig[]
  rateLimits: RateLimitConfig
  retryPolicy: RetryPolicy
  timeout: number
}

export interface CredentialConfig {
  type: 'oauth2' | 'api_key' | 'username_password' | 'service_account'
  data: Record<string, any>
  encrypted: boolean
  expiresAt?: Date
}

export interface EndpointConfig {
  name: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers: Record<string, string>
  authentication: boolean
}

export interface RateLimitConfig {
  requestsPerMinute: number
  requestsPerHour: number
  burstLimit: number
}

export interface RetryPolicy {
  maxRetries: number
  backoffMultiplier: number
  maxBackoff: number
}

export interface ConnectionHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  lastCheck: Date
  responseTime: number
  errorRate: number
  uptime: number
}

// Enhanced hashtag statistics
export interface HashtagStats {
  hashtag: string
  count: number
  sources: string[]
  trend: TrendData
  engagement: EngagementMetrics
  reach: ReachMetrics
  metadata: Record<string, any>
}

export interface TrendData {
  currentPeriod: number
  previousPeriod: number
  change: number
  changePercent: number
  trend: 'increasing' | 'decreasing' | 'stable'
  seasonality?: number[]
}

export interface EngagementMetrics {
  clicks: number
  shares: number
  replies: number
  reactions: number
  totalEngagement: number
  engagementRate: number
}

export interface ReachMetrics {
  impressions: number
  uniqueUsers: number
  viralCoefficient: number
  amplificationRate: number
}

// Search and filtering with advanced capabilities
export interface SearchFilters {
  query: string
  categories: string[]
  sources: string[]
  priorities: string[]
  dateRange?: DateRange
  sentiment?: SentimentFilter
  hashtags?: string[]
  authors?: string[]
  advanced: AdvancedFilters
}

export interface DateRange {
  start: Date
  end: Date
  relative?: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'thisYear'
}

export interface SentimentFilter {
  minScore?: number
  maxScore?: number
  labels?: string[]
}

export interface AdvancedFilters {
  wordCount?: { min?: number; max?: number }
  complexity?: { min?: number; max?: number }
  language?: string[]
  entities?: string[]
  relationships?: string[]
  custom: Record<string, any>
}

// Database operations and queries
export interface QueryOptions {
  limit?: number
  offset?: number
  sort?: SortOption[]
  projection?: string[]
  populate?: string[]
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

export interface QueryResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
  metadata: QueryMetadata
}

export interface QueryMetadata {
  executionTime: number
  queryPlan?: any
  cacheHit: boolean
  filters: Record<string, any>
}

// Export legacy types for backward compatibility
export interface ServiceConnectionLegacy {
  id: string
  name: string
  status: 'connected' | 'disconnected' | 'connecting'
  lastSync?: Date
}

export interface HashtagStatsLegacy {
  hashtag: string
  count: number
  sources: string[]
} 