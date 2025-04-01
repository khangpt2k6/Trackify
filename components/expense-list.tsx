"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MoreHorizontal, Trash2, Search, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { Expense, ExpenseCategory } from "./expense-tracker"

type ExpenseListProps = {
  expenses: Expense[]
  categories: ExpenseCategory[]
  onDelete: (id: string) => void
  onFilterCategory: (category: string) => void
  isLoading?: boolean
}

export default function ExpenseList({
  expenses,
  categories,
  onDelete,
  onFilterCategory,
  isLoading = false,
}: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredExpenses = expenses.filter((expense) =>
    expense.description ? expense.description.toLowerCase().includes(searchTerm.toLowerCase()) : true,
  )

  const getCategoryColor = (categoryName: string) => {
    if (!categoryName || !categories) return "bg-gray-500"
    return categories.find((cat) => cat.name === categoryName)?.color || "bg-gray-500"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const confirmDelete = (id: string) => {
    setDeleteId(id)
  }

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          className="pl-8 transition-all duration-300 focus:ring-2 focus:ring-primary/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredExpenses.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}>
                {filteredExpenses.map((expense, index) => (
                  <motion.tr
                    key={expense.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                    className={`group relative ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/30"
                    } hover:bg-primary/5 transition-colors duration-200`}
                    onClick={() => setExpandedId(expandedId === expense.id ? null : expense.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className="font-medium">{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <motion.div
                          className={`w-3 h-3 rounded-full ${getCategoryColor(expense.category)}`}
                          whileHover={{ scale: 1.5 }}
                        ></motion.div>
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={(e) => {
                            e.stopPropagation()
                            onFilterCategory(expense.category)
                          }}
                        >
                          {expense.category}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {expense.description || <span className="text-muted-foreground italic">No description</span>}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={expense.amount > 100 ? "text-destructive" : ""}>
                        {formatCurrency(expense.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              confirmDelete(expense.id)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {expandedId === expense.id && (
                        <motion.td
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute left-0 right-0 bg-primary/5 px-4 py-3 border-t border-primary/10"
                          style={{ top: "100%" }}
                          colSpan={5}
                        >
                          <div className="text-sm">
                            <p className="font-medium">Details:</p>
                            <p>{expense.description || "No additional details available."}</p>
                          </div>
                        </motion.td>
                      )}
                    </AnimatePresence>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center py-10 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
          </motion.div>
          <motion.h3
            className="font-semibold text-lg"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            No expenses found
          </motion.h3>
          <motion.p
            className="text-muted-foreground"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {expenses.length === 0
              ? "Add your first expense to get started."
              : "No expenses match your search criteria."}
          </motion.p>
        </motion.div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="border border-destructive/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this expense. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

