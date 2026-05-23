'use client'

import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-brand-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/alarm-clock.svg" alt="" aria-hidden="true" className="w-8 h-8" />
            <span className="font-black text-lg">רחובות מתעוררת</span>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <a href="/admin/campaigns" className="px-3 py-1 rounded-sm hover:bg-white/10 font-medium">קמפיינים</a>
            <span className="text-brand-red" aria-hidden="true">◆</span>
            <a href="/admin/recipients" className="px-3 py-1 rounded-sm hover:bg-white/10 font-medium">נמענים</a>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium hover:text-brand-yellow transition-colors"
        >
          יציאה
        </button>
      </header>

      <main className="px-4 py-8 max-w-4xl mx-auto">{children}</main>
    </div>
  )
}
