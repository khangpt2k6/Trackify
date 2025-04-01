import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

// This is a mock user database - replace with your actual database
const MOCK_USERS = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    // In a real app, this would be hashed
    password: 'Password123!',
  },
]

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectDB()
    console.log('Connected to MongoDB')

    // Parse request body
    const body = await request.json()
    const { email, password } = body

    console.log('Attempting sign in for email:', email)

    if (!email || !password) {
      console.log('Missing credentials')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      console.log('Invalid password for user:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('Successful sign in for user:', email)

    // Return user data (excluding password)
    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    })
  } catch (error) {
    console.error('Sign-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 