import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const campaigns = await prisma.campaign.findMany({ where: { messageText: { not: null } } })
  for (const c of campaigns) {
    const existing = await prisma.campaignMessage.findFirst({ where: { campaignId: c.id } })
    if (!existing && c.messageText) {
      await prisma.campaignMessage.create({ data: { campaignId: c.id, body: c.messageText, sortOrder: 0 } })
      console.log('Migrated campaign', c.id, c.slug)
    }
  }
  console.log('Done')
}

main().catch(console.error).finally(() => prisma.$disconnect())
