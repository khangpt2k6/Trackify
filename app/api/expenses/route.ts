import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Expense from '@/models/Expense'

export async function GET() {
  try {
    await connectDB()
    const expenses = await Expense.find().sort({ date: -1 })
    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.amount || !body.category || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate amount is a positive number
    if (typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      )
    }

    await connectDB()
    
    const expense = await Expense.create({
      amount: body.amount,
      category: body.category,
      description: body.description || '',
      date: new Date(body.date)
    })

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create expense' },
      { status: 500 }
    )
  }
} 