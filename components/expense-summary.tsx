"use client"

import { useMemo } from "react"
import { BarChart, Bar, Cell, ResponsiveContainer, PieChart, Pie, Tooltip, Legend, XAxis, YAxis } from "recharts"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Expense, ExpenseCategory } from "./expense-tracker"

type ExpenseSummaryProps = {
  expenses: Expense[]
  categories: ExpenseCategory[]
  isLoading?: boolean
  showCharts?: boolean
}

export default function ExpenseSummary({ expenses, categories, isLoading = false, showCharts = false }: ExpenseSummaryProps) {
  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Calculate expenses by category
  const expensesByCategory = useMemo(() => {
    if (!expenses || expenses.length === 0 || !categories || categories.length === 0) {
      return []
    }

    const result: Record<string, number> = {}

    expenses.forEach((expense) => {
      if (!expense.category) return

      if (result[expense.category]) {
        result[expense.category] += expense.amount
      } else {
        result[expense.category] = expense.amount
      }
    })

    return Object.entries(result)
      .map(([name, value]) => {
        const category = categories.find((c) => c.name === name)
        const colorClass = category?.color || "bg-gray-500"
        // Convert Tailwind color classes to hex colors for charts
        const colorMap: Record<string, string> = {
          "bg-red-500": "#ef4444",
          "bg-blue-500": "#3b82f6",
          "bg-yellow-500": "#eab308",
          "bg-green-500": "#22c55e",
          "bg-purple-500": "#a855f7",
          "bg-gray-500": "#6b7280",
          "bg-orange-500": "#f97316",
          "bg-amber-500": "#f59e0b",
          "bg-lime-500": "#84cc16",
          "bg-emerald-500": "#10b981",
          "bg-teal-500": "#14b8a6",
          "bg-cyan-500": "#06b6d4",
          "bg-sky-500": "#0ea5e9",
          "bg-indigo-500": "#6366f1",
          "bg-violet-500": "#8b5cf6",
          "bg-fuchsia-500": "#d946ef",
          "bg-pink-500": "#ec4899",
          "bg-rose-500": "#f43f5e",
        }

        return {
          name,
          value,
          fill: colorMap[colorClass] || "#6b7280",
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [expenses, categories])

  // Calculate expenses by month (for the current year)
  const expensesByMonth = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return Object.entries({
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0,
      }).map(([name, value]) => ({
        name,
        value,
        fill: "#3b82f6",
      }))
    }

    const result: Record<string, number> = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    }

    const currentYear = new Date().getFullYear()

    expenses.forEach((expense) => {
      if (!expense.date) return

      const date = new Date(expense.date)
      if (date.getFullYear() === currentYear) {
        const month = date.toLocaleString("default", { month: "short" })
        result[month] += expense.amount
      }
    })

    return Object.entries(result).map(([name, value]) => ({
      name,
      value,
      fill: "#3b82f6",
    }))
  }, [expenses])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>

        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }

  if (expenses.length === 0) {
    return (
      <motion.div
        className="text-center py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-muted-foreground">Add expenses to see your summary.</p>
      </motion.div>
    )
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-primary/20 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-2xl font-bold"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  delay: 0.2,
                }}
              >
                {formatCurrency(totalAmount)}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-primary/20 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-2xl font-bold"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  delay: 0.3,
                }}
              >
                {formatCurrency(totalAmount / Math.max(1, expenses.length))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {showCharts ? (
        <>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="overflow-hidden border-primary/20 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-sm font-medium">Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={200}
                        animationDuration={1000}
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value), "Amount"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="overflow-hidden border-primary/20 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-sm font-medium">Monthly Spending (This Year)</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expensesByMonth}>
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => value === 0 ? "$0" : `$${value}`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), "Amount"]}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {expensesByMonth.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="overflow-hidden border-primary/20 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-sm font-medium">Top Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expensesByCategory.slice(0, 5).map((category, index) => (
                    <motion.div
                      key={category.name}
                      className="flex items-center justify-between"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.fill }}></div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span>{formatCurrency(category.value)}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="overflow-hidden border-primary/20 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-sm font-medium">Spending Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expensesByCategory.slice(0, 3).map((category, index) => {
                    const percentage = (category.value / totalAmount) * 100
                    return (
                      <div key={category.name} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{category.name}</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                        <motion.div
                          className="h-2 rounded-full bg-primary/10 overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.5, delay: 0.2 * index }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: category.fill }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: 0.5 + 0.2 * index }}
                          ></motion.div>
                        </motion.div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

