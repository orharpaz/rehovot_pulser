import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import CampaignHero from '@/components/campaign/CampaignHero'
import CampaignActions from '@/components/campaign/CampaignActions'
import CampaignFooter from '@/components/campaign/CampaignFooter'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const campaign = await prisma.campaign.findUnique({ where: { slug: params.slug } })
  if (!campaign) return { title: 'קמפיין לא נמצא' }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const pageUrl = `${baseUrl}/campaign/${campaign.slug}`

  return {
    title: campaign.title,
    description: campaign.description,
    openGraph: {
      title: campaign.title,
      description: campaign.description,
      url: pageUrl,
      siteName: 'רחובות מתעוררת',
      type: 'website',
      locale: 'he_IL',
      ...(campaign.imageUrl ? { images: [{ url: campaign.imageUrl }] } : {}),
    },
    twitter: {
      card: campaign.imageUrl ? 'summary_large_image' : 'summary',
      title: campaign.title,
      description: campaign.description,
      ...(campaign.imageUrl ? { images: [campaign.imageUrl] } : {}),
    },
  }
}

export default async function CampaignPage({ params }: Props) {
  const campaign = await prisma.campaign.findUnique({
    where: { slug: params.slug },
    include: { recipients: { include: { recipient: true } } },
  })

  if (!campaign) notFound()

  const recipients = campaign.recipients.map((r) => r.recipient)
  const whatsappLink = campaign.targetPhone
    ? buildWhatsAppLink(campaign.targetPhone, campaign.messageText)
    : ''

  return (
    <main className="min-h-screen bg-brand-yellow flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 max-w-lg mx-auto w-full">
        <CampaignHero
          title={campaign.title}
          description={campaign.description}
          imageUrl={campaign.imageUrl ?? undefined}
        />

        <div className="w-full mt-8 space-y-4">
          <CampaignActions
            slug={campaign.slug}
            ctaText={campaign.ctaText}
            whatsappLink={whatsappLink}
            isActive={campaign.isActive}
            initialCount={campaign.clicksCount}
            recipients={recipients}
            messageText={campaign.messageText}
          />

          {campaign.isActive && (
            <p className="text-center text-brand-black font-medium text-sm">
              זה לוקח פחות מדקה ויכול לעשות שינוי.
            </p>
          )}
        </div>
      </div>

      <CampaignFooter />
    </main>
  )
}
