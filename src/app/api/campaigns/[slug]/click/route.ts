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

    const [updated] = await prisma.$transaction([
      prisma.campaign.update({
        where: { id: campaign.id },
        data: { clicksCount: { increment: 1 } },
      }),
      prisma.clickEvent.create({
        data: {
          campaignId: campaign.id,
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
