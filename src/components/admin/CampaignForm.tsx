'use client'

import { useState } from 'react'
import type { CampaignFormData, CampaignFormErrors } from '@/types/campaign'

interface Props {
  initialData?: Partial<CampaignFormData>
  onSubmit: (data: CampaignFormData) => Promise<void>
  submitLabel: string
}

export default function CampaignForm({ initialData, onSubmit, submitLabel }: Props) {
  const [data, setData] = useState<CampaignFormData>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    targetPhone: initialData?.targetPhone ?? '',
    messageText: initialData?.messageText ?? '',
    ctaText: initialData?.ctaText ?? 'שלחו הודעה עכשיו',
    imageUrl: initialData?.imageUrl ?? '',
    isActive: initialData?.isActive ?? true,
  })
  const [errors, setErrors] = useState<CampaignFormErrors>({})
  const [loading, setLoading] = useState(false)

  const set = (field: keyof CampaignFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      await onSubmit(data)
    } catch (err: unknown) {
      const fields = (err as { fields?: CampaignFormErrors }).fields
      if (fields) setErrors(fields)
    } finally {
      setLoading(false)
    }
  }

  const label = 'block text-brand-black font-bold mb-1 text-sm'
  const input = (hasError: boolean) =>
    `w-full border-2 ${hasError ? 'border-brand-red' : 'border-gray-300'} rounded-sm px-3 py-2 text-brand-black focus:border-brand-black outline-none`
  const errText = 'text-brand-red text-xs mt-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={label}>כותרת הקמפיין *</label>
        <input
          type="text"
          value={data.title}
          onChange={set('title')}
          className={input(!!errors.title)}
          maxLength={200}
          required
        />
        {errors.title && <p className={errText}>{errors.title}</p>}
      </div>

      <div>
        <label className={label}>תיאור קצר *</label>
        <textarea
          value={data.description}
          onChange={set('description')}
          className={input(!!errors.description)}
          rows={4}
          maxLength={5000}
          required
        />
        {errors.description && <p className={errText}>{errors.description}</p>}
      </div>

      <div>
        <label className={label}>מספר וואטסאפ יעד *</label>
        <input
          type="tel"
          value={data.targetPhone}
          onChange={set('targetPhone')}
          className={input(!!errors.targetPhone)}
          placeholder="+972501234567"
          required
          dir="ltr"
        />
        {errors.targetPhone && <p className={errText}>{errors.targetPhone}</p>}
        <p className="text-gray-500 text-xs mt-1">הכניסו מספר בפורמט בינלאומי, לדוגמה: +972501234567</p>
      </div>

      <div>
        <label className={label}>נוסח ההודעה *</label>
        <textarea
          value={data.messageText}
          onChange={set('messageText')}
          className={input(!!errors.messageText)}
          rows={6}
          maxLength={2000}
          required
        />
        {errors.messageText && <p className={errText}>{errors.messageText}</p>}
        <p className="text-gray-500 text-xs mt-1">{data.messageText.length}/2000 תווים</p>
      </div>

      <div>
        <label className={label}>טקסט לכפתור</label>
        <input
          type="text"
          value={data.ctaText}
          onChange={set('ctaText')}
          className={input(false)}
          maxLength={100}
        />
      </div>

      <div>
        <label className={label}>קישור לתמונה (אופציונלי)</label>
        <input
          type="url"
          value={data.imageUrl}
          onChange={set('imageUrl')}
          className={input(!!errors.imageUrl)}
          placeholder="https://..."
          dir="ltr"
        />
        {errors.imageUrl && <p className={errText}>{errors.imageUrl}</p>}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          checked={data.isActive}
          onChange={(e) => setData((prev) => ({ ...prev, isActive: e.target.checked }))}
          className="w-5 h-5 accent-brand-red"
        />
        <label htmlFor="isActive" className="text-brand-black font-bold text-sm">
          קמפיין פעיל
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-red text-white font-black text-lg py-4 rounded-sm hover:opacity-90 disabled:opacity-60"
      >
        {loading ? 'שומר...' : submitLabel}
      </button>
    </form>
  )
}
