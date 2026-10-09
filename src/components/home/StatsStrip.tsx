interface Props {
  totalSends: number
  campaignCount: number
  activeCount: number
}

export default function StatsStrip({ totalSends, campaignCount, activeCount }: Props) {
  const stats = [
    { value: totalSends, label: 'הודעות נשלחו' },
    { value: campaignCount, label: 'קמפיינים' },
    { value: activeCount, label: 'פעילים עכשיו' },
  ]

  return (
    <div className="grid grid-cols-3 border-2 border-brand-black rounded-sm bg-white">
      {stats.map((s, i) => (
        <div key={s.label} className={`py-4 px-2 text-center ${i > 0 ? 'border-r-2 border-brand-black' : ''}`}>
          <div className="font-black text-3xl sm:text-4xl text-brand-black">{s.value.toLocaleString('he-IL')}</div>
          <div className="font-medium text-xs sm:text-sm text-brand-black mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
