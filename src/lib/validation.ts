interface CampaignInput {
  title?: string
  description?: string
  messageText?: string
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

  if (!partial || data.messageText !== undefined) {
    if (!data.messageText?.trim()) errors.messageText = 'נוסח ההודעה נדרש'
    else if (data.messageText.length > 2000) errors.messageText = 'ההודעה ארוכה מדי (מקסימום 2000 תווים)'
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
