"use client"

import { useState, useEffect } from "react"
import { Plus, Filter, ArrowUpDown, Sparkles, BarChart3, PieChart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExpenseForm from "./expense-form"
import ExpenseList from "./expense-list"
import ExpenseSummary from "./expense-summary"
import ThemeToggle from "./theme-toggle"
import ConfettiExplosion from "react-confetti-explosion"
import ChatbotButton from "./chatbot-button"
import AIExpenseAnalyzer from "./ai-expense-analyzer"
import ExportShare from "./export-share"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: Date
}

export type ExpenseCategory = {
  name: string
  color: string
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<ExpenseCategory[]>([
    { name: "Food", color: "bg-red-500" },
    { name: "Transportation", color: "bg-blue-500" },
    { name: "Entertainment", color: "bg-yellow-500" },
    { name: "Utilities", color: "bg-green-500" },
    { name: "Shopping", color: "bg-purple-500" },
    { name: "Other", color: "bg-gray-500" },
  ])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [activeTab, setActiveTab] = useState("summary")
  const [isExploding, setIsExploding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch expenses from MongoDB on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('/api/expenses')
        if (!response.ok) throw new Error('Failed to fetch expenses')
        const data = await response.json()
        setExpenses(data.map((expense: any) => ({
          ...expense,
          id: expense._id,
          date: new Date(expense.date)
        })))
      } catch (error) {
        console.error('Error fetching expenses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  const addExpense = async (expense: Omit<Expense, "id">) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      })

      if (!response.ok) throw new Error('Failed to add expense')
      
      const newExpense = await response.json()
      setExpenses(prev => [...prev, {
        ...newExpense,
        id: newExpense._id,
        date: new Date(newExpense.date)
      }])
      
      setIsFormOpen(false)
      setIsExploding(true)
      setTimeout(() => setIsExploding(false), 3000)
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete expense')
      
      setExpenses(prev => prev.filter(expense => expense.id !== id))
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  const addCategory = (category: ExpenseCategory) => {
    setCategories(prev => [...prev, category])
  }

  const filteredExpenses = filterCategory 
    ? expenses.filter((expense) => expense.category === filterCategory) 
    : expenses

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div className="expense-content sparkle" initial="hidden" animate="visible" variants={containerVariants}>
          {isExploding && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <ConfettiExplosion force={0.8} duration={3000} particleCount={250} width={1600} />
            </div>
          )}

          <motion.div className="flex justify-between items-center" variants={itemVariants}>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ rotate: 20 }} 
                  whileTap={{ scale: 0.9 }} 
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 5,
                  }}
                  className="ml-2"
                >
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                </motion.div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ExportShare expenses={expenses} categories={categories} />
              <ThemeToggle />
            </div>
          </motion.div>

          <div className="grid gap-6">
            <Card className="overflow-hidden border-yellow-200 hover-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-yellow-50 to-yellow-100">
                <div>
                  <CardTitle className="text-xl font-semibold text-yellow-900">Your Expenses</CardTitle>
                  <CardDescription className="text-yellow-800/80">
                    {filterCategory ? `Showing ${filterCategory} expenses` : "Showing all expenses"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 border-yellow-200 hover:bg-yellow-100">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] bg-yellow-50 border-yellow-200">
                      <DropdownMenuLabel className="text-yellow-900">Filter by Category</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-yellow-200" />
                      <DropdownMenuItem onClick={() => setFilterCategory(null)} className="text-yellow-800 hover:bg-yellow-100">
                        All Categories
                      </DropdownMenuItem>
                      {categories.map((category) => (
                        <DropdownMenuItem
                          key={category.name}
                          onClick={() => setFilterCategory(category.name)}
                          className="text-yellow-800 hover:bg-yellow-100"
                        >
                          {category.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-yellow-200 hover:bg-yellow-100"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                  </Button>

                  <Button
                    onClick={() => setIsFormOpen(true)}
                    size="sm"
                    className="h-8 bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </div>
              </CardHeader>

              <Tabs defaultValue="list" className="w-full">
                <TabsList className="w-full justify-start border-b border-yellow-200 dark:border-yellow-800 rounded-none p-0 h-12">
                  <TabsTrigger
                    value="list"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-yellow-500 dark:data-[state=active]:border-yellow-400"
                    onClick={() => setActiveTab("list")}
                  >
                    List View
                  </TabsTrigger>
                  <TabsTrigger
                    value="summary"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-yellow-500 dark:data-[state=active]:border-yellow-400"
                    onClick={() => setActiveTab("summary")}
                  >
                    Summary
                  </TabsTrigger>
                  <TabsTrigger
                    value="charts"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-yellow-500 dark:data-[state=active]:border-yellow-400"
                    onClick={() => setActiveTab("charts")}
                  >
                    Charts
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-yellow-500 dark:data-[state=active]:border-yellow-400"
                    onClick={() => setActiveTab("ai")}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="p-4">
                  <ExpenseList
                    expenses={sortedExpenses}
                    categories={categories}
                    onDelete={deleteExpense}
                    onFilterCategory={setFilterCategory}
                    isLoading={isLoading}
                  />
                </TabsContent>

                <TabsContent value="summary" className="p-4">
                  <ExpenseSummary
                    expenses={expenses}
                    categories={categories}
                    showCharts={false}
                  />
                </TabsContent>

                <TabsContent value="charts" className="p-4">
                  <ExpenseSummary
                    expenses={expenses}
                    categories={categories}
                    showCharts={true}
                  />
                </TabsContent>

                <TabsContent value="ai" className="p-4">
                  <AIExpenseAnalyzer expenses={expenses} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <AnimatePresence>
            {isFormOpen && (
              <ExpenseForm
                categories={categories}
                onAddExpense={addExpense}
                onAddCategory={addCategory}
                onCancel={() => setIsFormOpen(false)}
              />
            )}
          </AnimatePresence>

          <div className="fixed bottom-4 right-4">
            <ChatbotButton />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

