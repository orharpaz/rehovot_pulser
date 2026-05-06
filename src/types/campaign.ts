export interface Campaign {
  id: number
  slug: string
  title: string
  description: string
  targetPhone: string
  messageText: string
  ctaText: string
  imageUrl: string | null
  clicksCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CampaignWithUrl extends Campaign {
  publicUrl: string
}

export interface ClickEvent {
  id: number
  campaignId: number
  createdAt: string
  userAgent: string | null
  ipHash: string | null
  referrer: string | null
}

export interface CampaignFormData {
  title: string
  description: string
  targetPhone: string
  messageText: string
  ctaText: string
  imageUrl: string
  isActive: boolean
}

export type CampaignFormErrors = Partial<Record<keyof CampaignFormData, string>>
