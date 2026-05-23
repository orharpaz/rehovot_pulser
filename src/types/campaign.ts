export interface Recipient {
  id: number
  fullName: string
  jobTitle: string
  phone: string
  createdAt: string
}

export interface Campaign {
  id: number
  slug: string
  title: string
  description: string
  targetPhone: string | null
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
  recipients: Recipient[]
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
  messageText: string
  ctaText: string
  imageUrl: string
  isActive: boolean
  recipientIds: number[]
}

export type CampaignFormErrors = Partial<Record<keyof CampaignFormData, string>>
