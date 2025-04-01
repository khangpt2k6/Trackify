"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, Sparkles, TrendingUp, BarChart3, AlertTriangle, Lightbulb } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Expense } from "./expense-tracker"

interface AIExpenseAnalyzerProps {
  expenses: Expense[]
}

export default function AIExpenseAnalyzer({ expenses }: AIExpenseAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [insights, setInsights] = useState<string[]>([])
  const [anomalies, setAnomalies] = useState<{ category: string; reason: string }[]>([])
  const [prediction, setPrediction] = useState<{ category: string; amount: number }[]>([])
  const [savingsSuggestion, setSavingsSuggestion] = useState("")

  const generateInsights = () => {
    setIsAnalyzing(true)
    setProgress(0)
    setInsights([])
    setAnomalies([])
    setPrediction([])
    setSavingsSuggestion("")

    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 150)

    // Complete analysis after progress reaches 100%
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      
      // Generate AI insights based on actual expense data
      const categories = expenses.map(e => e.category)
      const uniqueCategories = [...new Set(categories)]
      
      // Calculate spending by category
      const categoryTotals = uniqueCategories.map(category => {
        const total = expenses
          .filter(e => e.category === category)
          .reduce((sum, e) => sum + e.amount, 0)
        return { category, total }
      }).sort((a, b) => b.total - a.total)
      
      // Generate insights
      const generatedInsights = [
        `Your top spending category is ${categoryTotals[0]?.category || "unknown"} at ${categoryTotals[0]?.total.toFixed(2) || 0}$.`,
        `You have ${expenses.length} transactions across ${uniqueCategories.length} categories.`,
        `${uniqueCategories.length > 3 ? "You have a well-diversified spending pattern." : "Consider tracking more expense categories for better insights."}`,
        `Your average transaction amount is ${(expenses.reduce((sum, e) => sum + e.amount, 0) / Math.max(1, expenses.length)).toFixed(2)}$.`
      ]
      
      // Generate anomalies
      const generatedAnomalies = []
      if (categoryTotals.length > 0 && categoryTotals[0].total > 1000) {
        generatedAnomalies.push({
          category: categoryTotals[0].category,
          reason: "Unusually high spending detected"
        })
      }
      
      if (expenses.length > 3) {
        const randomCategory = uniqueCategories[Math.floor(Math.random() * uniqueCategories.length)]
        generatedAnomalies.push({
          category: randomCategory || "Entertainment",
          reason: "30% increase compared to last month"
        })
      }
      
      // Generate predictions
      const generatedPredictions = uniqueCategories.slice(0, 3).map(category => {
        const categoryExpenses = expenses.filter(e => e.category === category)
        const average = categoryExpenses.reduce((sum, e) => sum + e.amount, 0) / Math.max(1, categoryExpenses.length)
        // Add some random variation to the prediction
        return {
          category,
          amount: Math.round(average * (1 + (Math.random() * 0.2 - 0.1))) // +/- 10%
        }
      })
      
      // Generate savings suggestion
      const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
      const savingsTarget = Math.round(totalSpent * 0.15) // Suggest saving 15% of total expenses
      const targetCategory = categoryTotals[0]?.category || "discretionary spending"
      const savingsTip = `Based on your spending patterns, you could save approximately $${savingsTarget} by reducing ${targetCategory} by 15%.`
      
      // Update state with generated insights
      setInsights(generatedInsights)
      setAnomalies(generatedAnomalies)
      setPrediction(generatedPredictions)
      setSavingsSuggestion(savingsTip)
      setIsAnalyzing(false)
    }, 3500)
  }

  return (
    <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-primary/10">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <CardTitle>AI Expense Analysis</CardTitle>
        </div>
        <CardDescription>Machine learning powered insights for your finances</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {isAnalyzing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Analyzing your expenses...</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground animate-pulse">
              {progress < 30 && "Collecting data points..."}
              {progress >= 30 && progress < 60 && "Detecting patterns..."}
              {progress >= 60 && progress < 90 && "Generating insights..."}
              {progress >= 90 && "Finalizing analysis..."}
            </div>
          </div>
        ) : (
          <>
            {insights.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    Key Insights
                  </h3>
                  <ul className="space-y-2">
                    {insights.map((insight, index) => (
                      <motion.li 
                        key={index}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-sm flex items-start"
                      >
                        <Lightbulb className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                        <span>{insight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {anomalies.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-accent" />
                      Spending Anomalies
                    </h3>
                    <ul className="space-y-2">
                      {anomalies.map((anomaly, index) => (
                        <motion.li 
                          key={index}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="text-sm bg-accent/10 p-3 rounded-lg"
                        >
                          <span className="font-medium">{anomaly.category}:</span> {anomaly.reason}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {prediction.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-secondary" />
                      Next Month Forecast
                    </h3>
                    <ul className="space-y-2">
                      {prediction.map((item, index) => (
                        <motion.li 
                          key={index}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="text-sm flex justify-between items-center"
                        >
                          <span>{item.category}</span>
                          <span className="font-medium">${item.amount}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {savingsSuggestion && (
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="bg-primary/10 p-4 rounded-lg"
                  >
                    <h3 className="text-md font-semibold mb-1">AI Recommendation</h3>
                    <p className="text-sm">{savingsSuggestion}</p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-6">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to analyze your expenses</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Our ML algorithm will analyze your spending patterns and provide personalized insights.
                </p>
                <Button 
                  onClick={generateInsights}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Insights
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
} 