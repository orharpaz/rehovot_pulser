import prisma from '@/lib/prisma'

export interface ContactStat {
  id: number
  fullName: string
  jobTitle: string
  count: number
}

export interface CampaignStat {
  id: number
  slug: string
  title: string
  isActive: boolean
  total: number
  // null for targetPhone campaigns (no recipient list)
  perContact: ContactStat[] | null
  // Clicks recorded before per-contact tracking existed
  unattributed: number
}

export interface HomepageStats {
  totalSends: number
  campaignCount: number
  activeCount: number
  topCampaigns: CampaignStat[]
  campaigns: CampaignStat[]
}

export async function getHomepageStats(): Promise<HomepageStats> {
  const [campaigns, grouped] = await Promise.all([
    prisma.campaign.findMany({
      orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        slug: true,
        title: true,
        isActive: true,
        clicksCount: true,
        // Public page: never select phone numbers
        recipients: {
          select: { recipient: { select: { id: true, fullName: true, jobTitle: true } } },
        },
      },
    }),
    prisma.clickEvent.groupBy({
      by: ['campaignId', 'recipientId'],
      where: { recipientId: { not: null } },
      _count: { _all: true },
    }),
  ])

  const countsByCampaign = new Map<number, Map<number, number>>()
  for (const row of grouped) {
    if (row.recipientId === null) continue
    const byRecipient = countsByCampaign.get(row.campaignId) ?? new Map<number, number>()
    byRecipient.set(row.recipientId, row._count._all)
    countsByCampaign.set(row.campaignId, byRecipient)
  }

  const campaignStats: CampaignStat[] = campaigns.map((c) => {
    if (c.recipients.length === 0) {
      return { id: c.id, slug: c.slug, title: c.title, isActive: c.isActive, total: c.clicksCount, perContact: null, unattributed: 0 }
    }

    const counts = countsByCampaign.get(c.id)
    const perContact = c.recipients
      .map(({ recipient }) => ({ ...recipient, count: counts?.get(recipient.id) ?? 0 }))
      .sort((a, b) => b.count - a.count)
    const attributed = perContact.reduce((sum, r) => sum + r.count, 0)

    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      isActive: c.isActive,
      total: c.clicksCount,
      perContact,
      unattributed: Math.max(0, c.clicksCount - attributed),
    }
  })

  return {
    totalSends: campaignStats.reduce((sum, c) => sum + c.total, 0),
    campaignCount: campaignStats.length,
    activeCount: campaignStats.filter((c) => c.isActive).length,
    topCampaigns: campaignStats
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5),
    campaigns: campaignStats,
  }
}
