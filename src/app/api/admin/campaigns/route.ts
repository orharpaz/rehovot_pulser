import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateCampaign } from '@/lib/validation'
import { normalizePhone } from '@/lib/whatsapp'
import { generateUniqueSlug } from '@/lib/slug'
import { isValidSessionToken } from '@/lib/auth'

function checkAuth(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session')
  return session?.value ? isValidSessionToken(session.value) : false
}

const baseUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? ''

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } })

  return NextResponse.json({
    campaigns: campaigns.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      publicUrl: `/campaign/${c.slug}`,
    })),
  })
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

  const campaign = await prisma.campaign.create({
    data: {
      slug,
      title: body.title,
      description: body.description,
      targetPhone: normalizePhone(body.targetPhone),
      messageText: body.messageText,
      ctaText: body.ctaText || 'שלחו הודעה עכשיו',
      imageUrl: body.imageUrl || null,
      isActive: body.isActive ?? true,
    },
  })

  return NextResponse.json(
    {
      campaign: {
        ...campaign,
        createdAt: campaign.createdAt.toISOString(),
        updatedAt: campaign.updatedAt.toISOString(),
        publicUrl: `/campaign/${campaign.slug}`,
      },
    },
    { status: 201 }
  )
}
