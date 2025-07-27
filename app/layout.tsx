import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hashtag Revolution - Centralized Data Hub',
  description: 'Connect Gmail, Slack, and Notion. Extract hashtags and categorize your digital life.',
  keywords: 'productivity, AI, hashtags, categorization, Gmail, Slack, Notion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        {children}
      </body>
    </html>
  )
} 