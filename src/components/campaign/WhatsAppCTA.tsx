'use client'

import { useState } from 'react'

interface Props {
  ctaText: string
  isActive: boolean
  onAction: () => void
}

export default function WhatsAppCTA({ ctaText, isActive, onAction }: Props) {
  const [disabled, setDisabled] = useState(false)

  const handleClick = () => {
    if (disabled || !isActive) return
    setDisabled(true)
    onAction()
    setTimeout(() => setDisabled(false), 3000)
  }

  if (!isActive) {
    return (
      <div className="w-full bg-brand-black text-white text-center font-bold py-4 px-6 rounded-sm text-lg">
        הקמפיין הסתיים
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="w-full bg-brand-red text-white font-black text-xl py-4 px-6 rounded-sm
                 hover:opacity-90 active:scale-95 transition-all
                 disabled:opacity-60 disabled:cursor-not-allowed
                 flex items-center justify-center gap-3 min-h-[56px]"
    >
      <span>📱</span>
      <span>{disabled ? 'פותח וואטסאפ...' : ctaText}</span>
    </button>
  )
}
