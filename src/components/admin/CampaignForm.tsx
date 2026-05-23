'use client'

import { useState, useEffect, useRef } from 'react'
import type { CampaignFormData, CampaignFormErrors, Recipient } from '@/types/campaign'

interface Props {
  initialData?: Partial<CampaignFormData>
  onSubmit: (data: CampaignFormData) => Promise<void>
  submitLabel: string
}

export default function CampaignForm({ initialData, onSubmit, submitLabel }: Props) {
  const [data, setData] = useState<CampaignFormData>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    messageText: initialData?.messageText ?? '',
    ctaText: initialData?.ctaText ?? 'שלחו הודעה עכשיו',
    imageUrl: initialData?.imageUrl ?? '',
    isActive: initialData?.isActive ?? true,
    recipientIds: initialData?.recipientIds ?? [],
  })
  const [allRecipients, setAllRecipients] = useState<Recipient[]>([])
  const [errors, setErrors] = useState<CampaignFormErrors>({})
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/recipients')
      .then((r) => r.json())
      .then((d) => setAllRecipients(d.recipients ?? []))
  }, [])

  const set = (field: keyof Omit<CampaignFormData, 'recipientIds' | 'isActive'>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [field]: e.target.value }))

  const toggleRecipient = (id: number) => {
    setData((prev) => ({
      ...prev,
      recipientIds: prev.recipientIds.includes(id)
        ? prev.recipientIds.filter((r) => r !== id)
        : [...prev.recipientIds, id],
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) {
        setUploadError(json.error ?? 'שגיאה בהעלאה')
      } else {
        setData((prev) => ({ ...prev, imageUrl: json.url }))
      }
    } catch {
      setUploadError('שגיאה בהעלאה — נסו שנית')
    } finally {
      setUploading(false)
    }
  }

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

      {/* Recipients */}
      <div>
        <label className={label}>נמענים לקמפיין</label>
        {allRecipients.length === 0 ? (
          <p className="text-gray-400 text-sm py-2">
            אין נמענים עדיין —{' '}
            <a href="/admin/recipients" className="underline text-brand-black">
              הוסיפו נמענים תחילה
            </a>
          </p>
        ) : (
          <div className="border-2 border-gray-300 rounded-sm divide-y divide-gray-100 max-h-56 overflow-y-auto">
            {allRecipients.map((r) => (
              <label
                key={r.id}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={data.recipientIds.includes(r.id)}
                  onChange={() => toggleRecipient(r.id)}
                  className="w-4 h-4 accent-brand-red"
                />
                <span className="font-medium text-brand-black text-sm">{r.fullName}</span>
                <span className="text-gray-500 text-sm">— {r.jobTitle}</span>
              </label>
            ))}
          </div>
        )}
        {data.recipientIds.length > 0 && (
          <p className="text-gray-500 text-xs mt-1">{data.recipientIds.length} נמענים נבחרו</p>
        )}
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
        <label className={label}>תמונה לקמפיין (אופציונלי)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        {data.imageUrl ? (
          <div className="relative inline-block">
            <img
              src={data.imageUrl}
              alt=""
              className="w-full max-h-40 object-cover rounded-sm border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={() => setData((prev) => ({ ...prev, imageUrl: '' }))}
              className="absolute top-1 left-1 bg-brand-black text-white text-xs font-bold px-2 py-1 rounded-sm hover:opacity-80"
            >
              הסר
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="border-2 border-dashed border-gray-300 rounded-sm px-6 py-4 w-full text-sm text-gray-500 hover:border-brand-black hover:text-brand-black transition-colors disabled:opacity-60"
          >
            {uploading ? 'מעלה תמונה...' : '+ בחרו תמונה (עד 5MB)'}
          </button>
        )}
        {uploadError && <p className={errText}>{uploadError}</p>}
        {uploading && (
          <p className="text-gray-500 text-xs mt-1">מעלה תמונה...</p>
        )}
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
