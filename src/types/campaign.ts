export interface CampaignMessage {
  id: number
  body: string
  sortOrder: number
}

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
  messageText: string | null
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
  messages: CampaignMessage[]
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
  messageTexts: string[]
  ctaText: string
  imageUrl: string
  isActive: boolean
  recipientIds: number[]
}

export type CampaignFormErrors = Partial<Record<keyof CampaignFormData, string>>
