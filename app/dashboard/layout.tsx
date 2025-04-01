"use client"

import Header from '@/components/header'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-transparent bg-clip-text">
                Welcome to Trackify
              </h1>
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Sparkles className="h-6 sm:h-8 w-6 sm:w-8 text-yellow-500" />
              </motion.div>
            </div>
            <p className="text-yellow-700/80 text-base sm:text-lg">Track your expenses with style ✨</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
} 