import { Metadata } from "next"
import ExpenseTracker from "@/components/expense-tracker"

export const metadata: Metadata = {
  title: "Dashboard | Expense Tracker",
  description: "Manage and track your expenses efficiently",
}

export default function DashboardPage() {
  return <ExpenseTracker />
} 