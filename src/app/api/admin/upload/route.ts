import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { isValidSessionToken } from '@/lib/auth'

function checkAuth(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session')
  return session?.value ? isValidSessionToken(session.value) : false
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await request.formData()
  const file = form.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'הקובץ גדול מדי (מקסימום 5MB)' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'ניתן להעלות תמונות בלבד' }, { status: 400 })
  }

  const blob = await put(`campaigns/${Date.now()}-${file.name}`, file, { access: 'public' })

  return NextResponse.json({ url: blob.url })
}
