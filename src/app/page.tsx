export const dynamic = 'force-dynamic'

import { getHomepageStats } from '@/lib/stats'
import HomeHero from '@/components/home/HomeHero'
import StatsStrip from '@/components/home/StatsStrip'
import HighScore from '@/components/home/HighScore'
import CampaignStatsCard from '@/components/home/CampaignStatsCard'
import CampaignFooter from '@/components/campaign/CampaignFooter'

export default async function Home() {
  const stats = await getHomepageStats()

  return (
    <main className="min-h-screen bg-brand-yellow flex flex-col">
      <div className="flex-1 px-4 py-10 max-w-2xl mx-auto w-full space-y-10">
        <HomeHero />

        <StatsStrip
          totalSends={stats.totalSends}
          campaignCount={stats.campaignCount}
          activeCount={stats.activeCount}
        />

        <HighScore campaigns={stats.topCampaigns} />

        <section>
          <h2 className="font-black text-2xl text-brand-black mb-3">
            <span className="text-brand-red ml-2" aria-hidden="true">◆</span>
            כל הקמפיינים
          </h2>
          {stats.campaigns.length === 0 ? (
            <p className="font-medium text-brand-black">עוד אין קמפיינים. בקרוב.</p>
          ) : (
            <div className="space-y-4">
              {stats.campaigns.map((c) => (
                <CampaignStatsCard key={c.id} campaign={c} />
              ))}
            </div>
          )}
        </section>
      </div>

      <CampaignFooter />
    </main>
  )
}
