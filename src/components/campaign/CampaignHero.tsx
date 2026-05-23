interface Props {
  title: string
  description: string
  imageUrl?: string
}

export default function CampaignHero({ title, description, imageUrl }: Props) {
  return (
    <div className="w-full text-center">
      {/* Alarm clock — movement mascot */}
      <img src="/alarm-clock.svg" alt="" aria-hidden="true" className="w-32 h-32 mb-4 mx-auto select-none" />

      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="w-full h-auto mb-6 rounded-sm"
        />
      )}

      <h1 className="font-black text-4xl text-brand-black leading-tight mb-3">
        {title}
      </h1>

      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-brand-red text-base" aria-hidden="true">◆</span>
        <span className="text-brand-black font-medium text-sm">רחובות מתעוררת</span>
        <span className="text-brand-red text-base" aria-hidden="true">◆</span>
      </div>

      <p className="text-brand-black font-medium text-lg leading-relaxed whitespace-pre-wrap">{description}</p>
    </div>
  )
}
