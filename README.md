# Hashtag Revolution - V0 Demo

A centralized data hub that connects Gmail, Slack, and Notion to extract hashtags and categorize your digital content with AI-powered insights.

## Features

### Multi-Platform Integration
- **Gmail**: Connect and sync emails
- **Slack**: Connect and sync messages
- **Notion**: Connect and sync documents
- Real-time connection status
- Simulated OAuth authentication

### Smart Hashtag Extraction
- Automatic hashtag detection (urgent, meeting, followup)
- Personalized tagging system
- Category-based organization
- Priority tagging (High, Medium, Low)

### Intelligent Search
- Search across all content sources
- Filter by hashtags, keywords, or phrases
- Real-time search results
- Advanced filtering options

### Beautiful Analytics
- Hashtag frequency visualization
- Source distribution charts
- Category breakdown
- Interactive data insights

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000/`

## Demo Walkthrough

### 1. **Service Connection**
- Click "Connect Gmail" to simulate Gmail authentication
- Click "Connect Slack" to simulate Slack authentication  
- Click "Connect Notion" to simulate Notion authentication
- Watch real-time connection status updates

### 2. **Dashboard Overview**
- **Metrics**: Total items, hashtags, connected services, high-priority items
- **Recent Items**: Browse categorized content with hashtags
- **Real-time Updates**: See data change as you connect services

### 3. **Search & Filter**
- **Search Bar**: Type keywords like "urgent", "meeting", or hashtags like "urgent"
- **Advanced Filters**: Filter by category, source, and priority
- **Real-time Results**: Watch results update as you type

### 4. **Analytics**
- **Hashtag Cloud**: See most popular hashtags with frequency
- **Source Distribution**: Visualize data from different platforms
- **Category Breakdown**: Understand your data organization

## Demo Data

The demo includes realistic sample data:

| Source | Content Type | Hashtags | Priority |
|--------|-------------|----------|----------|
| Slack | Team Meeting | urgent, marketing, strategy | High |
| Notion | Product Docs | meeting, product, roadmap | Medium |
| Gmail | Client Email | followup, client, enterprise | High |
| Slack | Standup | daily, team, collaboration | Medium |
| Gmail | Finance | urgent, budget, approval | High |
| Notion | Design | design, ui, components | Low |

## Demo Script

### Opening (30 seconds)
"Today I'm showing you Hashtag Revolution - a centralized data hub that connects all your digital life. Watch how it automatically extracts hashtags and categorizes content from Gmail, Slack, and Notion."

### Service Connection (1 minute)
"Let me connect to the services... [Click each service] Notice how it shows real-time connection status. This is the foundation - once connected, we start pulling and categorizing data."

### Dashboard Walkthrough (2 minutes)
"Here's your centralized dashboard. You can see:
- Total items across all platforms
- Unique hashtags automatically extracted
- Connected services status
- High-priority items that need attention

The system automatically categorizes everything and extracts hashtags like urgent, meeting, followup."

### Search Demonstration (2 minutes)
"Now the magic - search across everything. Let me search for 'urgent'... [Type in search] See how it finds items across Gmail, Slack, and Notion instantly. You can search by hashtags, keywords, or phrases."

### Analytics (1 minute)
"Finally, the analytics show you patterns. Here's hashtag frequency - notice urgent appears multiple times. And source distribution shows where your data comes from."

### Closing (30 seconds)
"This is just the beginning. Imagine this with real API connections, AI-powered insights, and MCP integration. The potential for productivity is enormous."

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Charts**: Recharts
- **Deployment**: Vercel (ready)

## Deployment

### Vercel Deployment
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Development

### Project Structure
```
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page component
├── lib/                # Utilities and data
│   ├── types.ts        # TypeScript types
│   └── data.ts         # Mock data and utilities
├── components/         # React components
└── public/            # Static assets
```

### Key Functions
- `extractHashtags()`: Regex-based hashtag extraction
- `filterData()`: Advanced search and filtering
- `getHashtagStats()`: Hashtag frequency analysis
- `connectService()`: Simulated OAuth flow

## Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 to #7c3aed)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Components
- **Cards**: Clean, rounded with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Hashtags**: Blue pills with hover states
- **Source Badges**: Color-coded by platform

## Next Steps

### Phase 1: Real API Integration
- Gmail API with OAuth2
- Slack Web API
- Notion API

### Phase 2: AI Enhancement
- OpenAI integration for content analysis
- MCP (Model Context Protocol) implementation
- Smart categorization

### Phase 3: Advanced Features
- Real-time sync
- Notifications
- Export capabilities
- Team collaboration

## Demo Tips

1. **Practice the flow** - Run through the demo 2-3 times
2. **Show the search** - This is the most impressive feature
3. **Emphasize the vision** - This is just the beginning
4. **Be confident** - You've built something impressive!

---

**Ready to revolutionize productivity? Let's build the future together!** 