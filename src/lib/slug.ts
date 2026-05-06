import prisma from './prisma'

function randomSlug(length = 7): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function generateUniqueSlug(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const slug = randomSlug()
    const existing = await prisma.campaign.findUnique({ where: { slug } })
    if (!existing) return slug
  }
  throw new Error('Could not generate unique slug after 10 attempts')
}
