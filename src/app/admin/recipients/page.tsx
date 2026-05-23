import prisma from '@/lib/prisma'
import RecipientManager from '@/components/admin/RecipientManager'

export default async function RecipientsPage() {
  const recipients = await prisma.recipient.findMany({ orderBy: { fullName: 'asc' } })

  return (
    <div>
      <h1 className="font-black text-2xl text-brand-black mb-6">נמענים</h1>
      <RecipientManager
        initialRecipients={recipients.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}
