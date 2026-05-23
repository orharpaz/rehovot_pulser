import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { isValidSessionToken } from '@/lib/auth'
import { isValidPhone, normalizePhone } from '@/lib/whatsapp'

function checkAuth(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session')
  return session?.value ? isValidSessionToken(session.value) : false
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const recipients = await prisma.recipient.findMany({ orderBy: { fullName: 'asc' } })

  return NextResponse.json({
    recipients: recipients.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
  })
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const errors: Record<string, string> = {}

  if (!body.fullName?.trim()) errors.fullName = 'שם מלא נדרש'
  if (!body.jobTitle?.trim()) errors.jobTitle = 'תפקיד נדרש'
  if (!body.phone?.trim()) errors.phone = 'מספר טלפון נדרש'
  else if (!isValidPhone(body.phone)) errors.phone = 'מספר הטלפון אינו תקין'

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fields: errors }, { status: 400 })
  }

  const recipient = await prisma.recipient.create({
    data: {
      fullName: body.fullName.trim(),
      jobTitle: body.jobTitle.trim(),
      phone: normalizePhone(body.phone),
    },
  })

  return NextResponse.json(
    { recipient: { ...recipient, createdAt: recipient.createdAt.toISOString() } },
    { status: 201 }
  )
}
