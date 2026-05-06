'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { CampaignWithUrl } from '@/types/campaign'

interface Props {
  campaigns: CampaignWithUrl[]
}

export default function CampaignTable({ campaigns }: Props) {
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const copyLink = (campaign: CampaignWithUrl) => {
    navigator.clipboard.writeText(window.location.origin + campaign.publicUrl)
    setCopiedId(campaign.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="text-5xl mb-3" aria-hidden="true">📭</div>
        <p className="font-medium">אין קמפיינים עדיין</p>
        <p className="text-sm mt-1">לחצו על "+ קמפיין חדש" כדי להתחיל</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="bg-white rounded-sm p-6 border border-gray-200">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
                    campaign.isActive
                      ? 'bg-brand-yellow text-brand-black'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {campaign.isActive ? 'פעיל' : 'לא פעיל'}
                </span>
                <h3 className="font-black text-brand-black text-lg truncate">{campaign.title}</h3>
              </div>
              <p className="text-gray-500 text-sm font-mono" dir="ltr">
                {campaign.targetPhone}
              </p>
            </div>

            <div className="text-center shrink-0">
              <div className="font-black text-3xl text-brand-black">
                {campaign.clicksCount.toLocaleString('he-IL')}
              </div>
              <div className="text-gray-500 text-xs">לחיצות</div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              onClick={() => copyLink(campaign)}
              className="text-sm bg-brand-black text-white font-bold px-3 py-1.5 rounded-sm hover:opacity-90"
            >
              {copiedId === campaign.id ? '✓ הועתק' : 'העתק קישור'}
            </button>
            <Link
              href={campaign.publicUrl}
              target="_blank"
              className="text-sm bg-brand-yellow text-brand-black font-bold px-3 py-1.5 rounded-sm hover:opacity-90"
            >
              צפה בדף
            </Link>
            <Link
              href={`/admin/campaigns/${campaign.id}/edit`}
              className="text-sm border-2 border-gray-300 text-gray-600 font-bold px-3 py-1.5 rounded-sm hover:border-brand-black hover:text-brand-black"
            >
              עריכה
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
