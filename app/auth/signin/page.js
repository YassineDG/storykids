'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaGoogle, FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Signed in successfully!')
        router.push('/')
      }
    } catch (error) {
      console.error('An unexpected error happened:', error)
      toast.error('An unexpected error occurred')
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="px-8 py-6 mt-4 text-left bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-lg w-full max-w-md">
        <Link href="/" className="absolute top-4 left-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors">
          <FaArrowLeft className="text-gray-600" />
        </Link>
        
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Sign in to your account</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline">
              Sign In
            </button>
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
        </form>
        <div className="mt-6">
          <button 
            onClick={handleGoogleSignIn} 
            className="w-full px-4 py-2 flex items-center justify-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:shadow-outline"
          >
            <FaGoogle className="mr-2" />
            Sign in with Google
          </button>
        </div>
        <div className="mt-6 text-center">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  )
}
