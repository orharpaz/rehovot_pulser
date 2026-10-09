import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import prisma from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const campaign = await prisma.campaign.findUnique({ where: { slug: params.slug } })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    if (!campaign.isActive) {
      return NextResponse.json({ error: 'Campaign is not active' }, { status: 400 })
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const ipHash = createHash('sha256').update(ip).digest('hex')

    // Optional body: { recipientId } — only kept if the recipient belongs to this campaign
    let recipientId: number | null = null
    try {
      const body = await request.json()
      if (Number.isInteger(body?.recipientId)) {
        const link = await prisma.campaignRecipient.findUnique({
          where: {
            campaignId_recipientId: { campaignId: campaign.id, recipientId: body.recipientId },
          },
        })
        if (link) recipientId = body.recipientId
      }
    } catch {
      // No or invalid body — record the click without a recipient
    }

    const [updated] = await prisma.$transaction([
      prisma.campaign.update({
        where: { id: campaign.id },
        data: { clicksCount: { increment: 1 } },
      }),
      prisma.clickEvent.create({
        data: {
          campaignId: campaign.id,
          recipientId,
          userAgent: request.headers.get('user-agent'),
          ipHash,
          referrer: request.headers.get('referer'),
        },
      }),
    ])

    return NextResponse.json({ success: true, clicksCount: updated.clicksCount })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
