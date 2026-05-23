'use client'

import { useState, useRef, useEffect } from 'react'
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
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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
        <div ref={dropdownRef} className="relative">
          <label className="block text-brand-black font-bold text-sm mb-2">
            בחרו למי לשלוח:
          </label>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-full border-2 border-brand-black rounded-sm px-3 py-3 text-brand-black font-medium bg-white text-right flex items-start justify-between gap-2"
          >
            <span className="whitespace-normal text-right leading-snug">
              {selectedRecipient
                ? <>{selectedRecipient.fullName}<br /><span className="text-sm font-normal text-gray-600">{selectedRecipient.jobTitle}</span></>
                : <span className="text-gray-400">— בחרו נמען —</span>
              }
            </span>
            <span className="mt-1 shrink-0">▾</span>
          </button>

          {open && (
            <div className="absolute z-10 w-full bg-white border-2 border-brand-black rounded-sm shadow-lg mt-1 max-h-60 overflow-y-auto">
              {recipients.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { setSelectedId(r.id); setOpen(false) }}
                  className={`w-full text-right px-3 py-3 hover:bg-brand-yellow transition-colors border-b border-gray-100 last:border-0 ${selectedId === r.id ? 'bg-brand-yellow' : ''}`}
                >
                  <div className="font-bold text-brand-black leading-snug">{r.fullName}</div>
                  <div className="text-sm text-gray-600">{r.jobTitle}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <WhatsAppCTA ctaText={ctaText} isActive={canSend} onAction={handleAction} />
    </div>
  )
}
