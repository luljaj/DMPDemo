import { useMemo, useState } from 'react'
import { OverviewCards } from './components/OverviewCards'
import { RankingTable } from './components/RankingTable'
import { TitleDetailPanel } from './components/TitleDetailPanel'
import { WeightAdjuster } from './components/WeightAdjuster'
import { REGIONS } from './data/regions'
import { TITLES } from './data/titles'
import type { RegionFilter, ScoreMetricKey, ScoreWeights } from './data/types'
import {
  computeRankedTitles,
  DEFAULT_WEIGHTS,
  rebalanceWeights,
} from './utils/scoring'

function App() {
  const [weights, setWeights] = useState<ScoreWeights>(DEFAULT_WEIGHTS)
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('GLOBAL')
  const [selectedTitleId, setSelectedTitleId] = useState<string | null>(null)

  const rankedTitles = useMemo(
    () => computeRankedTitles(TITLES, weights, regionFilter),
    [weights, regionFilter],
  )

  const selectedTitle = useMemo(() => {
    if (!selectedTitleId) {
      return null
    }

    return rankedTitles.find((row) => row.title.id === selectedTitleId) ?? null
  }, [rankedTitles, selectedTitleId])

  const handleWeightChange = (metric: ScoreMetricKey, value: number) => {
    setWeights((current) => rebalanceWeights(current, metric, value))
  }

  const handleSelectTitle = (id: string) => {
    setSelectedTitleId(id)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b0e14] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(249,115,22,0.18),transparent_40%),radial-gradient(circle_at_85%_5%,rgba(239,68,68,0.12),transparent_45%),linear-gradient(120deg,rgba(15,23,42,0.92),rgba(2,6,23,1))]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />

      <main className="relative mx-auto flex w-full max-w-[1380px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <header className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_12px_50px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
                Franchise Candidate Algorithm Demo
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                Prototype Dashboard
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                Synthetic scoring model for franchise expansion prioritization. All metrics are fabricated for demo storytelling and UI prototyping.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                Region Context
                <select
                  value={regionFilter}
                  onChange={(event) => setRegionFilter(event.target.value as RegionFilter)}
                  className="rounded-lg border border-white/20 bg-slate-950/80 px-3 py-2 text-sm font-medium text-slate-100 outline-none transition focus:border-orange-300"
                >
                  <option value="GLOBAL">Global</option>
                  {REGIONS.map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-300">
                <p className="font-semibold uppercase tracking-wide text-slate-400">Scoring Formula</p>
                <p className="mt-1 leading-relaxed">
                  Score = 0.25C + 0.20R + 0.20Ret + 0.15M + 0.10A + 0.10B
                </p>
                <p className="mt-1 text-[11px] text-slate-500">(weights update live via sliders)</p>
              </div>
            </div>
          </div>
        </header>

        <OverviewCards rows={rankedTitles} />

        <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <WeightAdjuster
            weights={weights}
            onMetricChange={handleWeightChange}
            onReset={() => setWeights(DEFAULT_WEIGHTS)}
          />

          <RankingTable
            rows={rankedTitles}
            selectedId={selectedTitleId}
            onSelect={(row) => handleSelectTitle(row.title.id)}
          />
        </section>
      </main>

      <TitleDetailPanel
        selected={selectedTitle}
        region={regionFilter}
        onClose={() => setSelectedTitleId(null)}
      />
    </div>
  )
}

export default App
