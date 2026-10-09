import type { CampaignStat } from '@/lib/stats'

interface Props {
  campaigns: CampaignStat[]
}

export default function HighScore({ campaigns }: Props) {
  if (campaigns.length === 0) return null

  return (
    <section>
      <h2 className="font-black text-2xl text-brand-black mb-3">
        <span className="text-brand-red ml-2" aria-hidden="true">◆</span>
        טבלת שיאים
      </h2>
      <ol className="bg-brand-black text-white rounded-sm divide-y divide-white/20">
        {campaigns.map((c, i) => (
          <li key={c.id} className="flex items-center gap-3 px-4 py-3">
            <span className={`font-black text-2xl w-8 shrink-0 ${i === 0 ? 'text-brand-yellow' : 'text-white'}`}>
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-bold leading-snug">{c.title}</div>
              <div className="text-xs font-medium text-white/70">{c.isActive ? 'פעיל' : 'הסתיים'}</div>
            </div>
            <span className="font-black text-2xl shrink-0">{c.total.toLocaleString('he-IL')}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
