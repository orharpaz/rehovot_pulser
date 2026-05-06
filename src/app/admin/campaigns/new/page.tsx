'use client'

import { useState } from 'react'
import Link from 'next/link'
import CampaignForm from '@/components/admin/CampaignForm'
import type { CampaignFormData } from '@/types/campaign'

interface CreatedCampaign {
  slug: string
  publicUrl: string
}

export default function NewCampaignPage() {
  const [created, setCreated] = useState<CreatedCampaign | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (data: CampaignFormData) => {
    const res = await fetch('/api/admin/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const json = await res.json()

    if (!res.ok) {
      const err: unknown = new Error(json.error)
      ;(err as { fields?: unknown }).fields = json.fields
      throw err
    }

    setCreated({ slug: json.campaign.slug, publicUrl: json.campaign.publicUrl })
  }

  const copyLink = () => {
    if (!created) return
    navigator.clipboard.writeText(window.location.origin + created.publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (created) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white p-8 rounded-sm border-4 border-brand-yellow text-center">
          <div className="text-5xl mb-4" aria-hidden="true">✅</div>
          <h2 className="font-black text-2xl text-brand-black mb-2">הקמפיין נוצר בהצלחה!</h2>
          <p className="text-gray-600 mb-6">הקישור שלך לשיתוף:</p>

          <div
            className="bg-gray-100 rounded-sm p-3 mb-4 break-all text-sm font-mono text-left"
            dir="ltr"
          >
            {typeof window !== 'undefined' ? window.location.origin : ''}
            {created.publicUrl}
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyLink}
              className="flex-1 bg-brand-black text-white font-bold py-3 rounded-sm hover:opacity-90"
            >
              {copied ? '✓ הועתק' : 'העתק קישור'}
            </button>
            <Link
              href={created.publicUrl}
              target="_blank"
              className="flex-1 bg-brand-yellow text-brand-black font-bold py-3 rounded-sm hover:opacity-90 text-center"
            >
              צפה בדף
            </Link>
          </div>

          <Link
            href="/admin/campaigns"
            className="block mt-4 text-sm text-gray-500 hover:text-brand-black"
          >
            חזרה לרשימת הקמפיינים
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/campaigns" className="text-gray-500 hover:text-brand-black font-bold">
          →
        </Link>
        <h1 className="font-black text-2xl text-brand-black">יצירת קמפיין חדש</h1>
      </div>

      <div className="bg-white p-6 rounded-sm">
        <CampaignForm onSubmit={handleSubmit} submitLabel="יצירת קישור לקמפיין" />
      </div>
    </div>
  )
}
