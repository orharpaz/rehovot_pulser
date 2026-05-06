import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateCampaign } from '@/lib/validation'
import { normalizePhone } from '@/lib/whatsapp'
import { isValidSessionToken } from '@/lib/auth'

function checkAuth(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session')
  return session?.value ? isValidSessionToken(session.value) : false
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const campaign = await prisma.campaign.findUnique({ where: { id: parseInt(params.id) } })

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  return NextResponse.json({
    campaign: {
      ...campaign,
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString(),
      publicUrl: `/campaign/${campaign.slug}`,
    },
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const campaign = await prisma.campaign.findUnique({ where: { id: parseInt(params.id) } })

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  const body = await request.json()
  const errors = validateCampaign({ ...campaign, ...body }, true)

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400 })
  }

  const updated = await prisma.campaign.update({
    where: { id: campaign.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.targetPhone !== undefined && { targetPhone: normalizePhone(body.targetPhone) }),
      ...(body.messageText !== undefined && { messageText: body.messageText }),
      ...(body.ctaText !== undefined && { ctaText: body.ctaText }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl || null }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    },
  })

  return NextResponse.json({
    campaign: {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      publicUrl: `/campaign/${updated.slug}`,
    },
  })
}
