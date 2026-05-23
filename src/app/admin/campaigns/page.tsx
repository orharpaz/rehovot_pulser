import Link from 'next/link'
import prisma from '@/lib/prisma'
import CampaignTable from '@/components/admin/CampaignTable'
import type { CampaignWithUrl } from '@/types/campaign'

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: 'desc' },
    include: { recipients: { include: { recipient: true } } },
  })

  const campaignsWithUrl: CampaignWithUrl[] = campaigns.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    publicUrl: `/campaign/${c.slug}`,
    recipients: c.recipients.map((r) => ({ ...r.recipient, createdAt: r.recipient.createdAt.toISOString() })),
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-black text-2xl text-brand-black">קמפיינים</h1>
        <Link
          href="/admin/campaigns/new"
          className="bg-brand-red text-white font-bold px-5 py-2 rounded-sm hover:opacity-90"
        >
          + קמפיין חדש
        </Link>
      </div>

      <CampaignTable campaigns={campaignsWithUrl} />
    </div>
  )
}
