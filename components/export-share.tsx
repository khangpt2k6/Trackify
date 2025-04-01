"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, FileSpreadsheet, FileText, Share2, Check, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Expense } from "./expense-tracker"

interface ExportShareProps {
  expenses: Expense[]
  categories: { name: string; color: string }[]
}

export default function ExportShare({ expenses, categories }: ExportShareProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [exportOption, setExportOption] = useState<"export" | "share">("export")
  const [showSuccess, setShowSuccess] = useState(false)
  
  const handleExport = () => {
    // For demonstration purposes - in a real app, this would generate the actual file
    if (exportOption === "export") {
      setTimeout(() => {
        setShowSuccess(true)
        // Reset after 3 seconds
        setTimeout(() => {
          setShowSuccess(false)
          setIsDialogOpen(false)
        }, 3000)
      }, 1500)
      
      // Use toast to notify success
      toast.success(`Expenses successfully exported as ${exportFormat.toUpperCase()}`, {
        description: `${expenses.length} expenses exported`,
        icon: exportFormat === "excel" ? <FileSpreadsheet className="h-4 w-4" /> : <FileText className="h-4 w-4" />
      })
    } else {
      // Sharing functionality
      if (!email) {
        toast.error("Please enter an email address", {
          description: "Email is required to share your expense data",
          icon: <AlertCircle className="h-4 w-4" />
        })
        return
      }
      
      setTimeout(() => {
        setShowSuccess(true)
        // Reset after 3 seconds
        setTimeout(() => {
          setShowSuccess(false)
          setIsDialogOpen(false)
          setEmail("")
          setMessage("")
        }, 3000)
      }, 1500)
      
      toast.success(`Expenses shared with ${email}`, {
        description: message ? "Your message was included" : "No message included",
        icon: <Share2 className="h-4 w-4" />
      })
    }
  }
  
  const getFormatIcon = () => {
    return exportFormat === "excel" ? 
      <FileSpreadsheet className="h-5 w-5 text-primary mr-2" /> : 
      <FileText className="h-5 w-5 text-primary mr-2" />
  }
  
  // Function to convert expenses to CSV string (for Excel export)
  const convertToCSV = () => {
    // Create header row
    const header = "Date,Amount,Category,Description\n"
    
    // Create rows for each expense
    const rows = expenses.map(expense => {
      const date = new Date(expense.date).toLocaleDateString()
      return `${date},${expense.amount},${expense.category},${expense.description}`
    }).join("\n")
    
    return header + rows
  }
  
  // Function to download CSV data
  const downloadCSV = () => {
    const csvData = convertToCSV()
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'expense_data.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-primary/5 hover:bg-primary/10 transition-colors flex items-center gap-2 border-primary/20"
        >
          <Download className="h-4 w-4" />
          Export & Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {exportOption === "export" ? (
              <>
                <Download className="h-5 w-5 text-primary mr-2" />
                Export Expense Data
              </>
            ) : (
              <>
                <Share2 className="h-5 w-5 text-primary mr-2" />
                Share with Financial Advisor
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {exportOption === "export" 
              ? "Download your expense data in your preferred format." 
              : "Share your expense data with a financial advisor or accountant."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <RadioGroup defaultValue="export" className="grid grid-cols-2 gap-4" onValueChange={(val) => setExportOption(val as "export" | "share")}>
            <div>
              <RadioGroupItem value="export" id="export" className="peer sr-only" />
              <Label
                htmlFor="export"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Download className="mb-3 h-6 w-6" />
                Export
              </Label>
            </div>
            <div>
              <RadioGroupItem value="share" id="share" className="peer sr-only" />
              <Label
                htmlFor="share"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Share2 className="mb-3 h-6 w-6" />
                Share
              </Label>
            </div>
          </RadioGroup>

          <AnimatePresence mode="wait">
            {exportOption === "export" ? (
              <motion.div 
                key="export-options"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <RadioGroup defaultValue="excel" onValueChange={(val) => setExportFormat(val as "excel" | "pdf")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excel" id="excel" />
                      <Label htmlFor="excel" className="flex items-center">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Excel (.csv)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="pdf" />
                      <Label htmlFor="pdf" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Your export will include:</p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>All {expenses.length} expense records</li>
                    <li>Category information</li>
                    <li>Spending summary</li>
                  </ul>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="share-options"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Advisor's Email</Label>
                  <Input 
                    id="email" 
                    placeholder="advisor@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Add a note to your financial advisor..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Your advisor will receive:</p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>All {expenses.length} expense records</li>
                    <li>Category information</li>
                    <li>Your personal message</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button 
            className="relative"
            onClick={exportOption === "export" && exportFormat === "excel" ? downloadCSV : handleExport}
          >
            <AnimatePresence>
              {showSuccess ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Check className="mr-2 h-4 w-4" /> Success
                </motion.span>
              ) : exportOption === "export" ? (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  {getFormatIcon()} Export
                </motion.span>
              ) : (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 