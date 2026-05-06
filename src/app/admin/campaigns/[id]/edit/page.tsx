'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import CampaignForm from '@/components/admin/CampaignForm'
import type { CampaignFormData, CampaignWithUrl } from '@/types/campaign'

export default function EditCampaignPage() {
  const params = useParams()
  const [campaign, setCampaign] = useState<CampaignWithUrl | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/campaigns/${params.id}`)
      .then((r) => r.json())
      .then((d) => setCampaign(d.campaign))
  }, [params.id])

  const handleSubmit = async (data: CampaignFormData) => {
    const res = await fetch(`/api/admin/campaigns/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const json = await res.json()

    if (!res.ok) {
      const err: unknown = new Error(json.error)
      ;(err as { fields?: unknown }).fields = json.fields
      throw err
    }

    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (!campaign) {
    return (
      <div className="text-center py-16 text-gray-500 font-medium">טוען...</div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/campaigns" className="text-gray-500 hover:text-brand-black font-bold">
          →
        </Link>
        <h1 className="font-black text-2xl text-brand-black">עריכת קמפיין</h1>
      </div>

      {success && (
        <div className="bg-brand-yellow text-brand-black font-bold px-4 py-3 rounded-sm mb-4 flex items-center gap-2">
          <span>✓</span>
          <span>הקמפיין עודכן בהצלחה</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-sm mb-4">
        <CampaignForm
          initialData={{
            title: campaign.title,
            description: campaign.description,
            targetPhone: campaign.targetPhone,
            messageText: campaign.messageText,
            ctaText: campaign.ctaText,
            imageUrl: campaign.imageUrl ?? '',
            isActive: campaign.isActive,
          }}
          onSubmit={handleSubmit}
          submitLabel="שמירת שינויים"
        />
      </div>

      <div className="text-center">
        <Link
          href={campaign.publicUrl}
          target="_blank"
          className="text-sm text-gray-500 hover:text-brand-black underline"
        >
          צפה בדף הקמפיין
        </Link>
      </div>
    </div>
  )
}
