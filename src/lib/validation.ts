interface CampaignInput {
  title?: string
  description?: string
  messageTexts?: string[]
  ctaText?: string
  imageUrl?: string
}

export function validateCampaign(
  data: CampaignInput,
  partial = false
): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!partial || data.title !== undefined) {
    if (!data.title?.trim()) errors.title = 'כותרת הקמפיין נדרשת'
    else if (data.title.length > 200) errors.title = 'הכותרת ארוכה מדי (מקסימום 200 תווים)'
  }

  if (!partial || data.description !== undefined) {
    if (!data.description?.trim()) errors.description = 'תיאור הקמפיין נדרש'
    else if (data.description.length > 5000) errors.description = 'התיאור ארוך מדי'
  }

  if (!partial || data.messageTexts !== undefined) {
    if (!data.messageTexts || data.messageTexts.length === 0) {
      errors.messageTexts = 'נדרש לפחות נוסח הודעה אחד'
    } else {
      const allEmpty = data.messageTexts.every((m) => !m.trim())
      if (allEmpty) errors.messageTexts = 'נדרש לפחות נוסח הודעה אחד'
      const tooLong = data.messageTexts.find((m) => m.length > 2000)
      if (tooLong) errors.messageTexts = 'הודעה ארוכה מדי (מקסימום 2000 תווים)'
    }
  }

  if (data.imageUrl) {
    try {
      new URL(data.imageUrl)
    } catch {
      errors.imageUrl = 'כתובת התמונה אינה תקינה'
    }
  }

  return errors
}
