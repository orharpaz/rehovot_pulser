'use client'

import { useState } from 'react'
import type { Recipient } from '@/types/campaign'

interface Props {
  initialRecipients: Recipient[]
}

export default function RecipientManager({ initialRecipients }: Props) {
  const [recipients, setRecipients] = useState<Recipient[]>(initialRecipients)
  const [form, setForm] = useState({ fullName: '', jobTitle: '', phone: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const res = await fetch('/api/admin/recipients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const json = await res.json()
    setLoading(false)

    if (!res.ok) {
      setErrors(json.fields ?? {})
      return
    }

    setRecipients((prev) => [...prev, json.recipient].sort((a, b) => a.fullName.localeCompare(b.fullName, 'he')))
    setForm({ fullName: '', jobTitle: '', phone: '' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('האם למחוק נמען זה?')) return

    await fetch(`/api/admin/recipients/${id}`, { method: 'DELETE' })
    setRecipients((prev) => prev.filter((r) => r.id !== id))
  }

  const inp = (hasErr: boolean) =>
    `border-2 ${hasErr ? 'border-brand-red' : 'border-gray-300'} rounded-sm px-3 py-2 text-brand-black focus:border-brand-black outline-none text-sm`

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-white p-6 rounded-sm">
        <h2 className="font-bold text-brand-black mb-4">הוספת נמען חדש</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <input
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              placeholder="שם מלא *"
              className={inp(!!errors.fullName)}
            />
            {errors.fullName && <p className="text-brand-red text-xs mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <input
              value={form.jobTitle}
              onChange={(e) => setForm((p) => ({ ...p, jobTitle: e.target.value }))}
              placeholder="תפקיד *"
              className={inp(!!errors.jobTitle)}
            />
            {errors.jobTitle && <p className="text-brand-red text-xs mt-1">{errors.jobTitle}</p>}
          </div>
          <div>
            <input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+972501234567 *"
              dir="ltr"
              className={inp(!!errors.phone)}
            />
            {errors.phone && <p className="text-brand-red text-xs mt-1">{errors.phone}</p>}
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-red text-white font-bold px-6 py-2 rounded-sm hover:opacity-90 disabled:opacity-60 text-sm"
            >
              {loading ? 'שומר...' : '+ הוסף נמען'}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm overflow-hidden">
        {recipients.length === 0 ? (
          <p className="text-center py-12 text-gray-400 font-medium">אין נמענים עדיין</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-brand-black text-white">
              <tr>
                <th className="text-right px-4 py-3 font-bold">שם מלא</th>
                <th className="text-right px-4 py-3 font-bold">תפקיד</th>
                <th className="text-right px-4 py-3 font-bold" dir="ltr">טלפון</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {recipients.map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-brand-black">{r.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{r.jobTitle}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono" dir="ltr">{r.phone}</td>
                  <td className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-brand-red hover:opacity-70 font-bold text-xs"
                    >
                      מחק
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
