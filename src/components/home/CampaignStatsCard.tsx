import Link from 'next/link'
import type { CampaignStat } from '@/lib/stats'

interface Props {
  campaign: CampaignStat
}

export default function CampaignStatsCard({ campaign }: Props) {
  const { perContact, total, unattributed } = campaign

  return (
    <div className="bg-white border-2 border-brand-black rounded-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span
            className={`inline-block text-xs font-bold px-2 py-0.5 rounded-sm mb-1 ${
              campaign.isActive ? 'bg-brand-yellow text-brand-black' : 'bg-brand-black text-white'
            }`}
          >
            {campaign.isActive ? 'פעיל' : 'הסתיים'}
          </span>
          <h3 className="font-black text-xl text-brand-black leading-snug">{campaign.title}</h3>
        </div>
        <div className="text-center shrink-0">
          <div className="font-black text-3xl text-brand-black">{total.toLocaleString('he-IL')}</div>
          <div className="text-xs font-medium text-brand-black">הודעות</div>
        </div>
      </div>

      {perContact && perContact.length > 0 && (
        <ul className="mt-4 space-y-3">
          {perContact.map((r) => (
            <li key={r.id}>
              <div className="flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-bold text-brand-black">{r.fullName}</span>
                  <span className="text-sm font-medium text-brand-black/70"> · {r.jobTitle}</span>
                </div>
                <span className="font-black text-brand-black shrink-0">{r.count.toLocaleString('he-IL')}</span>
              </div>
              <div className="h-1.5 bg-brand-black/10 mt-1">
                <div
                  className="h-full bg-brand-black"
                  style={{ width: total > 0 ? `${(r.count / total) * 100}%` : '0%' }}
                />
              </div>
            </li>
          ))}
          {unattributed > 0 && (
            <li className="flex items-baseline justify-between gap-3 text-sm font-medium text-brand-black/70">
              <span>לא משויך (לפני תחילת המעקב)</span>
              <span className="font-bold">{unattributed.toLocaleString('he-IL')}</span>
            </li>
          )}
        </ul>
      )}

      {campaign.isActive && (
        <Link
          href={`/campaign/${campaign.slug}`}
          className="mt-4 inline-block bg-brand-red text-white font-bold px-4 py-2 rounded-sm hover:opacity-90"
        >
          להצטרף לקמפיין
        </Link>
      )}
    </div>
  )
}
