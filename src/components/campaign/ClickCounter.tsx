interface Props {
  count: number
}

export default function ClickCounter({ count }: Props) {
  if (count === 0) return null

  return (
    <div className="w-full text-center py-5 bg-brand-black rounded-sm">
      <div className="font-black text-5xl text-brand-yellow">
        {count.toLocaleString('he-IL')}
      </div>
      <div className="text-white font-medium text-sm mt-1">
        תושבות ותושבים כבר הצטרפו לפעולה
      </div>
    </div>
  )
}
