import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.campaign.findUnique({ where: { slug: 'demo01' } })
  if (existing) {
    console.log('Demo campaign already exists at /campaign/demo01')
    return
  }

  await prisma.campaign.create({
    data: {
      slug: 'demo01',
      title: 'נדרשת תשובה דחופה מעיריית רחובות',
      description:
        'העירייה מתכננת לסגור את הספריה השכונתית. יחד נוכל לעצור את זה. שלחו הודעה לראש העיר עכשיו.',
      targetPhone: '972501234567',
      messageText:
        'שלום, אני תושב/ת רחובות ואני מתנגד/ת לסגירת הספריה השכונתית. אבקש לבחון מחדש את ההחלטה.',
      ctaText: 'שלחו הודעה עכשיו',
      isActive: true,
    },
  })

  console.log('✅ Demo campaign created: http://localhost:3000/campaign/demo01')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
