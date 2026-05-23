'use client'

import { useState } from 'react'
import ClickCounter from './ClickCounter'
import WhatsAppCTA from './WhatsAppCTA'
import { buildWhatsAppLink } from '@/lib/whatsapp'

interface Recipient {
  id: number
  fullName: string
  jobTitle: string
  phone: string
}

interface Props {
  slug: string
  ctaText: string
  whatsappLink: string
  isActive: boolean
  initialCount: number
  recipients: Recipient[]
  messageText: string
}

export default function CampaignActions({
  slug,
  ctaText,
  whatsappLink,
  isActive,
  initialCount,
  recipients,
  messageText,
}: Props) {
  const [count, setCount] = useState(initialCount)
  const [selectedId, setSelectedId] = useState<number | null>(
    recipients.length === 1 ? recipients[0].id : null
  )

  const hasRecipients = recipients.length > 0
  const selectedRecipient = hasRecipients
    ? recipients.find((r) => r.id === selectedId) ?? null
    : null

  const resolvedLink = hasRecipients
    ? selectedRecipient
      ? buildWhatsAppLink(selectedRecipient.phone, messageText)
      : ''
    : whatsappLink

  const canSend = isActive && (hasRecipients ? !!selectedRecipient : !!resolvedLink)

  const handleAction = () => {
    if (!canSend) return
    setCount((c) => c + 1)
    fetch(`/api/campaigns/${slug}/click`, { method: 'POST' }).catch(() => {})
    window.open(resolvedLink, '_blank')
  }

  return (
    <div className="w-full space-y-4">
      <ClickCounter count={count} />

      {hasRecipients && recipients.length > 1 && (
        <div>
          <label className="block text-brand-black font-bold text-sm mb-2">
            בחרו למי לשלוח:
          </label>
          <select
            value={selectedId ?? ''}
            onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
            className="w-full border-2 border-brand-black rounded-sm px-3 py-3 text-brand-black font-medium bg-white focus:outline-none text-base"
          >
            <option value="">— בחרו נמען —</option>
            {recipients.map((r) => (
              <option key={r.id} value={r.id}>
                {r.fullName} — {r.jobTitle}
              </option>
            ))}
          </select>
        </div>
      )}

      <WhatsAppCTA ctaText={ctaText} isActive={canSend} onAction={handleAction} />
    </div>
  )
}
