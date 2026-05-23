import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateCampaign } from '@/lib/validation'
import { isValidSessionToken } from '@/lib/auth'

function checkAuth(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session')
  return session?.value ? isValidSessionToken(session.value) : false
}

function serializeCampaign(c: {
  id: number; slug: string; title: string; description: string
  targetPhone: string | null; messageText: string | null; ctaText: string
  imageUrl: string | null; clicksCount: number; isActive: boolean
  createdAt: Date; updatedAt: Date
  recipients: { recipient: { id: number; fullName: string; jobTitle: string; phone: string; createdAt: Date } }[]
  messages: { id: number; body: string; sortOrder: number }[]
}) {
  return {
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    publicUrl: `/campaign/${c.slug}`,
    recipients: c.recipients.map((r) => ({
      ...r.recipient,
      createdAt: r.recipient.createdAt.toISOString(),
    })),
    messages: c.messages.map((m) => ({ id: m.id, body: m.body, sortOrder: m.sortOrder })),
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      recipients: { include: { recipient: true } },
      messages: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  return NextResponse.json({ campaign: serializeCampaign(campaign) })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = parseInt(params.id)
  const campaign = await prisma.campaign.findUnique({ where: { id } })

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  const body = await request.json()
  const errors = validateCampaign(body, true)

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400 })
  }

  const recipientIds: number[] | undefined = body.recipientIds
  const messageTexts: string[] | undefined = body.messageTexts

  const updated = await prisma.campaign.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.ctaText !== undefined && { ctaText: body.ctaText }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl || null }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(recipientIds !== undefined && {
        recipients: {
          deleteMany: {},
          create: recipientIds.map((rid) => ({ recipientId: rid })),
        },
      }),
      ...(messageTexts !== undefined && {
        messages: {
          deleteMany: {},
          create: messageTexts.map((body, i) => ({ body, sortOrder: i })),
        },
      }),
    },
    include: {
      recipients: { include: { recipient: true } },
      messages: { orderBy: { sortOrder: 'asc' } },
    },
  })

  return NextResponse.json({ campaign: serializeCampaign(updated) })
}
