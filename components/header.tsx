"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DollarSign, PiggyBank } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/auth')
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 backdrop-blur-md border-b border-yellow-300/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <PiggyBank className="h-6 w-6 text-yellow-900" />
              <span className="text-2xl font-bold text-yellow-900">
                Trackify
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!isDashboard && !isAuthPage && (
              <>
                <Link
                  href="/auth/signin"
                  className="text-yellow-900 hover:text-yellow-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
            {isDashboard && (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-yellow-100"
              >
                <DollarSign className="h-5 w-5 text-yellow-900" />
                <span className="sr-only">Finance Overview</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 