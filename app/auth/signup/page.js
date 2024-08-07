'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaGoogle, FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        toast.success('Account created successfully! Please sign in.')
        router.push('/auth/signin')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Something went wrong')
      }
    } catch (error) {
      console.error('An unexpected error happened:', error)
      toast.error('An unexpected error occurred')
    }
  }

  const handleGoogleSignUp = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="px-8 py-6 mt-4 text-left bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-lg w-full max-w-md">
        <Link href="/" className="absolute top-4 left-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors">
          <FaArrowLeft className="text-gray-600" />
        </Link>
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Create an account</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline">
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-6">
          <button 
            onClick={handleGoogleSignUp} 
            className="w-full px-4 py-2 flex items-center justify-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:shadow-outline"
          >
            <FaGoogle className="mr-2" />
            Sign up with Google
          </button>
        </div>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  )
}