export default function HomeHero() {
  return (
    <div className="w-full text-center">
      {/* Alarm clock — movement mascot */}
      <img src="/alarm-clock.svg" alt="" aria-hidden="true" className="w-32 h-32 mb-4 mx-auto select-none" />

      <h1 className="font-black text-5xl text-brand-black leading-tight mb-3">רחובות מתעוררת</h1>

      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-brand-red text-base" aria-hidden="true">◆</span>
        <span className="text-brand-black font-medium text-sm">תושבות ותושבים שלוקחים אחריות על העיר</span>
        <span className="text-brand-red text-base" aria-hidden="true">◆</span>
      </div>

      <p className="text-brand-black font-medium text-lg leading-relaxed">
        כאן תושבות ותושבי רחובות שולחים הודעות וואטסאפ ישירות למקבלי ההחלטות בעיר, בלחיצה אחת.
        כל קמפיין מתמקד בנושא אחד, וכל הודעה שנשלחת נספרת. ככה רואים כמה אנחנו, ומקבלי ההחלטות שומעים אותנו.
      </p>
    </div>
  )
}
