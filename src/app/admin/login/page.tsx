'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/campaigns')
    } else {
      setError('סיסמה שגויה')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-brand-yellow flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-sm shadow-sm w-full max-w-sm">
        <div className="text-center mb-6">
          <img src="/alarm-clock.svg" alt="" aria-hidden="true" className="w-20 h-20 mb-2 mx-auto" />
          <h1 className="font-black text-2xl text-brand-black">כניסת מנהל</h1>
          <div className="text-brand-red text-sm font-medium mt-1">רחובות מתעוררת</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-brand-black font-bold mb-1 text-sm" htmlFor="password">
              סיסמה
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-brand-black rounded-sm px-3 py-2 text-brand-black outline-none focus:border-brand-red"
              required
              autoFocus
            />
          </div>

          {error && <p className="text-brand-red text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-black text-white font-bold py-3 rounded-sm hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'מתחבר...' : 'כניסה'}
          </button>
        </form>
      </div>
    </main>
  )
}
