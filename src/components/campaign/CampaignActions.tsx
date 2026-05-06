'use client'

import { useState } from 'react'
import ClickCounter from './ClickCounter'
import WhatsAppCTA from './WhatsAppCTA'

interface Props {
  slug: string
  ctaText: string
  whatsappLink: string
  isActive: boolean
  initialCount: number
}

export default function CampaignActions({
  slug,
  ctaText,
  whatsappLink,
  isActive,
  initialCount,
}: Props) {
  const [count, setCount] = useState(initialCount)

  const handleAction = () => {
    setCount((c) => c + 1)
    fetch(`/api/campaigns/${slug}/click`, { method: 'POST' }).catch(() => {})
    window.open(whatsappLink, '_blank')
  }

  return (
    <div className="w-full space-y-4">
      <ClickCounter count={count} />
      <WhatsAppCTA ctaText={ctaText} isActive={isActive} onAction={handleAction} />
    </div>
  )
}
