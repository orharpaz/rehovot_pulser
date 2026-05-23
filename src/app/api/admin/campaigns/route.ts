import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateCampaign } from '@/lib/validation'
import { generateUniqueSlug } from '@/lib/slug'
import { isValidSessionToken } from '@/lib/auth'

function checkAuth(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session')
  return session?.value ? isValidSessionToken(session.value) : false
}

function serializeCampaign(c: {
  id: number; slug: string; title: string; description: string
  targetPhone: string | null; messageText: string; ctaText: string
  imageUrl: string | null; clicksCount: number; isActive: boolean
  createdAt: Date; updatedAt: Date
  recipients?: { recipient: { id: number; fullName: string; jobTitle: string; phone: string; createdAt: Date } }[]
}) {
  return {
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    publicUrl: `/campaign/${c.slug}`,
    recipients: (c.recipients ?? []).map((r) => ({
      ...r.recipient,
      createdAt: r.recipient.createdAt.toISOString(),
    })),
  }
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: 'desc' },
    include: { recipients: { include: { recipient: true } } },
  })

  return NextResponse.json({ campaigns: campaigns.map(serializeCampaign) })
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const errors = validateCampaign(body)

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400 })
  }

  const slug = body.slug || (await generateUniqueSlug())
  const recipientIds: number[] = body.recipientIds ?? []

  const campaign = await prisma.campaign.create({
    data: {
      slug,
      title: body.title,
      description: body.description,
      messageText: body.messageText,
      ctaText: body.ctaText || 'שלחו הודעה עכשיו',
      imageUrl: body.imageUrl || null,
      isActive: body.isActive ?? true,
      recipients: {
        create: recipientIds.map((id) => ({ recipientId: id })),
      },
    },
    include: { recipients: { include: { recipient: true } } },
  })

  return NextResponse.json({ campaign: serializeCampaign(campaign) }, { status: 201 })
}
