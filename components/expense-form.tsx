"use client"

import { useState } from "react"
import { CalendarIcon, Plus, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Expense, ExpenseCategory } from "./expense-tracker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().default(""),
  date: z.date(),
})

type ExpenseFormProps = {
  categories: ExpenseCategory[]
  onAddExpense: (expense: Omit<Expense, "id">) => void
  onAddCategory: (category: ExpenseCategory) => void
  onCancel: () => void
}

export default function ExpenseForm({ categories, onAddExpense, onAddCategory, onCancel }: ExpenseFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      category: "",
      description: "",
      date: new Date(),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddExpense({
      amount: values.amount,
      category: values.category,
      description: values.description || "",
      date: values.date,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-yellow-50 p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-yellow-900">Add New Transaction</h2>
          <Sparkles className="h-5 w-5 text-yellow-600" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-800 font-medium">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-yellow-100/50 border-yellow-200 text-yellow-900">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-yellow-50 border-yellow-200">
                      {categories.map((category) => (
                        <SelectItem 
                          key={category.name} 
                          value={category.name}
                          className="text-yellow-900 hover:bg-yellow-100 flex items-center gap-2"
                        >
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-800 font-medium">Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field} 
                        className="bg-yellow-100/50 border-yellow-200 text-yellow-900 placeholder:text-yellow-700/50"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-800 font-medium">Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-yellow-100/50 border-yellow-200 text-yellow-900",
                              !field.value && "text-yellow-700/50"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-yellow-800 font-medium">Description (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-yellow-100/50 border-yellow-200 text-yellow-900 placeholder:text-yellow-700/50"
                      placeholder="What's this expense for?"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="bg-yellow-100/50 border-yellow-200 text-yellow-900 hover:bg-yellow-200/50"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
              >
                Add Expense
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

